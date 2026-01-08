# Development Guide

**Purpose**: Instructions for contributing to and developing `dreadcabinet`.

## Setup

1.  **Clone Repository**: `git clone https://github.com/utilarium/dreadcabinet.git`
2.  **Install Dependencies**: `npm install`
3.  **Build**: `npm run build`

## Testing

We use **Vitest** for testing.

*   **Run All Tests**: `npm test`
*   **Unit Tests Only**: `npm run test:coverage`
*   **README Doc Tests**: `npm run test:readme` (requires build first)

### Testing Strategy

*   **Unit Tests**: Located in `tests/`. We aim for high coverage.
    *   `tests/input/`: Tests for input processing (structured/unstructured).
    *   `tests/util/`: Tests for utilities (dates, storage).
    *   `tests/error/`: Tests for custom error classes.
*   **Doc Tests**: README code examples are tested via `doccident` to ensure they stay accurate.
*   **Mocking**: We use `vi.mock` for filesystem operations to avoid side effects.

### Running Tests

```bash
# Full test suite (requires build)
npm run precommit

# Just unit tests
npm run test:coverage

# Watch mode during development
npx vitest
```

## Linting & Formatting

*   **Lint**: `npm run lint`
*   **Fix**: `npm run lint:fix`

We use ESLint with strict TypeScript rules.

## Build

```bash
npm run build
```

This runs lint, TypeScript type checking, and Vite build to produce:
- `dist/dreadcabinet.js` (ESM)
- `dist/dreadcabinet.cjs` (CommonJS)
- `dist/dreadcabinet.d.ts` (TypeScript declarations)

## Project Structure

```
src/
├── dreadcabinet.ts      # Main entry, types, factory
├── configure.ts         # CLI option setup
├── read.ts              # CLI args parsing
├── defaults.ts          # Default value application
├── validate.ts          # Config validation
├── operate.ts           # Operator factory
├── output.ts            # Output path/filename generation
├── constants.ts         # Defaults and allowed values
├── logger.ts            # Logger wrapper
├── input/
│   ├── input.ts         # Input factory
│   ├── process.ts       # File iteration
│   ├── structured.ts    # Date-organized input
│   └── unstructured.ts  # Flat/recursive input
├── util/
│   ├── dates.ts         # Date/timezone utilities
│   └── storage.ts       # Filesystem abstraction
└── error/
    └── ArgumentError.ts # Custom error types
```

## Adding Features

1.  **Feature Flag**: Add to `Feature` type in `dreadcabinet.ts`.
2.  **CLI Options**: Add to `configure.ts` with feature check.
3.  **Read**: Update `read.ts` to handle new arguments.
4.  **Defaults**: Update `defaults.ts` for new default values.
5.  **Validation**: Update `validate.ts` if new validation needed.
6.  **Constants**: Add defaults to `constants.ts`.
7.  **Tests**: Write tests for all new functionality.
8.  **Documentation**: Update `guide/` and README.

## Release Process

1.  Update version in `package.json`.
2.  Run `npm run precommit` (build + all tests).
3.  Commit and push to `working` branch.
4.  Create PR to `main`.
5.  After merge, create GitHub release to trigger npm publish.

## Code Style

*   **TypeScript**: Strict mode enabled.
*   **Exports**: Prefer named exports over default exports.
*   **Async**: Use async/await consistently.
*   **Errors**: Use custom error classes for specific error types.
*   **Logging**: Use the logger interface, never `console.log` directly in library code.

