#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import * as operation from './operations/example-operation';
import { VERSION } from "./common/constant";
import { AdditionSchema, ExampleSchema } from "./common/types";
import { isError, formatError } from "./common/errors";

export const server = new Server(
  {
    name: "example-mcp-server",
    version: VERSION,
  },
  {
    capabilities: {
      logging: {
        level: "debug",
      },
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "example_operation",
        description: "A simple example operation",
        inputSchema: zodToJsonSchema(ExampleSchema),
      },
      {
        name: "addition",
        description: "Add two numbers",
        inputSchema: zodToJsonSchema(AdditionSchema),
      }
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (!request.params.arguments) {
      throw new Error("Arguments are required");
    }

    switch (request.params.name) {
      case "example_operation": {
        const args = ExampleSchema.parse(request.params.arguments);
        const result = await operation.exampleApiCall(args);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      case "addition": {
        const args = AdditionSchema.parse(request.params.arguments);
        const result = operation.exampleAddition(args);
        return {
          content: [{ type: "text", text: result.toString() }],
        };
      }


      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
    }
    if (isError(error)) {
      throw new Error(formatError(error));
    }
    throw error;
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // using console.log will result Error from MCP client
  // document mentions here: https://modelcontextprotocol.io/docs/tools/debugging#server-side-logging
  console.error("Example MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});