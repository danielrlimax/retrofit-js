export class HeuristicStrategy {
  /**
   * @param {Object} options
   * @param {boolean} [options.silent=false]
   */
  constructor(options = {}) {
    this.silent = options.silent ?? false;
  }

  /**
   * @param {*} rawInput
   * @param {*} expectedSchema
   * @returns {*}
   */
  correct(rawInput, expectedSchema) {
    if (Array.isArray(rawInput)) {
      const targetSchema = Array.isArray(expectedSchema) ? expectedSchema[0] : expectedSchema;
      return rawInput.map(item => this.correct(item, targetSchema));
    }

    if (!rawInput || typeof rawInput !== 'object') {
      return rawInput;
    }

    const correctedOutput = {};
    const rawInputKeys = Object.keys(rawInput);

    for (const expectedKey of Object.keys(expectedSchema)) {
      const schemaDefinition = expectedSchema[expectedKey];
      const exactValue = rawInput[expectedKey];

      if (exactValue !== undefined) {
        correctedOutput[expectedKey] = this._processValue(exactValue, schemaDefinition);
        continue;
      }

      const matchedKey = this._findApproximatedKey(expectedKey, rawInputKeys);

      if (matchedKey) {
        correctedOutput[expectedKey] = this._processValue(rawInput[matchedKey], schemaDefinition);
        this._log(`Auto-remapped key: "${matchedKey}" -> "${expectedKey}"`);
      } else {
        correctedOutput[expectedKey] = this._getDefaultValueForType(schemaDefinition);
      }
    }

    return correctedOutput;
  }

  /**
   * @private
   */
  _processValue(value, schemaDefinition) {
    if (typeof schemaDefinition === 'object' || Array.isArray(schemaDefinition)) {
      return this.correct(value, schemaDefinition);
    }
    return value;
  }

  /**
   * @private
   */
  _findApproximatedKey(expectedKey, availableKeys) {
    const normalizedExpected = this._normalizeString(expectedKey);
    return availableKeys.find(key => this._normalizeString(key) === normalizedExpected);
  }

  /**
   * @private
   */
  _normalizeString(value) {
    return value.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  /**
   * @private
   */
  _getDefaultValueForType(schemaTypeDefinition) {
    if (Array.isArray(schemaTypeDefinition)) return [];
    if (typeof schemaTypeDefinition === 'object') return {};
    if (schemaTypeDefinition === 'object') return {};
    
    const defaultValues = {
      string: '',
      number: 0,
      boolean: false
    };

    return defaultValues[schemaTypeDefinition] ?? null;
  }

  /**
   * @private
   */
  _log(message) {
    if (!this.silent) {
      console.warn(`[Retrofit.js] ${message}`);
    }
  }
}