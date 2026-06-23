import { RetrofitEngine } from '../core/engine.js';

/**
 * Attaches an interceptor to an Axios instance or global Axios object.
 * @param {Object} axiosInstance - The Axios instance to hook into.
 * @param {Object} options
 * @param {Object} options.expectedSchema
 * @param {'heuristic'} [options.strategy='heuristic']
 */
export function hookAxios(axiosInstance, options) {
  if (!axiosInstance || !axiosInstance.interceptors) {
    return;
  }

  const engine = new RetrofitEngine(options);

  axiosInstance.interceptors.response.use(
    (response) => {
      if (response.data && typeof response.data === 'object') {
        response.data = engine.sanitize(response.data);
      }
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}