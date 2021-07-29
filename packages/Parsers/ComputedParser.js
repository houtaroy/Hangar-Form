import { has } from 'lodash';

import DefaultMethodParser from './MethodParser';

class DefaultComputedParser extends DefaultMethodParser {
  static parse(computedConfig) {
    return {
      get: super.parse(computedConfig.get),
      set: has(computedConfig, 'set') ? super.parse(computedConfig.get) : undefined
    };
  }
  static parseList(computedConfigs) {
    const result = {};
    computedConfigs.forEach(computedConfig => {
      result[computedConfig.name] = this.parse(computedConfig);
    });
    return result;
  }
}

export default DefaultComputedParser;
