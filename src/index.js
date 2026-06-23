import { hookAxios } from "./adapters/axiosAdapter.js";
import { hookFetch } from "./adapters/fetchAdapter.js";
import { RetrofitEngine } from "./core/engine.js";

/**
 * @param {Object} options
 * @param {Object} options.expectedSchema
 * @param {'heuristic'} [options.strategy='heuristic']
 * @returns {{ sanitize: (data: Object) => Object }}
 */
export function createRetrofitClient(options) {
	const engine = new RetrofitEngine(options);

	return {
		sanitize: (data) => engine.sanitize(data),
	};
}

export { hookFetch, hookAxios };
