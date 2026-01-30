# AI Agent Guide: dreadcabinet

**Role**: You are an AI assistant tasked with understanding, integrating, or extending `dreadcabinet` file organization capabilities in applications.

**Goal**: Provide a comprehensive understanding of `dreadcabinet`'s capabilities, architecture, and usage patterns to facilitate correct implementation and extension.

## Core Capabilities

`dreadcabinet` is a file organization library for TypeScript/Node.js applications. It processes files from input directories and organizes them into structured output directories based on dates and metadata.

*   **Date-Based Organization**: Place files into folders by year, month, or day (or flat structure).
*   **Flexible Filename Generation**: Include date, time, and subject in generated filenames.
*   **Timezone Support**: Convert timestamps to specific timezones for consistent naming.
*   **Concurrent Processing**: Process multiple files in parallel for improved performance.
*   **Extension Filtering**: Restrict processing to specific file types.
*   **Non-Destructive**: Original files remain untouched; only copies are created.

## Quick Start Context

When analyzing or generating code using `dreadcabinet`, keep these patterns in mind:

1.  **Create Instance**: Use `create()` with defaults and feature flags.
2.  **Integrate CLI**: Use `.configure(program)` to bind to Commander.js.
3.  **Read & Validate**: Use `.read()`, `.applyDefaults()`, and `.validate()`.
4.  **Process Files**: Use the operator's `.process()` callback pattern.

```typescript
import { Command } from 'commander';
import * as DreadCabinet from '@utilarium/dreadcabinet';

const instance = DreadCabinet.create({
  defaults: {
    timezone: 'America/New_York',
    extensions: ['md', 'txt'],
    outputStructure: 'month',
    outputDirectory: './organized',
  }
});

const program = new Command();
await instance.configure(program);
program.parse();

const config = await instance.read(program.opts());
const finalConfig = instance.applyDefaults(config);
await instance.validate(finalConfig);

const operator = await instance.operate(finalConfig);
await operator.process(async (file) => {
  // Your file processing logic
});
```

## Documentation Structure

This guide directory contains specialized documentation for different aspects of the system:

*   [Configuration](./configuration.md): Deep dive into configuration options, features, and defaults.
*   [Usage Patterns](./usage.md): Common patterns for CLI integration and file processing.
*   [Architecture](./architecture.md): Internal design, module structure, and data flow.
*   [Development](./development.md): Guide for contributing to `dreadcabinet` itself.

