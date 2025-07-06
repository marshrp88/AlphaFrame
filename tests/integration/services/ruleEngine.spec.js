import ruleEngine from '../../../src/lib/services/ruleEngine';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

beforeEach(() => {
  ruleEngine.logger = {
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  };
}); 