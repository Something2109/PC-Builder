import { normalizeDomain } from "@pc-builder/shared";
import { createWriteStream, WriteStream, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { Writable, WritableOptions } from "node:stream";

import { HybridCrawlCache } from "../storage/cache";
import { ErrorObject } from "../types/interface";

export class ErrorHandler extends Writable {
  private readonly logStream: WriteStream;
  private readonly sessionId?: string;
  private readonly cache = new HybridCrawlCache();

  constructor(options: WritableOptions & { path: string; sessionId?: string }) {
    super({ objectMode: true, ...options });
    this.sessionId = options.sessionId;
    if (!existsSync(options.path)) {
      mkdirSync(options.path, { recursive: true });
    }
    this.logStream = createWriteStream(
      path.join(options.path, "failed_requests.jsonl"),
      { flags: "a" } // Append mode
    );
  }

  async _write(
    chunk: ErrorObject,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): Promise<void> {
    if (chunk?.error) {
      const info = chunk.info;
      let urlObj: any = info?.data?.init?.url;
      if (!urlObj && info?.request) {
        if (typeof info.request === "object" && "url" in info.request) {
          urlObj = (info.request as any).url;
        } else {
          urlObj = info.request;
        }
      }
      let url = "";
      if (urlObj) {
        url = urlObj.toString();
      }

      let rawPayload = "";
      if (info?.data?.fetch) {
        try {
          rawPayload = await this.cache.get<string>(info.data.fetch);
        } catch {}
      }

      let domain = "default";
      if (urlObj) {
        try {
          const hostname = urlObj instanceof URL ? urlObj.hostname : new URL(url).hostname;
          domain = normalizeDomain(hostname);
        } catch {
          domain = normalizeDomain(url);
        }
      }

      const trace = {
        sessionId: this.sessionId || "manual-run",
        scraperName: domain,
        product: info?.product,
        url,
        status: "FAILED",
        fetchStage: {
          statusCode: info?.stage === "init" ? 0 : 200,
          responseTimeMs: 0,
          rawPayload: rawPayload || undefined,
        },
        extractStage: {
          success: info?.stage === "parse",
          itemsCount: 0,
        },
        parseStage: {
          success: false,
        },
        errorDetails: {
          stage: info?.stage || "unknown",
          message: chunk.error.message || String(chunk.error),
          stack: chunk.error.stack,
        },
        createdAt: new Date().toISOString(),
      };

      const logEntry = {
        ...chunk,
        error: {
          name: chunk.error.name,
          message: chunk.error.message,
          stack: chunk.error.stack,
        },
      };
      this.logStream.write(JSON.stringify(logEntry) + "\n", (err) => {
        if (process.connected) {
          process.send?.({ trace });
          process.send?.({ error: logEntry.error, info: chunk.info });
        }
        callback(err);
      });
    } else {
      callback();
    }
  }

  _final(callback: (error?: Error | null) => void): void {
    this.logStream.end(callback);
  }
}
