import { RetrofitEngine } from "../core/engine.js";

/**
 * Patches the global fetch mechanism to automatically sanitize responses.
 * @param {Object} options
 * @param {Object} options.expectedSchema
 * @param {'heuristic'} [options.strategy='heuristic']
 * @param {string} [options.urlFilter] - Optional keyword to target specific URLs.
 */
export function hookFetch(options) {
	if (typeof window === "undefined" || !window.fetch) {
		return;
	}

	const engine = new RetrofitEngine(options);
	const originalFetch = window.fetch;

	window.fetch = async function (...args) {
		const [resource] = args;
		const url = typeof resource === "string" ? resource : resource?.url;

		const response = await originalFetch.apply(this, args);

		if (options.urlFilter && url && !url.includes(options.urlFilter)) {
			return response;
		}

		const contentType = response.headers.get("content-type");
		if (!contentType || !contentType.includes("application/json")) {
			return response;
		}

		const originalJson = response.json.bind(response);

		response.json = async () => {
			const rawData = await originalJson();
			return engine.sanitize(rawData);
		};

		return response;
	};
}
