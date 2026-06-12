import { Controller, Get, Post, Body, Query, UseGuards } from "@nestjs/common";
import { Role } from "src/utils/role/role.decorator";

import { Roles } from "@/utils/user";

import { CrawlerService } from "./crawler.service";

@Controller("crawler")
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  // 1. Ingest crawled results (Private / Internal endpoint)
  // No Role decorator means it's accessible without auth (used internally by Express crawler service)
  @Post("ingest")
  async ingest(@Body() body: { items: any[] }) {
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
  async startCrawl(@Body() body: { name: string; products?: string[] }) {
    return this.crawlerService.startCrawl(body.name, body.products);
  }

  // 4. POST /crawler/stop - Stop crawling
  @Post("stop")
  @Role(Roles.ADMIN)
  async stopCrawl(@Body() body: { name: string }) {
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
  async testCrawl(@Body() body: { name: string; product: string }) {
    return this.crawlerService.testCrawl(body.name, body.product);
  }

  // 7. POST /crawler/extract - Extract manually from URL
  @Post("extract")
  @Role(Roles.ADMIN)
  async extractUrl(@Body() body: { name: string; url: string; product: string }) {
    return this.crawlerService.extractUrl(body.name, body.url, body.product);
  }
}
