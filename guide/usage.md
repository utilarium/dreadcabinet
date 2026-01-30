# Usage Patterns

**Purpose**: Common patterns for integrating `dreadcabinet` into applications.

## CLI Integration (Commander.js)

`dreadcabinet` is designed to work seamlessly with `commander`.

```typescript
import { Command } from 'commander';
import * as DreadCabinet from '@utilarium/dreadcabinet';

// 1. Create instance with your defaults
const manager = DreadCabinet.create({
  defaults: {
    timezone: 'America/New_York',
    outputStructure: 'month',
  }
});

// 2. Setup Commander
const program = new Command();
program.name('my-organizer').version('1.0.0');

// 3. Configure (adds CLI options based on features)
await manager.configure(program);

// 4. Parse CLI args
program.parse();
const options = program.opts();

// 5. Read, apply defaults, validate
const config = await manager.read(options);
const finalConfig = manager.applyDefaults(config);
await manager.validate(finalConfig);

// 6. Process files
const operator = await manager.operate(finalConfig);
await operator.process(async (file) => {
  console.log(`Processing: ${file}`);
});
```

## File Processing Patterns

### Basic File Copy

```typescript
import fs from 'fs/promises';
import path from 'path';

await operator.process(async (file) => {
  const createDate = new Date(); // Or extract from file metadata
  const hash = crypto.randomBytes(4).toString('hex');
  const ext = path.extname(file).slice(1);
  
  const outputDir = await operator.constructOutputDirectory(createDate);
  const filename = await operator.constructFilename(createDate, ext, hash, {
    subject: path.basename(file, path.extname(file))
  });
  
  const outputPath = path.join(outputDir, `${filename}.${ext}`);
  await fs.copyFile(file, outputPath);
});
```

### With Transformation

```typescript
await operator.process(async (file) => {
  // Read and transform content
  const content = await fs.readFile(file, 'utf-8');
  const transformed = processContent(content);
  
  // Generate output location
  const createDate = extractDateFromContent(content);
  const outputDir = await operator.constructOutputDirectory(createDate);
  const filename = await operator.constructFilename(createDate, 'md', hash);
  
  // Write transformed content
  await fs.writeFile(path.join(outputDir, `${filename}.md`), transformed);
});
```

### With Date Range Filtering

When using `structured-input` feature, filter files by date:

```typescript
await operator.process(
  async (file, date) => {
    console.log(`File: ${file}, Date: ${date}`);
  },
  {
    start: new Date('2025-01-01'),
    end: new Date('2025-01-31')
  }
);
```

### Concurrent Processing

Set concurrency for parallel processing:

```typescript
const instance = DreadCabinet.create({
  defaults: {
    concurrency: 5, // Process 5 files simultaneously
  }
});
```

Or via CLI: `--concurrency 5`

## Custom Logger

Provide your own logger for integration with existing logging systems:

```typescript
import winston from 'winston';

const winstonLogger = winston.createLogger({ /* ... */ });

const instance = DreadCabinet.create({
  logger: {
    debug: (msg, ...args) => winstonLogger.debug(msg, ...args),
    info: (msg, ...args) => winstonLogger.info(msg, ...args),
    warn: (msg, ...args) => winstonLogger.warn(msg, ...args),
    error: (msg, ...args) => winstonLogger.error(msg, ...args),
    verbose: (msg, ...args) => winstonLogger.verbose(msg, ...args),
    silly: (msg, ...args) => winstonLogger.silly(msg, ...args),
  }
});
```

Or set it after creation:

```typescript
instance.setLogger(myLogger);
```

## Restricting Options

Limit what users can specify via CLI:

```typescript
const instance = DreadCabinet.create({
  allowed: {
    extensions: ['md'],  // Only markdown files
    outputStructures: ['month', 'day'],  // No 'none' or 'year'
  }
});
```

Validation will fail if users try to use disallowed values.

## Hiding Defaults in Help

By default, CLI help shows default values. To hide them (useful for dynamic defaults):

```typescript
const instance = DreadCabinet.create({
  addDefaults: false,  // Defaults shown as "(default: value)" in description
});
```

