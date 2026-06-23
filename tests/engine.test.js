import { expect, test } from 'vitest';
import { createRetrofitClient } from '../src/index.js';

test('should map snake_case and kebab-case keys to expected camelCase properties', () => {
  const expectedSchema = {
    userId: 'number',
    fullName: 'string',
    isActive: 'boolean'
  };

  const client = createRetrofitClient({ expectedSchema });

  const driftedApiResponse = {
    'user-id': 101,
    full_name: 'Alice Smith',
    isactive: true
  };

  const sanitizedData = client.sanitize(driftedApiResponse);

  expect(sanitizedData).toEqual({
    userId: 101,
    fullName: 'Alice Smith',
    isActive: true
  });
});

test('should provide default fallback values when expected keys are completely missing', () => {
  const expectedSchema = {
    id: 'number',
    tags: 'object',
    description: 'string'
  };

  const client = createRetrofitClient({ expectedSchema });
  const incompleteApiResponse = {};

  const sanitizedData = client.sanitize(incompleteApiResponse);

  expect(sanitizedData).toEqual({
    id: 0,
    tags: {},
    description: ''
  });
});