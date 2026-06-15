import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import axios from "axios";

import {
  ListPartsSchema,
  GetPartDetailsSchema,
  ValidateBuildSchema,
  GetSuitablePartsSchema,
} from "./schemas";

const backendUrl = process.env.BACKEND_URL || "http://localhost:5000/api";

export function registerAllTools(server: McpServer) {
  // 1. Tool: list_parts
  server.registerTool(
    "list_parts",
    {
      description:
        "List and search PC parts (CPU, GPU, RAM, Motherboard, etc.) with pagination, sorting, and spec filters.",
      inputSchema: ListPartsSchema,
    },
    async ({ product, q, page, limit, sort_key, sort_order, filters }) => {
      let url = `${backendUrl}/part`;
      if (product) {
        url += `/${product}`;
      }

      const params: Record<string, any> = {
        ...filters,
        q,
        page,
        limit,
        sort_key,
        sort_order,
      };

      try {
        const response = await axios.get(url, { params });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error: any) {
        const errorMessage = error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message;
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error calling backend API: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  // 2. Tool: get_part_details
  server.registerTool(
    "get_part_details",
    {
      description:
        "Get comprehensive details of a specific PC part, including specifications, brand details, and pricing from various sellers.",
      inputSchema: GetPartDetailsSchema,
    },
    async ({ product, id }) => {
      const url = `${backendUrl}/part/${product}/${id}`;
      try {
        const response = await axios.get(url);
        return {
          content: [
            { type: "text", text: JSON.stringify(response.data, null, 2) },
          ],
        };
      } catch (error: any) {
        const errorMessage = error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message;
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error calling backend API: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  // 3. Tool: validate_build
  server.registerTool(
    "validate_build",
    {
      description:
        "Validate a PC build list for component compatibility (e.g., CPU/Motherboard sockets, PSU wattage clearance, physical clearance).",
      inputSchema: ValidateBuildSchema,
    },
    async ({ build_list }) => {
      const url = `${backendUrl}/build/validate`;
      try {
        const response = await axios.post(url, build_list);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      } catch (error: any) {
        const errorMessage = error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message;
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error calling backend API: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  // 4. Tool: get_suitable_parts
  server.registerTool(
    "get_suitable_parts",
    {
      description:
        "Find or search parts of a specific product category that are compatible with the components already selected in the build list.",
      inputSchema: GetSuitablePartsSchema,
    },
    async ({ product, build_list, page, limit, q, filters }) => {
      const url = `${backendUrl}/build/${product}`;

      const params: Record<string, any> = { ...filters, q, page, limit };

      try {
        const response = await axios.post(url, build_list, { params });
        return {
          content: [
            { type: "text", text: JSON.stringify(response.data, null, 2) },
          ],
        };
      } catch (error: any) {
        const errorMessage = error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message;
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error calling backend API: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );
}
