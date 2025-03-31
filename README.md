# MCP Server TypeScript Template

A template for creating Model Context Protocol (MCP) servers using TypeScript. This project demonstrates how to implement a simple MCP server with custom tools.

## Overview

This template implements a basic MCP server that provides tools for:
- Example operation: A simple demonstration operation
- Addition: A tool that adds two numbers

The server uses the Model Context Protocol SDK to handle communication between AI models and external tools.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Project Structure
The project is structured as follows:  
```
mcp-server-typescript-template/
├── common/
│   ├── constant.ts     # Project constants
│   ├── errors.ts       # Error handling utilities
│   └── types.ts        # Type definitions
│   └── utils.ts        # Utility functions

├── operations/
│   └── example-operation.ts  # Implementation of example operations
├── index.ts            # Main server implementation
├── package.json
└── tsconfig.json
```
## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd mcp-server-typescript-template
npm install
npm run test
npm run build
npm run start # this will start the server for testing
```

## Configuration MCP Client (Claude Desktop)
edit your `claude_desktop_config.json` file to add the following:
```json
{
  "mcpServers": {
    "example": {
      "command": "node",
      "args": [
        "/path/to/mcp-server-typescript-template/dist/index.js"
      ]
    }
  }
}

```
