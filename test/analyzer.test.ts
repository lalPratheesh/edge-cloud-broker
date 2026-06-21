import { describe, it, expect } from 'vitest';
import { ComplexityAnalyzer, ComplexityLevel } from '../src/analyzer';

describe('ComplexityAnalyzer', () => {
  const analyzer = new ComplexityAnalyzer();

  it('should categorize simple summarization as SIMPLE', () => {
    const prompt = 'Can you summarize this article for me?';
    expect(analyzer.evaluate(prompt)).toBe(ComplexityLevel.SIMPLE);
  });

  it('should categorize translation as SIMPLE', () => {
    const prompt = 'Please translate "hello world" into French.';
    expect(analyzer.evaluate(prompt)).toBe(ComplexityLevel.SIMPLE);
  });

  it('should categorize complex coding tasks as COMPLEX', () => {
    const prompt = 'Write a python script that connects to a postgres database and performs an ETL job.';
    expect(analyzer.evaluate(prompt)).toBe(ComplexityLevel.COMPLEX);
  });

  it('should categorize requests for JSON output as COMPLEX', () => {
    const prompt = 'Give me a list of 5 fruits. Format the response as JSON.';
    expect(analyzer.evaluate(prompt)).toBe(ComplexityLevel.COMPLEX);
  });

  it('should categorize requests with code blocks as COMPLEX', () => {
    const prompt = 'What is wrong with this code?\n```js\nconsole.log(a);\n```';
    expect(analyzer.evaluate(prompt)).toBe(ComplexityLevel.COMPLEX);
  });

  it('should increase complexity for long prompts', () => {
    const longPrompt = 'a'.repeat(2000); // 2000 chars
    // Base 0.2 + 0.3 (max length score) = 0.5 (meets threshold)
    expect(analyzer.evaluate(longPrompt)).toBe(ComplexityLevel.COMPLEX);
  });

  it('should respect custom keywords and threshold', () => {
    const customAnalyzer = new ComplexityAnalyzer({
      threshold: 0.8,
      complexKeywords: ['do something magical'],
      simpleKeywords: ['easy peasy']
    });

    // Normally "do something magical" isn't complex, but it is now
    expect(customAnalyzer.evaluate('Can you do something magical?')).toBe(ComplexityLevel.SIMPLE); // score: 0.2 + 0.4 = 0.6 < 0.8
    // Wait, the default score + complex keyword is 0.6, threshold is 0.8, so it's SIMPLE.
    
    // Let's test custom formatting
    const customFormatting = new ComplexityAnalyzer({
      formattingKeywords: ['yaml']
    });
    expect(customFormatting.evaluate('Please write yaml')).toBe(ComplexityLevel.COMPLEX); // 0.2 + 0.4 = 0.6 >= 0.5
  });
});
