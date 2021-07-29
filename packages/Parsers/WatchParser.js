import DefaultMethodParser from './MethodParser';

class DefaultWatchParser extends DefaultMethodParser {
  static parse(watchConfig) {
    return {
      handler: super.parse(watchConfig.handler),
      deep: watchConfig.deep
    };
  }
  static parseList(watchConfigs) {
    const result = {};
    watchConfigs.forEach(watchConfig => {
      result[watchConfig.name] = this.parse(watchConfig);
    });
    return result;
  }
}

export default DefaultWatchParser;
