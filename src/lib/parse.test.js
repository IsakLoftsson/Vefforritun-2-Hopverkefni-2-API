import { describe, expect, it, jest } from '@jest/globals';
import {
  parseTaskType,
  parseTaskTypesJson,
} from './parse.js';
import { Logger } from './logger.js';

describe('parse', () => {
  /** @type import('./logger.js').Logger */
  const mockLogger = {
    silent: true,
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
  describe('parseTaskTypesJson', () => {
    it('should return empty array if no data', () => {
      const result = parseTaskTypesJson('[]');

      expect(result).toEqual([]);
    });

    it('should throw if invalid JSON', () => {
      expect(() => {
        parseTaskTypesJson('asdf');
      }).toThrow('unable to parse task-type data');
    });

    it('should throw if data is not an array', () => {
      expect(() => {
        parseTaskTypesJson('{}');
      }).toThrow('Task-type data is not an array');
    });

    it('should parse valid JSON', () => {
      const result = parseTaskTypesJson('["asdf"]');

      expect(result).toEqual(['asdf']);
    });

    it('should parse and only return strings', () => {
      const result = parseTaskTypesJson('[1, "asdf", true, {}]');

      expect(result).toEqual(['asdf']);
    });
  });

  describe('parseTaskType', () => {
    it('should return null if data is not an object', () => {
      const result = parseTaskType('', mockLogger);

      expect(result).toEqual(null);
    });

    it('should return null if data does not have name', () => {
      const result = parseTaskType({}, mockLogger);

      expect(result).toEqual(null);
    });

    it('should return null if data does not have score', () => {
      const result = parseTaskType({ name: 'x' }, mockLogger, ['x']);

      expect(result).toEqual(null);
    });

    it('should return null if data name is not a string', () => {
      const result = parseTaskType({ name: 0, score: 0 }, mockLogger);

      expect(result).toEqual(null);
    });

    it('should return null if data score is not a number', () => {
      const result = parseTaskType({ name: 'asdf', score: '0' }, mockLogger);

      expect(result).toEqual(null);
    });

    it('should parse valid data', () => {
      const result = parseTaskType({ name: 'asdf', score: 0 }, mockLogger, [
        'asdf',
      ]);

      expect(result).toEqual({ name: 'asdf', score: 0 });
    });

    it('should parse valid data with task-type but skip if not allowed task-type name', () => {
      const result = parseTaskType({ name: 'asdf', score: 0 }, mockLogger, ['foo']);

      expect(result).toEqual(null);
    });
  });
});
