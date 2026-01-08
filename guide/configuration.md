# Configuration Reference

**Purpose**: Detailed guide on configuring `dreadcabinet` instances and understanding available options.

## Instance Configuration (`create`)

The `create` function accepts an options object that controls behavior:

### Options

| Option | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `defaults` | `DefaultOptions` | No | Default values for configuration. |
| `allowed` | `AllowedOptions` | No | Restrict valid values for options. |
| `features` | `Feature[]` | No | Array of enabled features. |
| `addDefaults` | `boolean` | No | Whether to add defaults to CLI help text. |
| `logger` | `Logger` | No | Custom logger implementation. |

### Default Options

```typescript
interface DefaultOptions {
  timezone?: string;              // Default: 'Etc/UTC'
  recursive?: boolean;            // Default: false
  inputDirectory?: string;        // Default: './'
  inputStructure?: FilesystemStructure;    // Default: 'month'
  inputFilenameOptions?: FilenameOption[]; // Default: ['date', 'subject']
  outputDirectory?: string;       // Default: './'
  outputStructure?: FilesystemStructure;   // Default: 'month'
  outputFilenameOptions?: FilenameOption[];// Default: ['date', 'subject']
  extensions?: string[];          // Default: ['md']
  startDate?: string;             // Optional date filter
  endDate?: string;               // Optional date filter
  limit?: number;                 // Limit files processed
  concurrency?: number;           // Default: 1
}
```

### Allowed Options

Restrict which values users can specify:

```typescript
interface AllowedOptions {
  inputStructures?: FilesystemStructure[];   // Default: ['none', 'year', 'month', 'day']
  inputFilenameOptions?: FilenameOption[];   // Default: ['date', 'time', 'subject']
  outputStructures?: FilesystemStructure[];  // Default: ['none', 'year', 'month', 'day']
  outputFilenameOptions?: FilenameOption[];  // Default: ['date', 'time', 'subject']
  extensions?: string[];                      // Default: ['md', 'txt']
}
```

## Features

Features control which CLI options are exposed:

| Feature | CLI Options Added |
| :--- | :--- |
| `input` | `-r/--recursive`, `-i/--input-directory`, `--limit`, `--concurrency` |
| `output` | `-o/--output-directory` |
| `structured-output` | `--output-structure`, `--output-filename-options` |
| `structured-input` | `--input-structure`, `--input-filename-options`, `--start`, `--end` |
| `extensions` | `--extensions` |

Default features: `['output', 'structured-output', 'input', 'extensions']`

## Filesystem Structures

Controls how files are organized into directories:

| Structure | Directory Pattern | Example |
| :--- | :--- | :--- |
| `none` | Flat | `./output/` |
| `year` | By year | `./output/2025/` |
| `month` | By year/month | `./output/2025/1/` |
| `day` | By year/month/day | `./output/2025/1/15/` |

## Filename Options

Controls components included in generated filenames:

| Option | Description | Example Component |
| :--- | :--- | :--- |
| `date` | Include date (format depends on structure) | `1-15` (if month structure) |
| `time` | Include time (HHmm format) | `1430` |
| `subject` | Include sanitized subject | `meeting_notes` |

Example filename with `['date', 'time', 'subject']`: `1-15-1430-abc123-md-meeting_notes`

## Example Configurations

### Simple File Organizer

```typescript
const instance = DreadCabinet.create({
  defaults: {
    inputDirectory: './inbox',
    outputDirectory: './archive',
    outputStructure: 'month',
    extensions: ['md', 'txt'],
  },
  features: ['input', 'output', 'structured-output', 'extensions']
});
```

### High-Performance Batch Processor

```typescript
const instance = DreadCabinet.create({
  defaults: {
    concurrency: 10,
    recursive: true,
    extensions: ['jpg', 'png', 'gif'],
  },
  features: ['input', 'output', 'structured-output', 'extensions']
});
```

### Date-Range Filter

```typescript
const instance = DreadCabinet.create({
  defaults: {
    inputStructure: 'day',
    outputStructure: 'month',
  },
  features: ['input', 'output', 'structured-input', 'structured-output']
});

// Then use --start and --end flags to filter
```

