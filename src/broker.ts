import { ComplexityAnalyzer, AnalyzerOptions, ComplexityLevel } from './analyzer';
import { IProvider, ModelGenerationOptions } from './providers/types';

export interface ComputeBrokerOptions {
  localProvider: IProvider;
  cloudProvider: IProvider;
  analyzerOptions?: AnalyzerOptions;
  /** Set to true to enable routing logs */
  debug?: boolean;
}

export class ComputeBroker {
  private localProvider: IProvider;
  private cloudProvider: IProvider;
  private analyzer: ComplexityAnalyzer;
  private debug: boolean;

  constructor(options: ComputeBrokerOptions) {
    this.localProvider = options.localProvider;
    this.cloudProvider = options.cloudProvider;
    this.analyzer = new ComplexityAnalyzer(options.analyzerOptions);
    this.debug = options.debug ?? false;
  }

  /**
   * Evaluates the prompt and routes it to either the local or cloud provider.
   */
  public async generate(prompt: string, options?: ModelGenerationOptions): Promise<string> {
    const complexity = this.analyzer.evaluate(prompt);
    
    if (complexity === ComplexityLevel.COMPLEX) {
      if (this.debug) console.log(`[ComputeBroker] Routing to CLOUD provider (Score: ${this.analyzer.calculateScore(prompt).toFixed(2)})`);
      return this.cloudProvider.generate(prompt, options);
    } else {
      if (this.debug) console.log(`[ComputeBroker] Routing to LOCAL provider (Score: ${this.analyzer.calculateScore(prompt).toFixed(2)})`);
      return this.localProvider.generate(prompt, options);
    }
  }

  /**
   * Same as generate, but returns a stream. Not all providers support this natively.
   */
  public async *generateStream(prompt: string, options?: ModelGenerationOptions): AsyncIterable<string> {
    const complexity = this.analyzer.evaluate(prompt);
    const provider = complexity === ComplexityLevel.COMPLEX ? this.cloudProvider : this.localProvider;
    
    if (this.debug) {
      console.log(`[ComputeBroker] Streaming from ${complexity === ComplexityLevel.COMPLEX ? 'CLOUD' : 'LOCAL'} provider`);
    }

    if (provider.generateStream) {
      yield* provider.generateStream(prompt, options);
    } else {
      // Fallback if provider doesn't support streaming
      const result = await provider.generate(prompt, options);
      yield result;
    }
  }
}
