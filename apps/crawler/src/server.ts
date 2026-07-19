import {
  CrawlerSession,
  CrawlIngestItem,
  ScraperType,
  CrawlState,
  CrawlStartSchema,
  CrawlStopSchema,
  CrawlTestSchema,
  CrawlExtractSchema,
  Products,
} from "@pc-builder/shared";
import cors from "cors";
import express, { Request, Response } from "express";
import { fork, ChildProcess } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { ZodError } from "zod";

import { defaultStealthFetch } from "./core/fetcher";
import { APIWebsiteInfo, InternalStage } from "./types/interface";

const app = express();
const PORT = process.env.PORT || 5001;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

app.use(cors());
app.use(express.json());

const activeSessions = new Map<string, { child: ChildProcess; session: CrawlerSession }>();

// Helper to fetch with retry and exponential backoff
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  delayMs = 1000
): Promise<globalThis.Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok && retries > 0) {
      console.warn(
        `[Crawler Server] Request to ${url} failed with status ${response.status}. Retrying in ${delayMs}ms... (${retries} retries left)`
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return fetchWithRetry(url, options, retries - 1, delayMs * 2);
    }
    return response;
  } catch (err) {
    if (retries > 0) {
      console.warn(
        `[Crawler Server] Request to ${url} failed with error. Retrying in ${delayMs}ms... (${retries} retries left)`,
        err
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return fetchWithRetry(url, options, retries - 1, delayMs * 2);
    }
    throw err;
  }
}

// Helper to resolve scraper configurations
const crawlersDir = path.join(__dirname, "crawlers");

function getScrapersList() {
  const scrapers: Array<{
    name: string;
    domain: string;
    type: ScraperType;
    path: string;
    supportedProducts?: Products[];
  }> = [];
  const subdirs = ["sellers", "parts"] as const;

  for (const dir of subdirs) {
    const dirPath = path.join(crawlersDir, dir);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      if ((file.endsWith(".ts") || file.endsWith(".js")) && !file.endsWith(".d.ts")) {
        const name = path.basename(file, path.extname(file));
        const filePath = path.join(dirPath, file);
        try {
          const config = require(filePath).default;
          if (config && config.domain) {
            scrapers.push({
              name,
              domain: config.domain,
              type: dir === "sellers" ? ScraperType.SELLERS : ScraperType.PARTS,
              path: filePath,
              supportedProducts: config.supportedProducts || [],
            });
          }
        } catch (err) {
          console.error(`Failed to load scraper config ${file}:`, err);
        }
      }
    }
  }
  return scrapers;
}

// 1. GET /scrapers - List available scrapers
app.get("/scrapers", (req: Request, res: Response) => {
  try {
    const list = getScrapersList().map(({ name, domain, type, supportedProducts }) => ({
      name,
      domain,
      type,
      supportedProducts,
    }));
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST /start - Start crawling session
app.post("/start", (req: Request, res: Response) => {
  try {
    const { name, products } = CrawlStartSchema.parse(req.body);

    const scrapers = getScrapersList();
    const scraper = scrapers.find((s) => s.name === name);

    if (!scraper) {
      return res.status(404).json({ error: `Scraper '${name}' not found` });
    }

    if (activeSessions.has(name)) {
      const existing = activeSessions.get(name);
      if (existing?.session.state === CrawlState.CRAWLING) {
        return res.status(400).json({ error: `Scraper '${name}' is already crawling` });
      }
    }

    // Determine products to crawl
    const productsToCrawl =
      products && Array.isArray(products) ? products : scraper.supportedProducts || [];

    const sessionId = randomUUID();

    // Spawn child process
    const indexScript = fs.existsSync(path.join(__dirname, "index.ts"))
      ? path.join(__dirname, "index.ts")
      : path.join(__dirname, "index.js");

    const args = [
      "--path",
      scraper.path,
      "--product",
      ...productsToCrawl,
      "--session-id",
      sessionId,
    ];

    const child = fork(indexScript, args, {
      execArgv: indexScript.endsWith(".ts")
        ? ["-r", "ts-node/register", "-r", "tsconfig-paths/register"]
        : [],
    });

    const session: CrawlerSession = {
      name,
      domain: scraper.domain,
      type: scraper.type,
      products: productsToCrawl,
      state: CrawlState.CRAWLING,
      progress: {
        init: 0,
        fetch: 0,
        extract: 0,
        parse: 0,
        success: 0,
        failed: 0,
      },
      errors: [],
      startTime: new Date(),
    };

    activeSessions.set(name, { child, session });

    // Ingestion buffer
    let buffer: CrawlIngestItem[] = [];
    let bufferTimeout: NodeJS.Timeout | null = null;

    const flushBuffer = async () => {
      if (buffer.length === 0) return;
      const batch = [...buffer];
      buffer = [];
      if (bufferTimeout) {
        clearTimeout(bufferTimeout);
        bufferTimeout = null;
      }

      try {
        const response = await fetchWithRetry(`${BACKEND_URL}/crawler/ingest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: batch }),
        });
        if (!response.ok) {
          console.error(`[Crawler Server] Failed to ingest batch: ${response.statusText}`);
        }
      } catch (err) {
        console.error(`[Crawler Server] Error sending batch to backend:`, err);
      }
    };

    // Trace buffer
    let traceBuffer: any[] = [];
    let traceBufferTimeout: NodeJS.Timeout | null = null;

    const flushTraceBuffer = async () => {
      if (traceBuffer.length === 0) return;
      const batch = [...traceBuffer];
      traceBuffer = [];
      if (traceBufferTimeout) {
        clearTimeout(traceBufferTimeout);
        traceBufferTimeout = null;
      }

      try {
        const response = await fetchWithRetry(`${BACKEND_URL}/crawler/trace`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ traces: batch }),
        });
        if (!response.ok) {
          console.error(`[Crawler Server] Failed to ingest trace batch: ${response.statusText}`);
        }
      } catch (err) {
        console.error(`[Crawler Server] Error sending trace batch to backend:`, err);
      }
    };

    child.on("message", (message: any) => {
      if (message.progress) {
        session.progress = message.progress;
      } else if (message.result) {
        // Add result to buffer
        buffer.push({
          result: message.result,
          info: {
            product: message.info.product,
            url: message.info.data.init?.url || message.info.request?.url || message.info.request,
          },
        });

        if (buffer.length >= 100) {
          flushBuffer();
        } else if (!bufferTimeout) {
          bufferTimeout = setTimeout(flushBuffer, 1500);
        }
      } else if (message.trace) {
        traceBuffer.push(message.trace);
        if (traceBuffer.length >= 50) {
          flushTraceBuffer();
        } else if (!traceBufferTimeout) {
          traceBufferTimeout = setTimeout(flushTraceBuffer, 1500);
        }
      } else if (message.error) {
        session.errors.push(message.error);
      }
    });

    child.on("exit", (code) => {
      flushBuffer();
      flushTraceBuffer();
      session.state = code === 0 ? CrawlState.COMPLETED : CrawlState.FAILED;
      session.endTime = new Date();
      console.log(`[Crawler Server] Scraper '${name}' exited with code ${code}`);
    });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: "Validation failed", details: err.issues });
    }
    res.status(500).json({ error: err.message });
  }
});

// 3. POST /stop - Stop a crawl session
app.post("/stop", (req: Request, res: Response) => {
  try {
    const { name } = CrawlStopSchema.parse(req.body);

    const active = activeSessions.get(name);
    if (!active || active.session.state !== CrawlState.CRAWLING) {
      return res.status(400).json({ error: `No active crawling session found for '${name}'` });
    }

    active.child.kill("SIGINT");
    active.session.state = CrawlState.STOPPED;
    active.session.endTime = new Date();

    res.json({
      message: `Crawl session for '${name}' stopped`,
      session: active.session,
    });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: "Validation failed", details: err.issues });
    }
    res.status(500).json({ error: err.message });
  }
});

// 4. GET /status - Get status of all sessions
app.get("/status", (req: Request, res: Response) => {
  const list = Array.from(activeSessions.values()).map(({ session }) => session);
  res.json(list);
});

// Inprocess manual extraction helper
async function runManualExtraction(
  scraper: APIWebsiteInfo<unknown, unknown>,
  urlStr: string,
  product: Products
) {
  const url = new URL(urlStr);
  const fetcher = scraper.fetch || defaultStealthFetch;

  const requestObject = { url };
  const response = await fetcher(requestObject as any);

  let payload = "";
  if (response && typeof (response as any).text === "function") {
    payload = await (response as any).text();
  } else if (response && typeof (response as any).json === "function") {
    payload = JSON.stringify(await (response as any).json());
  } else if (response) {
    payload = String(response);
  }

  const mockResponse = {
    text: async () => payload,
    json: async () => JSON.parse(payload),
    ok: true,
    status: 200,
  } as any;

  const info: any = {
    request: url,
    product,
    stage: InternalStage.Fetch,
    data: {
      [InternalStage.Init]: requestObject,
      [InternalStage.Fetch]: payload,
    },
    index: 0,
  };

  const extractResult = await scraper.extract(mockResponse, info);

  const raw = Array.isArray(extractResult) ? extractResult : extractResult.raw;

  const parsedItems: any[] = [];

  for (let i = 0; i < raw.length; i++) {
    const rawItem = raw[i];
    let parsed = rawItem;
    if (scraper.parse) {
      const extractInfo = {
        ...info,
        stage: InternalStage.Extract,
        data: { ...info.data, [InternalStage.Extract]: rawItem },
      };
      parsed = await scraper.parse(rawItem, extractInfo);
    }
    parsedItems.push(parsed);
  }

  return parsedItems;
}

// 5. POST /test - Test a crawl on the first page in-process (does not save to DB)
app.post("/test", async (req: Request, res: Response) => {
  try {
    const { name, product } = CrawlTestSchema.parse(req.body);
    const scrapers = getScrapersList();
    const scraperConfig = scrapers.find((s) => s.name === name);

    if (!scraperConfig) {
      return res.status(404).json({ error: `Scraper '${name}' not found` });
    }

    const scraper: APIWebsiteInfo<any, any> = require(scraperConfig.path).default;
    if (!scraper.path) {
      return res.status(400).json({ error: `Scraper '${name}' does not support path generation` });
    }

    const requestOptions = scraper.path(product, 1);
    if (!requestOptions) {
      return res.status(400).json({
        error: `Product '${product}' not supported by scraper '${name}'`,
      });
    }

    const url =
      typeof requestOptions.request === "string" || requestOptions.request instanceof URL
        ? requestOptions.request.toString()
        : (requestOptions.request as any).url?.toString();

    if (!url) {
      return res.status(400).json({ error: "Could not resolve URL from scraper config" });
    }

    const results = await runManualExtraction(scraper, url, product);
    res.json({ success: true, count: results.length, items: results });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: "Validation failed", details: err.issues });
    }
    console.error("Error testing scraper:", err);
    res.status(500).json({ error: err.message });
  }
});

// 6. POST /extract - Manually extract from a specific URL in-process (saves to DB via backend ingest)
app.post("/extract", async (req: Request, res: Response) => {
  try {
    const { url, product, name } = CrawlExtractSchema.parse(req.body);
    const scrapers = getScrapersList();
    const scraperConfig = scrapers.find((s) => s.name === name);

    if (!scraperConfig) {
      return res.status(404).json({ error: `Scraper '${name}' not found` });
    }

    const scraper: APIWebsiteInfo<any, any> = require(scraperConfig.path).default;

    // Check if the domain matches the URL domain
    const urlHostname = new URL(url).hostname.replace("www.", "");
    const scraperHostname = new URL(scraper.domain).hostname.replace("www.", "");

    if (urlHostname !== scraperHostname) {
      return res.status(400).json({
        error: `URL domain '${urlHostname}' does not match scraper domain '${scraperHostname}'`,
      });
    }

    const results = await runManualExtraction(scraper, url, product);

    // Save results to DB via ingestion endpoint if we found items and it's a seller scraper
    if (results.length > 0 && scraperConfig.type === ScraperType.SELLERS) {
      const itemsToIngest = results.map((item) => ({
        result: item,
        info: { product, url },
      }));

      try {
        await fetchWithRetry(`${BACKEND_URL}/crawler/ingest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: itemsToIngest }),
        });
      } catch (ingestErr) {
        console.error("Ingestion error during manual extract:", ingestErr);
      }
    }

    res.json({ success: true, count: results.length, items: results });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: "Validation failed", details: err.issues });
    }
    console.error("Error during manual extract:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Crawler Server] Isolated Express.js crawler server running on port ${PORT}`);
});
