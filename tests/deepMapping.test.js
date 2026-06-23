import { expect, test } from 'vitest';
import { createRetrofitClient } from '../src/index.js';

test('should sanitize deeply nested structures and arrays of objects', () => {
  const expectedSchema = {
    storeName: 'string',
    productsList: [{
      productId: 'number',
      detailsInfo: {
        isAvailable: 'boolean'
      }
    }]
  };

  const client = createRetrofitClient({ expectedSchema });

  const driftedApiResponse = {
    store_name: 'Tech Central',
    products_list: [
      {
        product_id: 1,
        details_info: { is_available: true }
      },
      {
        product_id: 2,
        details_info: { is_available: false }
      }
    ]
  };

  const sanitizedData = client.sanitize(driftedApiResponse);

  expect(sanitizedData).toEqual({
    storeName: 'Tech Central',
    productsList: [
      { productId: 1, detailsInfo: { isAvailable: true } },
      { productId: 2, detailsInfo: { isAvailable: false } }
    ]
  });
});