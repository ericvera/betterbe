# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**betterbe** is a TypeScript-first data validation library focused on being minimally flexible, strict by default, and lightweight with no dependencies. It provides validators for strings, numbers, booleans, arrays, and objects with a fluent API.

## Development Commands

### Core Development

- `yarn build` - Compile TypeScript to JavaScript in `/dist`
- `yarn lint` - Run ESLint with TypeScript-aware rules
- `yarn test` - Run tests with Vitest
- `yarn test:watch` - Run tests in watch mode
- `yarn smoke` - Run full CI pipeline: build + lint + test

### Testing

- Tests are written using Vitest and located alongside source files (e.g., `string.test.ts`)
- Run single test file: `yarn vitest run src/string.test.ts`
- Watch specific test: `yarn vitest src/string.test.ts`

## Architecture

### Core Validator Pattern

Each validator (string, number, boolean, array, object) follows a consistent pattern:

1. **Factory function** - Creates validator with options (e.g., `string()`, `number()`)
2. **Validation function** - The `.validate()` method that performs validation
3. **Type safety** - Full TypeScript support with proper type inference

### Key Files Structure

- `src/index.ts` - Main exports
- `src/types.ts` - Core type definitions and validator interfaces
- `src/ValidationError.ts` - Custom error class with structured error reporting
- `src/{type}.ts` - Individual validator implementations (string, number, boolean, array, object)
- `src/internal/` - Shared utility functions

### Validation Flow

1. Each validator checks basic type requirements first (`validateType` utility)
2. Applies specific validation rules (length, pattern, range, etc.)
3. Runs custom test functions if provided
4. Throws `ValidationError` with detailed metadata on failure

### Error Handling

- All validation errors use `ValidationError` class
- Errors include `type`, `message`, `meta` (additional context), and path information
- Error messages automatically include property paths for nested validation

## TypeScript Configuration

- Uses strict TypeScript configuration extending `@tsconfig/strictest`
- ES modules with NodeNext module resolution
- Target: ESNext with incremental compilation
- Source in `/src`, compiled output in `/dist`

## Code Style

- **Prettier configuration**: 2-space tabs, no semicolons, single quotes
- **ESLint**: TypeScript-aware strict configuration with type checking
- **Lint-staged**: Runs ESLint and Prettier on staged files
- **File extensions**: Uses `.js` imports in TypeScript files for ESM compatibility

## Testing Approach

- Unit tests for each validator type with comprehensive edge cases
- Tests validate both success and failure scenarios
- Error message and metadata validation included in tests
- Custom test functions validated for proper error throwing
