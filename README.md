# Edge-Cloud Dynamic Compute Broker

A lightweight TypeScript routing library that dynamically routes AI prompts between local client-side models and cloud APIs based on an ultra-fast heuristic complexity analysis.

## The Problem
Developers building web or desktop apps want to use local inference (via WebGPU or local ONNX runtimes) to save on API costs. However, small local models aren't smart enough for complex reasoning tasks, code generation, or strict formatting constraints. 

## The Solution
This library sits on the client and acts as a dynamic compute broker. 
It uses a lightning-fast, heuristic-based classifier to grade the complexity of a user's prompt. 
- **Simple Prompts** (e.g., "summarize this paragraph") are routed to your local browser/device model.
- **Complex Prompts** (e.g., deep reasoning or code formatting) are quietly kicked up to your cloud API backend.

**Benefits:** Saves developers money on API costs while lowering latency for end users.

## Installation

```bash
npm install edge-cloud-broker
```

## Quick Start

```typescript
import { 
  ComputeBroker, 
  WebLLMLocalProvider, 
  OpenAICloudProvider 
} from 'edge-cloud-broker';

// 1. Initialize your local model (e.g., WebLLM engine)
const localProvider = new WebLLMLocalProvider({ engine: myMlcEngine });

// 2. Initialize your cloud provider
const cloudProvider = new OpenAICloudProvider({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// 3. Create the Broker
const broker = new ComputeBroker({
  localProvider,
  cloudProvider,
  analyzerOptions: { threshold: 0.5 },
  debug: true // Enables routing logs
});

// 4. Generate!
// This is simple: It routes locally!
const summary = await broker.generate("Please summarize this paragraph.");

// This is complex: It routes to the Cloud!
const script = await broker.generate("Write a python script to scrape a website and output JSON.");
```

## How It Works (Heuristics)

The library does not use a heavy ML model to classify text. Instead, it computes a fast heuristic score (0.0 to 1.0) based on:
1. **Length**: Longer prompts score slightly higher.
2. **Intent Keywords**: Words like `summarize`, `translate`, and `correct` lower the complexity score.
3. **Deep Reasoning Keywords**: Words like `analyze`, `code`, `debug`, and `plan` increase the complexity score.
4. **Structural Constraints**: The presence of `JSON`, `XML`, or code blocks (` ``` `) significantly increases the complexity score, as small local models struggle with strict output formats.

You can fully customize these keywords and the routing threshold in the `analyzerOptions`.

## Available Providers

**Cloud Providers:**
- `OpenAICloudProvider`: Wraps OpenAI-compatible endpoints. Will automatically detect `process.env.OPENAI_API_KEY` if available.
- `AnthropicCloudProvider`: Wraps Claude 3 endpoints. Will automatically detect `process.env.ANTHROPIC_API_KEY` if available.

**Local Providers:**
- `WebLLMLocalProvider`: Designed for use with `@mlc-ai/web-llm` to run models like Llama 3 directly in the browser via WebGPU.
- `ONNXLocalProvider`: Designed for use with `Transformers.js` or ONNX Runtime Web to run smaller local models.

## Running the Example Web App

This repository includes a fully functional Vite-based web application to demonstrate the broker in action.

1. Navigate to the `examples/web` directory:
   ```bash
   cd examples/web
   ```
2. Install the example dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template and add your API keys:
   ```bash
   cp .env.example .env
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## License
MIT
