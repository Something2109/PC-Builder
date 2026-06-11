import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export interface CrawlCache {
  set(key: string, value: string): Promise<void> | void;
  get(key: string): Promise<string> | string;
  delete(key: string): Promise<void> | void;
}

/**
 * High-performance temporary file-based cache to offload heavy web payloads
 * from Node.js RAM to local SSD storage, preventing Out of Memory (OOM) crashes.
 */
export class LocalFileCache implements CrawlCache {
  private cacheDir: string;

  constructor() {
    this.cacheDir = path.join(os.tmpdir(), "pc-builder-crawler-cache");
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private getFilePath(key: string): string {
    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, "_");
    return path.join(this.cacheDir, `${safeKey}.tmp`);
  }

  async set(key: string, value: string): Promise<void> {
    const filePath = this.getFilePath(key);
    await fs.promises.writeFile(filePath, value, "utf-8");
  }

  async get(key: string): Promise<string> {
    const filePath = this.getFilePath(key);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Cache miss for key: ${key}`);
    }
    return await fs.promises.readFile(filePath, "utf-8");
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
