import { Writable, WritableOptions } from "node:stream";
import { createWriteStream, WriteStream, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

type MonitorOptions = WritableOptions & {
  logPath?: string;
};

/**
 * A Writable stream that acts as a logging monitor.
 * It consumes the aggregated stream from the crawler and writes formatted logs to a file.
 */
export class StreamMonitor extends Writable {
  private readonly logStream: WriteStream;

  constructor(options?: MonitorOptions) {
    super({ objectMode: true, ...options });
    const logDir = options?.logPath ?? "./logs";

    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }

    this.logStream = createWriteStream(path.join(logDir, "monitor.log"), {
      flags: "a",
    });
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
    const { type, message } = this.getLogDetails(chunk);

    const logLine = `[${timestamp}] [${type}] ${message}\n`;
    this.logStream.write(logLine, callback);
  }

  /**
   * Helper to extract log type and message from a chunk.
   * @param chunk The event object (Fetch, Parse, Extract, Error, etc.).
   * @returns Object containing log type and message string.
   */
  private getLogDetails(chunk: any): { type: string; message: string } {
    if (chunk instanceof Error || chunk?.error) {
      const err = chunk instanceof Error ? chunk : chunk.error;
      return {
        type: "ERROR",
        message: err.message || JSON.stringify(err),
      };
    }

    if (chunk?.response) {
      return {
        type: "FETCH",
        message: `Fetched ${chunk.info?.request?.url}`,
      };
    }

    if (chunk?.result) {
      return {
        type: "PARSE",
        message: `Parsed data: ${JSON.stringify(chunk.result).substring(
          0,
          100
        )}...`,
      };
    }

    if (chunk?.raw) {
      return {
        type: "EXTRACT",
        message: `Extracted raw item for ${chunk.info?.request?.url}`,
      };
    }

    return {
      type: "DATA",
      message: JSON.stringify(chunk),
    };
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
