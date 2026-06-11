import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { CrawlCache } from "../types/interface";

/**
 * High-performance temporary file-based cache to offload heavy web payloads
 * from Node.js RAM to local SSD storage, preventing Out of Memory (OOM) crashes.
 * Supports universal types (objects, strings, arrays, etc.) via automatic serialization.
 */
export class LocalFileCache implements CrawlCache {
  private cacheDir: string;

  constructor() {
    this.cacheDir = path.join(os.tmpdir(), "pc-builder-crawler-cache");
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }

    // Register exit/cleanup handlers to prevent bloating tmp directory
    process.on("exit", () => this.cleanupSync());
    process.on("SIGINT", () => {
      this.cleanupSync();
      process.exit(0);
    });
    process.on("SIGTERM", () => {
      this.cleanupSync();
      process.exit(0);
    });
  }

  private cleanupSync(): void {
    try {
      if (fs.existsSync(this.cacheDir)) {
        const files = fs.readdirSync(this.cacheDir);
        for (const file of files) {
          fs.unlinkSync(path.join(this.cacheDir, file));
        }
        fs.rmdirSync(this.cacheDir);
      }
    } catch {
      // Ignore errors to guarantee no exit failures
    }
  }

  private getFilePath(key: string): string {
    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, "_");
    return path.join(this.cacheDir, `${safeKey}.tmp`);
  }

  async set<T = any>(key: string, value: T): Promise<void> {
    const filePath = this.getFilePath(key);
    const payload = JSON.stringify({
      type: typeof value,
      data: value,
    });
    await fs.promises.writeFile(filePath, payload, "utf-8");
  }

  async get<T = any>(key: string): Promise<T> {
    const filePath = this.getFilePath(key);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Cache miss for key: ${key}`);
    }
    const raw = await fs.promises.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed.data as T;
  }

  async delete(key: string): Promise<void> {
    const filePath = this.getFilePath(key);
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch {
      // Ignore errors when deleting
    }
  }
}

/**
 * Hybrid cache that keeps small payloads (<50KB) in memory (Map)
 * and falls back to LocalFileCache for large HTML documents.
 */
export class HybridCrawlCache implements CrawlCache {
  private memoryCache = new Map<string, { type: string; data: any }>();
  private fileCache = new LocalFileCache();
  private sizeThreshold = 50 * 1024; // 50 KB

  async set<T = any>(key: string, value: T): Promise<void> {
    const payload = JSON.stringify({
      type: typeof value,
      data: value,
    });

    if (payload.length > this.sizeThreshold) {
      await this.fileCache.set(key, value);
    } else {
      this.memoryCache.set(key, { type: typeof value, data: value });
    }
  }

  async get<T = any>(key: string): Promise<T> {
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key)!.data as T;
    }
    return await this.fileCache.get<T>(key);
  }

  async delete(key: string): Promise<void> {
    if (this.memoryCache.has(key)) {
      this.memoryCache.delete(key);
    } else {
      await this.fileCache.delete(key);
    }
  }
}
