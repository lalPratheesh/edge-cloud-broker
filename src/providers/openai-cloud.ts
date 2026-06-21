import { IProvider, ModelGenerationOptions } from './types';

export interface OpenAICloudOptions {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

/**
 * A provider that sends requests to an OpenAI-compatible cloud API.
 */
export class OpenAICloudProvider implements IProvider {
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(options?: OpenAICloudOptions) {
    const defaultApiKey = typeof process !== 'undefined' ? (process as any)?.env?.OPENAI_API_KEY : undefined;
    this.apiKey = options?.apiKey || defaultApiKey || '';
    
    if (!this.apiKey) {
      console.warn('[OpenAICloudProvider] No API key provided and OPENAI_API_KEY env variable is not set.');
    }

    this.model = options?.model || 'gpt-4o';
    this.baseUrl = options?.baseUrl || 'https://api.openai.com/v1';
  }

  public async generate(prompt: string, options?: ModelGenerationOptions): Promise<string> {
    const payload = {
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens,
    };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}
