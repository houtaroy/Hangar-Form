import { has, get } from 'lodash';

import BaseParser from './models';

class DefaultEventParser extends BaseParser {
  static parse(eventConfig, context) {
    if (has(context, eventConfig.methodName)) {
      return get(context, eventConfig.methodName);
    }
    console.error(`[Hangar-Form]: 事件${eventConfig.name}绑定方法${eventConfig.methodName}不存在`);
  }
  static parseList(eventConfigs, context) {
    const result = {};
    eventConfigs.forEach(eventConfig => {
      result[eventConfig.name] = this.parse(eventConfig, context);
    });
    return result;
  }
}

export default DefaultEventParser;
