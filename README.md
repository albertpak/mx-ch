# People Directory Application

This is a React application that displays a directory of people. The application showcases a custom caching fetch library for efficient data fetching.

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm (v7 or higher recommended)

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the application running.

The application has two main routes:

- `/appWithoutSSRData` - Client-side rendered application using the caching fetch library
- `/appWithSSRData` - Server-side rendered application with preloaded data

## Project Structure

- `/application` - Contains the React components for the application
- `/caching-fetch-library` - Contains the implementation of the caching fetch library
- `/framework` - Contains the server, client runtime, and mock server
- `/dist` - Build output directory

## Technical Decisions

### Build System

We use esbuild for fast, efficient bundling. It provides excellent TypeScript support and produces optimized bundles for both server and client.

### TypeScript

We use TypeScript for type safety across the entire application. This helps catch errors at compile time and provides better developer experience through autocompletion and documentation.

### Testing Framework

Jest has been configured for unit and integration testing, with React Testing Library for component testing.

### Linting and Formatting

ESLint and Prettier have been configured to ensure consistent code style and catch common errors.

### CI/CD Pipeline

GitHub Actions workflows have been set up for continuous integration and deployment:

- Lint and type checking on pull requests
- Automated testing on push to main branch
- Deployment to staging environment on merge to main
- Production deployment on release tags

### Documentation

JSDoc comments have been added to functions and components for better code documentation.

### Error Handling and Monitoring

Error boundaries have been implemented to catch and handle runtime errors in React components.

## Caching Fetch Library

The caching fetch library provides efficient data fetching with built-in caching capabilities:

- Uses an in-memory cache to store fetched data
- Implements a Time-To-Live (TTL) mechanism for cache entries (5 minutes by default)
- Supports server-side rendering with data preloading
- Handles serialization and deserialization of cache for server-to-client transfer

## Known Issues and Next Steps

- **Cache Persistence**: Currently, the cache is only in-memory. Implementing persistent storage (localStorage/IndexedDB) would improve the user experience across page reloads.
- **Cache Invalidation**: The current TTL-based approach is simple but could be enhanced with more sophisticated invalidation strategies (e.g., stale-while-revalidate).
- **Request Deduplication**: While the cache prevents duplicate network requests for the same URL, we could implement request deduplication for concurrent requests to the same URL.
- **Error Retry Logic**: Adding automatic retry for failed network requests would improve resilience.
- **Typed Responses**: The caching fetch returns `unknown` data. Adding generic type support would improve type safety.
- **Cache Size Management**: Adding a cache size limit and LRU (Least Recently Used) eviction policy would prevent memory issues.
- **Add Comprehensive Testing**: The current tests are minimal and should be expanded to cover edge cases and error scenarios.
- **Offline Support**: Integrating with Service Workers would provide offline capabilities.
- **Performance Monitoring**: Add instrumentation to track cache hit rates and request times.
- **Improve Accessibility**: Ensure all components are accessible and properly announce loading states.

## License

ISC
