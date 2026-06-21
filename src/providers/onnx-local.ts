import { IProvider, ModelGenerationOptions } from './types';

export interface ONNXLocalOptions {
  // Expected to be a pre-initialized Transformers.js pipeline or similar ONNX session
  pipeline?: any;
}

/**
 * A provider that uses a local ONNX model (e.g., via Transformers.js) to run inference in the browser.
 */
export class ONNXLocalProvider implements IProvider {
  private pipeline: any;

  constructor(options: ONNXLocalOptions) {
    this.pipeline = options.pipeline;
  }

  public async generate(prompt: string, options?: ModelGenerationOptions): Promise<string> {
    if (!this.pipeline) {
      throw new Error('[ONNXLocalProvider] Pipeline is not initialized. Please pass a valid ONNX pipeline instance.');
    }

    const output = await this.pipeline(prompt, {
      max_new_tokens: options?.maxTokens ?? 100,
      temperature: options?.temperature ?? 0.7,
      do_sample: (options?.temperature ?? 0.7) > 0,
    });

    return output[0]?.generated_text || '';
  }
}
