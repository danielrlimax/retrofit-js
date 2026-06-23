export class HeuristicStrategy {
  /**
   * @param {Object} rawInput
   * @param {Object} expectedSchema
   * @returns {Object}
   */
  correct(rawInput, expectedSchema) {
    if (!rawInput || typeof rawInput !== 'object') {
      return rawInput;
    }

    const correctedOutput = {};
    const rawInputKeys = Object.keys(rawInput);

    for (const expectedKey of Object.keys(expectedSchema)) {
      if (rawInput[expectedKey] !== undefined) {
        correctedOutput[expectedKey] = rawInput[expectedKey];
        continue;
      }

      const matchedKey = this._findApproximatedKey(expectedKey, rawInputKeys);

      if (matchedKey) {
        correctedOutput[expectedKey] = rawInput[matchedKey];
        console.warn(`[Retrofit.js] Auto-remapped key: "${matchedKey}" -> "${expectedKey}"`);
      } else {
        correctedOutput[expectedKey] = this._getDefaultValueForType(expectedSchema[expectedKey]);
      }
    }

    return correctedOutput;
  }

  /**
   * @private
   * @param {string} expectedKey
   * @param {string[]} availableKeys
   * @returns {string|undefined}
   */
  _findApproximatedKey(expectedKey, availableKeys) {
    const normalizedExpected = this._normalizeString(expectedKey);
    
    return availableKeys.find(key => this._normalizeString(key) === normalizedExpected);
  }

  /**
   * @private
   * @param {string} value
   * @returns {string}
   */
  _normalizeString(value) {
    return value.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

/**
   * @private
   * @param {string|Object} schemaTypeDefinition
   * @returns {*}
   */
  _getDefaultValueForType(schemaTypeDefinition) {
    if (typeof schemaTypeDefinition === 'object' || schemaTypeDefinition === 'object') {
      return {};
    }
    
    const defaultValues = {
      string: '',
      number: 0,
      boolean: false
    };

    return defaultValues[schemaTypeDefinition] ?? null;
  }
}