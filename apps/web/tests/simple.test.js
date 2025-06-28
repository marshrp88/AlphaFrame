import { describe, it, expect } from '@jest/globals';

describe('Simple Test', () => {
  it('should work', () => {
    console.log('Simple test is running');
    expect(1 + 1).toBe(2);
  });
}); 