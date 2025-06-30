import ruleEngine from '../../../src/lib/services/ruleEngine';

beforeEach(() => {
  ruleEngine.logger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
}); 