import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel as InjectMongooseModel } from "@nestjs/mongoose";
import { InjectModel } from "@nestjs/sequelize";
import {
  CrawlIngestItem,
  ScraperInfo,
  CrawlerSession,
  Products,
  CrawlProcessLog,
} from "@pc-builder/shared/crawler";
import { normalizeDomain } from "@pc-builder/shared/part/mapper/utils";
import { Model } from "mongoose";

import RetailProduct from "@/models/sellers/SellerProduct.entity";

import { CrawlProcessLogClass } from "./entities/CrawlProcessLog.entity";

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);
  private readonly crawlerServiceUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(RetailProduct)
    private readonly retailProductModel: typeof RetailProduct,
    @InjectMongooseModel(CrawlProcessLogClass.name)
    private readonly crawlLogModel: Model<CrawlProcessLogClass>
  ) {
    this.crawlerServiceUrl =
      this.configService.get<string>("CRAWLER_SERVICE_URL") || "http://crawler:5001";
  }

  // Bulk save crawled results to database
  async ingestProducts(items: CrawlIngestItem[]): Promise<{ count: number }> {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return { count: 0 };
    }

    this.logger.log(`Ingesting batch of ${items.length} crawled products.`);

    const records = items.map((item) => {
      const { result, info } = item;
      const url = info.url || "";

      let retailer = "default";
      if (url) {
        try {
          const hostname = new URL(url).hostname;
          retailer = normalizeDomain(hostname);
        } catch {
          retailer = normalizeDomain(url);
        }
      }

      return {
        link: result.link,
        retailer,
        name: result.name,
        price: result.price || 0,
        img: result.img || null,
        availability: result.availability || false,
      };
    });

    try {
      // Sequelize bulkCreate with updateOnDuplicate maps to INSERT ... ON DUPLICATE KEY UPDATE in MySQL
      await this.retailProductModel.bulkCreate(records, {
        updateOnDuplicate: ["name", "price", "img", "availability"],
      });
      return { count: records.length };
    } catch (err: any) {
      this.logger.error("Failed to bulk upsert crawled products:", err);
      throw new InternalServerErrorException(`Database ingestion failed: ${err.message}`);
    }
  }

  // Proxy helpers to communicate with the Express crawler service
  private async callCrawler(endpoint: string, method: "GET" | "POST", body?: any): Promise<any> {
    const url = `${this.crawlerServiceUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Crawler service returned error status ${response.status}: ${errorText}`);
        throw new BadRequestException(`Crawler service error: ${response.statusText}`);
      }

      return await response.json();
    } catch (err: any) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      this.logger.error(`Failed to connect to crawler service at ${url}:`, err);
      throw new InternalServerErrorException(`Crawler service unreachable: ${err.message}`);
    }
  }

  async listScrapers(): Promise<ScraperInfo[]> {
    return this.callCrawler("/scrapers", "GET");
  }

  async startCrawl(
    name: string,
    products?: Products[]
  ): Promise<{ message: string; session: CrawlerSession }> {
    return this.callCrawler("/start", "POST", { name, products });
  }

  async stopCrawl(name: string): Promise<{ message: string; session: CrawlerSession }> {
    return this.callCrawler("/stop", "POST", { name });
  }

  async getCrawlStatus(): Promise<CrawlerSession[]> {
    return this.callCrawler("/status", "GET");
  }

  async testCrawl(
    name: string,
    product: Products
  ): Promise<{ success: boolean; count: number; items: any[] }> {
    return this.callCrawler("/test", "POST", { name, product });
  }

  async extractUrl(
    name: string,
    url: string,
    product: Products
  ): Promise<{ success: boolean; count: number; items: any[] }> {
    return this.callCrawler("/extract", "POST", { name, url, product });
  }

  async ingestCrawlTraces(traces: CrawlProcessLog[]): Promise<{ count: number }> {
    if (!traces || !Array.isArray(traces) || traces.length === 0) {
      return { count: 0 };
    }
    this.logger.log(`Ingesting batch of ${traces.length} crawl trace logs into MongoDB.`);
    try {
      await this.crawlLogModel.insertMany(traces);
      return { count: traces.length };
    } catch (err: any) {
      this.logger.error("Failed to bulk save crawl trace logs to MongoDB:", err);
      throw new InternalServerErrorException(`MongoDB trace ingestion failed: ${err.message}`);
    }
  }

  async getCrawlTraces(params: {
    sessionId?: string;
    scraperName?: string;
    product?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params.page ? Number(params.page) : 1;
    const limit = params.limit ? Number(params.limit) : 50;
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    if (params.sessionId) query.sessionId = params.sessionId;
    if (params.scraperName) query.scraperName = params.scraperName;
    if (params.product) query.product = params.product;
    if (params.status) query.status = params.status;

    try {
      const [list, total] = await Promise.all([
        this.crawlLogModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
        this.crawlLogModel.countDocuments(query).exec(),
      ]);

      return {
        list,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };
    } catch (err: any) {
      this.logger.error("Failed to query crawl trace logs from MongoDB:", err);
      throw new InternalServerErrorException(`Failed to retrieve trace logs: ${err.message}`);
    }
  }
}
