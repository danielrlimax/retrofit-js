import { expect, test, vi } from 'vitest';
import { hookAxios } from '../src/index.js';

test('should intercept Axios response and sanitize its data payload', async () => {
  const expectedSchema = {
    productId: 'number',
    productName: 'string'
  };

  const driftedApiResponse = {
    product_id: 500,
    productname: 'Mechanical Keyboard'
  };

  // Mocking the Axios interceptor registry architecture
  const interceptorHandlers = [];
  const fakeAxiosInstance = {
    interceptors: {
      response: {
        use: vi.fn((successHandler) => {
          interceptorHandlers.push(successHandler);
        })
      }
    }
  };

  hookAxios(fakeAxiosInstance, { expectedSchema });

  // Simulate Axios receiving a response and triggering its interceptors pipeline
  const mockAxiosResponse = { data: driftedApiResponse };
  const registeredInterceptor = interceptorHandlers[0];
  const processedResponse = registeredInterceptor(mockAxiosResponse);

  expect(processedResponse.data).toEqual({
    productId: 500,
    productName: 'Mechanical Keyboard'
  });
});