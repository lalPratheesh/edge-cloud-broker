export enum ComplexityLevel {
  SIMPLE = 'SIMPLE',
  COMPLEX = 'COMPLEX',
}

export interface AnalyzerOptions {
  /** The complexity score threshold (0.0 to 1.0) above which a prompt is considered COMPLEX. Default is 0.5. */
  threshold?: number;
  /** Custom keywords that decrease complexity (e.g., 'summarize') */
  simpleKeywords?: string[];
  /** Custom keywords that increase complexity (e.g., 'analyze') */
  complexKeywords?: string[];
  /** Custom formatting constraint keywords (e.g., 'json') */
  formattingKeywords?: string[];
}

export class ComplexityAnalyzer {
  private threshold: number;

  private simpleKeywords: string[] = [
    'summarize', 'translate', 'rephrase', 'fix grammar', 'shorten', 'correct'
  ];

  private complexKeywords: string[] = [
    'analyze', 'code', 'script', 'explain why', 'step by step', 'evaluate', 'compare', 'debug', 'plan'
  ];

  private formattingKeywords: string[] = [
    'json', 'xml', 'html', 'sql', 'markdown table', 'csv'
  ];

  constructor(options?: AnalyzerOptions) {
    this.threshold = options?.threshold ?? 0.5;
    if (options?.simpleKeywords) this.simpleKeywords = options.simpleKeywords.map(k => k.toLowerCase());
    if (options?.complexKeywords) this.complexKeywords = options.complexKeywords.map(k => k.toLowerCase());
    if (options?.formattingKeywords) this.formattingKeywords = options.formattingKeywords.map(k => k.toLowerCase());
  }

  /**
   * Calculates a heuristic complexity score between 0.0 and 1.0.
   */
  public calculateScore(prompt: string): number {
    let score = 0.2; // Base score
    const lowerPrompt = prompt.toLowerCase();

    // 1. Length-based heuristic
    // Up to 0.3 points for length (cap at 1000 chars)
    const lengthScore = Math.min((prompt.length / 1000) * 0.3, 0.3);
    score += lengthScore;

    // 2. Simple Keywords
    for (const kw of this.simpleKeywords) {
      if (lowerPrompt.includes(kw)) {
        score -= 0.3;
        break; // Apply once
      }
    }

    // 3. Complex Keywords
    for (const kw of this.complexKeywords) {
      if (lowerPrompt.includes(kw)) {
        score += 0.4;
        break; // Apply once
      }
    }

    // 4. Formatting Constraints / Structural Complexity
    for (const kw of this.formattingKeywords) {
      if (lowerPrompt.includes(kw)) {
        score += 0.3;
        break; // Apply once
      }
    }

    // Presence of code blocks
    if (prompt.includes('```')) {
      score += 0.3;
    }

    // Clamp score between 0.0 and 1.0
    return Math.max(0.0, Math.min(1.0, score));
  }

  /**
   * Evaluates the prompt and categorizes it as SIMPLE or COMPLEX.
   */
  public evaluate(prompt: string): ComplexityLevel {
    const score = this.calculateScore(prompt);
    return score >= this.threshold ? ComplexityLevel.COMPLEX : ComplexityLevel.SIMPLE;
  }
}
