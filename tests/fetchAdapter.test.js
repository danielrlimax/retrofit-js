import { expect, test, vi, beforeEach, afterEach } from 'vitest';
import { hookFetch } from '../src/index.js';

beforeEach(() => {
  global.window = {};
});

afterEach(() => {
  vi.restoreAllMocks();
  delete global.window;
});

test('should intercept global fetch and sanitize JSON responses automatically', async () => {
  const expectedSchema = {
    userId: 'number',
    userName: 'string'
  };

  const fakeApiResponse = {
    user_id: 99,
    username: 'Jane Doe'
  };

  // Mock native fetch implementation
  global.window.fetch = vi.fn().mockResolvedValue({
    headers: {
      get: () => 'application/json'
    },
    json: async () => fakeApiResponse
  });

  hookFetch({ expectedSchema });

  const response = await window.fetch('https://api.example.com/user');
  const cleanData = await response.json();

  expect(cleanData).toEqual({
    userId: 99,
    userName: 'Jane Doe'
  });
});