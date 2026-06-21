# Contributing to Edge-Cloud Dynamic Compute Broker

First off, thank you for considering contributing to this project! It's people like you that make the open-source community such a great place to learn, inspire, and create.

## Developing Locally

1. **Fork and Clone** the repository.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run the Test Suite**:
   ```bash
   npm run test
   ```
4. **Build the Library**:
   ```bash
   npm run build
   ```

## Creating a Pull Request

1. Create a new branch for your feature or bugfix: `git checkout -b feature/my-new-feature`
2. If you are adding a new Provider (e.g., GeminiCloudProvider, MistralCloudProvider), ensure you implement the `IProvider` interface correctly and handle environment variables safely using the `typeof process` check.
3. Write tests for your changes.
4. Ensure the build and tests pass locally.
5. Submit the Pull Request against the `main` branch!

## Code Style

- We use TypeScript strictly. Avoid using `any` unless absolutely necessary.
- Please document public methods using TSDoc syntax.
