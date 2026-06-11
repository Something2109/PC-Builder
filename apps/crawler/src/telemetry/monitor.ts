import { createWriteStream, WriteStream, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { Writable, WritableOptions } from "node:stream";

import { CrawlInfo, ErrorObject, InternalStage } from "../types/interface";

type MonitorOptions = WritableOptions & {
  logPath?: string;
};

/**
 * A Writable stream that acts as a logging monitor.
 * It consumes the aggregated stream from the crawler and writes formatted logs to a file.
 */
export class StreamMonitor extends Writable {
  private readonly logStream: WriteStream;
  private readonly stats: Record<InternalStage, number> & {
    failed: number;
    success: number;
  };

  constructor(options?: MonitorOptions) {
    super({ objectMode: true, ...options });
    const logDir = options?.logPath ?? "./logs";

    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }

    this.logStream = createWriteStream(path.join(logDir, "monitor.log"), {
      flags: "a",
    });

    this.stats = {
      [InternalStage.Init]: 0,
      [InternalStage.Fetch]: 0,
      [InternalStage.Extract]: 0,
      [InternalStage.Parse]: 0,
      failed: 0,
      success: 0,
    };
  }

  /**
   * Writes a log entry.
   * Extracts details from the chunk and appends a formatted log line to the file.
   * @param chunk The log event/object.
   * @param encoding Encoding (ignored).
   * @param callback Callback when write is complete.
   */
  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    const timestamp = new Date().toISOString();
    const { type, message } = this.getLogDetails(chunk); // This will now also update stats

    const statsLog = `[${Object.entries(this.stats)
      .map(([k, v]) => `${k}:${v}`)
      .join(" ")}]`;

    const logLine = `[${timestamp}] ${statsLog} [${type}] ${message}\n`;
    this.logStream.write(logLine, callback);
  }

  /**
   * Helper to extract log type and message from a chunk.
   * @param chunk The event object (Fetch, Parse, Extract, Error, etc.).
   * @returns Object containing log type and message string.
   */
  private getLogDetails(chunk: ErrorObject | CrawlInfo): {
    type: string;
    message: string;
  } {
    if (chunk instanceof Error || "error" in chunk) {
      this.stats.failed++;
      const err = chunk instanceof Error ? chunk : chunk.error;
      return {
        type: "ERROR",
        message: err.message || JSON.stringify(err),
      };
    }

    this.stats[chunk.stage]++;
    const type = chunk.stage.toUpperCase();

    let message = JSON.stringify(chunk);
    switch (chunk.stage) {
      case InternalStage.Init: {
        message = `Initiated info from ${JSON.stringify(chunk.request)}`;
        break;
      }
      case InternalStage.Fetch: {
        message = `Fetched ${chunk.data[InternalStage.Init].url.toString()}`;
        break;
      }
      case InternalStage.Extract: {
        message = `Extracted raw item from ${
          chunk.data[InternalStage.Init].url
        }`;
        break;
      }
      case InternalStage.Parse:
        message = `Parsed data: ${JSON.stringify(
          (chunk.data as any)[InternalStage.Parse]
        ).substring(0, 50)}...`;
        break;
    }

    return { type, message };
  }

  /**
   * Finalizes the monitor stream.
   * Closes the file write stream.
   * @param callback Callback when finished.
   */
  _final(callback: (error?: Error | null) => void): void {
    this.logStream.end(callback);
  }
}
