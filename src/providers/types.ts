export interface ModelGenerationOptions {
  temperature?: number;
  maxTokens?: number;
  [key: string]: any;
}

export interface IProvider {
  /**
   * Generates a response for the given prompt.
   * @param prompt The input string
   * @param options Generation options
   */
  generate(prompt: string, options?: ModelGenerationOptions): Promise<string>;

  /**
   * Optional streaming generation
   */
  generateStream?(prompt: string, options?: ModelGenerationOptions): AsyncIterable<string>;
}
