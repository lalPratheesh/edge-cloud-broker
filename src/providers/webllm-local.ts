import { IProvider, ModelGenerationOptions } from './types';

export interface WebLLMLocalOptions {
  // In a real application, you would pass your initialized MLCEngine instance here
  // engine: any; 
  modelId?: string;
}

/**
 * A provider that uses a local WebLLM engine (or similar) to run models in the browser.
 */
export class WebLLMLocalProvider implements IProvider {
  private modelId: string;
  private engine: any;

  constructor(options: WebLLMLocalOptions, engineInstance?: any) {
    this.modelId = options.modelId || 'Llama-3-8B-Instruct-q4f32_1-MLC';
    this.engine = engineInstance; // Expects an initialized MLCEngine
  }

  public async generate(prompt: string, options?: ModelGenerationOptions): Promise<string> {
    if (!this.engine) {
      throw new Error('[WebLLMLocalProvider] Engine is not initialized. Please pass a valid MLCEngine instance.');
    }

    const messages = [{ role: 'user', content: prompt }];
    const reply = await this.engine.chat.completions.create({
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens,
    });

    return reply.choices[0].message.content;
  }
}
