import { createWriteStream, existsSync, mkdirSync, WriteStream } from "node:fs";
import path from "node:path";
import { Writable, WritableOptions } from "node:stream";

import { normalizeDomain } from "@/utils/part/mapper/utils";
import { Name as Products } from "@/utils/part/product";

export interface CrawlStorageAdapter<T = any> {
  initialize(domain: string, product: Products): Promise<void> | void;
  write(domain: string, product: Products, items: T[]): Promise<void> | void;
  finalize(domain: string, product: Products): Promise<void> | void;
}

export class LocalFileStorageAdapter<
  T = any,
> implements CrawlStorageAdapter<T> {
  private writeStreams: Record<string, WriteStream> = {};

  constructor(
    private saveDir: string,
    private transform: (item: T) => string = (item) => JSON.stringify(item)
  ) {}

  private getStreamKey(domain: string, product: Products): string {
    const domainKey = normalizeDomain(domain);
    return `${domainKey}:${product}`;
  }

  private getFilePath(domain: string, product: Products): string {
    const domainKey = normalizeDomain(domain);
    const targetDir = path.isAbsolute(this.saveDir)
      ? path.join(this.saveDir, domainKey)
      : path.join(process.cwd(), this.saveDir, domainKey);

    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }
    return path.join(targetDir, `${product}.jsonl`);
  }

  async initialize(domain: string, product: Products): Promise<void> {
    const key = this.getStreamKey(domain, product);
    const filePath = this.getFilePath(domain, product);
    this.writeStreams[key] = createWriteStream(filePath, { flags: "a" });
  }

  async write(domain: string, product: Products, items: T[]): Promise<void> {
    const key = this.getStreamKey(domain, product);
    let stream = this.writeStreams[key];

    if (!stream) {
      await this.initialize(domain, product);
      stream = this.writeStreams[key];
    }

    for (const item of items) {
      const transformed = this.transform(item);
      stream.write(transformed + "\n");
    }
  }

  async finalize(domain: string, product: Products): Promise<void> {
    const key = this.getStreamKey(domain, product);
    const stream = this.writeStreams[key];
    if (stream) {
      await new Promise<void>((resolve) => stream.end(resolve));
      delete this.writeStreams[key];
    }
  }
}

export class StreamStorageWriter extends Writable {
  constructor(
    private adapter: CrawlStorageAdapter<any>,
    options?: Omit<WritableOptions, "objectMode">
  ) {
    super({ objectMode: true, ...options });
  }

  async _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): Promise<void> {
    if (chunk && typeof chunk === "object" && !("error" in chunk)) {
      try {
        const product = chunk.product || "result";
        const domain = chunk.domain || "default";
        const items = Array.isArray(chunk.items) ? chunk.items : [chunk];

        await this.adapter.write(domain, product, items);
        callback();
      } catch (err: any) {
        callback(err);
      }
    } else {
      callback();
    }
  }

  async _final(callback: (error?: Error | null) => void): Promise<void> {
    try {
      callback();
    } catch (err: any) {
      callback(err);
    }
  }
}
export class DatabaseStorageAdapter<T = any> implements CrawlStorageAdapter<T> {
  constructor(private transform: (item: T) => any = (item) => item) {}

  async initialize(domain: string, product: Products): Promise<void> {
    console.log(
      `[DB STORAGE] Initializing database connection for ${domain} - ${product}`
    );
  }

  async write(domain: string, product: Products, items: T[]): Promise<void> {
    const transformed = items.map(this.transform);
    console.log(
      `[DB STORAGE] Saving ${transformed.length} items to database for ${domain} - ${product}`
    );
  }

  async finalize(domain: string, product: Products): Promise<void> {
    console.log(
      `[DB STORAGE] Finalizing database connection for ${domain} - ${product}`
    );
  }
}
