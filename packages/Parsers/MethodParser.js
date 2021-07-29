import BaseParser from './models';

class DefaultMethodParser extends BaseParser {
  static parse(methodConfig) {
    return methodConfig.arguments
      ? new Function(...methodConfig.arguments.split(','), methodConfig.body)
      : new Function(methodConfig.body);
  }
  static parseList(methodConfigs) {
    const result = {};
    methodConfigs.forEach(methodConfig => {
      result[methodConfig.name] = this.parse(methodConfig);
    });
    return result;
  }
}

export default DefaultMethodParser;
