import { HeuristicStrategy } from '../strategies/heuristicStrategy.js';

export class RetrofitEngine {
  /**
   * @param {Object} options
   * @param {Object} options.expectedSchema
   * @param {'heuristic'} [options.strategy='heuristic']
   */
  constructor(options) {
    this.expectedSchema = options.expectedSchema;
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
   * @param {string} [strategyName]
   * @returns {Object}
   */
  _resolveStrategy(strategyName) {
    const strategies = {
      heuristic: new HeuristicStrategy()
    };

    return strategies[strategyName] ?? strategies.heuristic;
  }
}