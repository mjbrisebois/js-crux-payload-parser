[back to README.md](README.md)

# Contributing

## Overview
This package is intended to set a standard combination for `@whi/essence` and
`@whi/entity-architect`.  Since the purpose of this package is to manage responses,
`@whi/holochain-client` is separated as a peer dependency because we don't need to care about how
the response is obtained.

## Development

### Environment

- Developed using Node.js `v14.17.3`

### Building
No build is required for Node.

Bundling with Webpack is supported for web
```
npm run build
```

#### Approximate size breakdown
Bundled size is approx. `26kb`.

- `5kb` - this package
- `5kb` - `@whi/essence`
- `16kb` - `@whi/entity-architect`

### Testing

To run all tests with logging
```
make test-debug
```

- `make test-unit-debug` - **Unit tests only**
- `make test-e2e-debug` - **End-2-end tests only**

> **NOTE:** remove `-debug` to run tests without logging
