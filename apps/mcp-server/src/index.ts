import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import cors from "cors";
import express from "express";

import { registerAllTools } from "./tools";

// Determine Transport and Run Server
const transportMode = process.env.TRANSPORT || (process.env.PORT ? "sse" : "stdio");

async function main() {
  if (transportMode === "sse") {
    const port = Number(process.env.PORT || 3012);
    const app = express();
    app.use(cors());
    app.use(express.json());

    const activeTransports: Record<string, SSEServerTransport> = {};

    // SSE connection endpoint
    app.get("/sse", async (req, res) => {
      console.error("New SSE connection established");
      const transport = new SSEServerTransport("/sse", res);
      activeTransports[transport.sessionId] = transport;

      const sessionServer = new McpServer({
        name: "pc-builder-mcp-server",
        version: "1.0.0",
      });
      registerAllTools(sessionServer);

      res.on("close", () => {
        console.error(`SSE connection closed for session: ${transport.sessionId}`);
        delete activeTransports[transport.sessionId];
        sessionServer.close().catch((error) => {
          console.error(`Error closing McpServer for session ${transport.sessionId}:`, error);
        });
      });

      await sessionServer.connect(transport);
    });

    // Message handler endpoint
    app.post("/sse", async (req, res) => {
      const sessionId = (req.query.sessionId as string) || (req.headers["mcp-session-id"] as string);
      if (!sessionId) {
        res.status(400).send("Missing sessionId query parameter or mcp-session-id header.");
        return;
      }

      const transport = activeTransports[sessionId];
      if (!transport) {
        res.status(400).send(`SSE transport not found for session ID: ${sessionId}`);
        return;
      }

      await transport.handlePostMessage(req, res, req.body);
    });

    app.listen(port, () => {
      console.error(`PC Builder MCP SSE Server listening on port ${port}`);
      console.error(`SSE endpoint: http://localhost:${port}/sse`);
    });
  } else {
    // Default to stdio transport
    const transport = new StdioServerTransport();
    const stdioServer = new McpServer({
      name: "pc-builder-mcp-server",
      version: "1.0.0",
    });
    registerAllTools(stdioServer);
    await stdioServer.connect(transport);
    console.error("PC Builder MCP Stdio Server running on stdio");
  }
}

main().catch((error) => {
  console.error("Fatal error running MCP server:", error);
  process.exit(1);
});
