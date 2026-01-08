# Architecture

**Purpose**: High-level overview of the internal design of `dreadcabinet`.

## Module Structure

The project is organized into distinct logical modules:

*   **`src/dreadcabinet.ts`**: Main entry point. Exports the `create` factory, types, schemas, and constants.
*   **`src/configure.ts`**: Handles Commander.js integration and CLI option configuration based on enabled features.
*   **`src/read.ts`**: Reads CLI arguments and converts them to partial configuration.
*   **`src/defaults.ts`**: Applies default values to partial configuration based on enabled features.
*   **`src/validate.ts`**: Validates final configuration against allowed options using Zod.
*   **`src/operate.ts`**: Creates the Operator interface for file processing.
*   **`src/output.ts`**: Constructs output directory paths and filenames based on dates and structure.
*   **`src/input/`**:
    *   **`input.ts`**: Factory for input processing.
    *   **`process.ts`**: Core file iteration logic with concurrency support.
    *   **`structured.ts`**: Handles structured input (date-organized directories).
    *   **`unstructured.ts`**: Handles flat/recursive input directories.
*   **`src/util/`**:
    *   **`dates.ts`**: Date formatting and timezone handling using dayjs.
    *   **`storage.ts`**: Abstracted filesystem operations.
*   **`src/error/`**: Custom error types (`ArgumentError`).
*   **`src/constants.ts`**: Default values, date formats, and allowed options.
*   **`src/logger.ts`**: Logger wrapper for consistent logging interface.

## Data Flow

1.  **Initialization**: User calls `create()` with defaults, allowed options, and features.
2.  **Configuration**: `configure()` adds CLI flags to Commander based on enabled features.
3.  **Read Phase**: `read()` extracts values from CLI arguments.
4.  **Defaults Phase**: `applyDefaults()` fills in missing values from defaults.
5.  **Validation Phase**: `validate()` checks config against allowed values.
6.  **Operation Phase**: `operate()` creates an Operator with:
    *   `process(callback)`: Iterates over input files, calling callback for each.
    *   `constructFilename()`: Generates output filenames.
    *   `constructOutputDirectory()`: Creates date-based directory paths.

## Key Types

```typescript
// Filesystem structure options
type FilesystemStructure = 'none' | 'year' | 'month' | 'day';

// Filename components
type FilenameOption = 'date' | 'time' | 'subject';

// Feature flags control which CLI options are added
type Feature = 'input' | 'output' | 'structured-output' | 'structured-input' | 'extensions';
```

## Design Decisions

*   **Feature Flags**: CLI options are conditionally added based on `features` array. This allows building focused tools without exposing irrelevant options.
*   **Non-Destructive**: The library only reads from input and writes to output. Original files are never modified or deleted.
*   **Timezone-Aware**: All date operations go through `dayjs` with timezone support for consistent cross-timezone behavior.
*   **Callback Pattern**: The `process()` method uses a callback pattern, giving consumers full control over what happens to each file.
*   **Testability**: The `storage` module abstracts filesystem calls for easy mocking.

