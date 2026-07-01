import { Controller, Get, Post, Body, Query, UsePipes } from "@nestjs/common";
import {
  CrawlStartPayload,
  CrawlStopPayload,
  CrawlTestPayload,
  CrawlExtractPayload,
  CrawlIngestPayload,
  CrawlStartSchema,
  CrawlStopSchema,
  CrawlTestSchema,
  CrawlExtractSchema,
  CrawlIngestSchema,
  CrawlTraceIngestSchema,
  CrawlTraceIngestPayload,
} from "@pc-builder/shared/crawler";
import { Roles } from "@pc-builder/shared/user";
import { Role } from "src/utils/role/role.decorator";
import { ZodValidationPipe } from "src/utils/utils.modules";

import { CrawlerService } from "./crawler.service";

@Controller("crawler")
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  // 1. Ingest crawled results (Private / Internal endpoint)
  // No Role decorator means it's accessible without auth (used internally by Express crawler service)
  @Post("ingest")
  @UsePipes(new ZodValidationPipe(CrawlIngestSchema))
  async ingest(@Body() body: CrawlIngestPayload) {
    return this.crawlerService.ingestProducts(body.items);
  }

  // 2. GET /crawler/scrapers - List all scrapers
  @Get("scrapers")
  @Role(Roles.ADMIN)
  async getScrapers() {
    return this.crawlerService.listScrapers();
  }

  // 3. POST /crawler/start - Start crawling
  @Post("start")
  @Role(Roles.ADMIN)
  @UsePipes(new ZodValidationPipe(CrawlStartSchema))
  async startCrawl(@Body() body: CrawlStartPayload) {
    return this.crawlerService.startCrawl(body.name, body.products);
  }

  // 4. POST /crawler/stop - Stop crawling
  @Post("stop")
  @Role(Roles.ADMIN)
  @UsePipes(new ZodValidationPipe(CrawlStopSchema))
  async stopCrawl(@Body() body: CrawlStopPayload) {
    return this.crawlerService.stopCrawl(body.name);
  }

  // 5. GET /crawler/status - Monitor progress
  @Get("status")
  @Role(Roles.ADMIN)
  async getStatus() {
    return this.crawlerService.getCrawlStatus();
  }

  // 6. POST /crawler/test - Test a scraper on page 1
  @Post("test")
  @Role(Roles.ADMIN)
  @UsePipes(new ZodValidationPipe(CrawlTestSchema))
  async testCrawl(@Body() body: CrawlTestPayload) {
    return this.crawlerService.testCrawl(body.name, body.product);
  }

  // 7. POST /crawler/extract - Extract manually from URL
  @Post("extract")
  @Role(Roles.ADMIN)
  @UsePipes(new ZodValidationPipe(CrawlExtractSchema))
  async extractUrl(@Body() body: CrawlExtractPayload) {
    return this.crawlerService.extractUrl(body.name, body.url, body.product);
  }

  // 8. Ingest crawl trace logs (Private / Internal endpoint)
  @Post("trace")
  @UsePipes(new ZodValidationPipe(CrawlTraceIngestSchema))
  async ingestTrace(@Body() body: CrawlTraceIngestPayload) {
    return this.crawlerService.ingestCrawlTraces(body.traces);
  }

  // 9. GET /crawler/traces - Query crawl trace logs (Admin only)
  @Get("traces")
  @Role(Roles.ADMIN)
  async getTraces(
    @Query("sessionId") sessionId?: string,
    @Query("scraperName") scraperName?: string,
    @Query("product") product?: string,
    @Query("status") status?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.crawlerService.getCrawlTraces({
      sessionId,
      scraperName,
      product,
      status,
      page,
      limit,
    });
  }
}
