const logger = require('../utils/logger');

describe('Logger utility', () => {
  it('should be a function', () => {
    expect(typeof logger).toBe('function');
  });
});
