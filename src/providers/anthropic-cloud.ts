import { IProvider, ModelGenerationOptions } from './types';

export interface AnthropicCloudOptions {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

/**
 * A provider that sends requests to the Anthropic Claude API.
 */
export class AnthropicCloudProvider implements IProvider {
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(options?: AnthropicCloudOptions) {
    const defaultApiKey = typeof process !== 'undefined' ? (process as any)?.env?.ANTHROPIC_API_KEY : undefined;
    this.apiKey = options?.apiKey || defaultApiKey || '';

    if (!this.apiKey) {
      console.warn('[AnthropicCloudProvider] No API key provided and ANTHROPIC_API_KEY env variable is not set.');
    }

    this.model = options?.model || 'claude-3-haiku-20240307';
    this.baseUrl = options?.baseUrl || 'https://api.anthropic.com/v1';
  }

  public async generate(prompt: string, options?: ModelGenerationOptions): Promise<string> {
    const payload = {
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
    };

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }
}
