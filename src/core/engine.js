import { HeuristicStrategy } from "../strategies/heuristicStrategy.js";

export class RetrofitEngine {
	/**
	 * @param {Object} options
	 * @param {Object} options.expectedSchema
	 * @param {'heuristic'} [options.strategy='heuristic']
	 * @param {boolean} [options.silent=false]
	 */
	constructor(options) {
		this.expectedSchema = options.expectedSchema;
		this.silent = options.silent ?? false;
		this.strategy = this._resolveStrategy(options.strategy);
	}

	/**
	 * @param {Object} apiResponse
	 * @returns {Object}
	 */
	sanitize(apiResponse) {
		return this.strategy.correct(apiResponse, this.expectedSchema);
	}

	/**
	 * @private
	 */
	_resolveStrategy(strategyName) {
		const strategies = {
			heuristic: new HeuristicStrategy({ silent: this.silent }),
		};

		return strategies[strategyName] ?? strategies.heuristic;
	}
}
