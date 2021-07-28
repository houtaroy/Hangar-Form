import { defaults } from 'lodash';

import BaseParser from './models';

class DefaultMethodParser extends BaseParser {
  static parse(methodConfig, defaultConfig) {
    defaults(methodConfig, defaultConfig);
    return methodConfig.arguments
      ? new Function(...methodConfig.arguments.split(','), methodConfig.body)
      : new Function(methodConfig.body);
  }
  static parseList(methodConfigs, defaultConfig) {
    const result = [];
    methodConfigs.forEach(methodConfig => {
      result[methodConfig.name] = this.parse(methodConfig, defaultConfig);
    });
    return result;
  }
}

export default DefaultMethodParser;
