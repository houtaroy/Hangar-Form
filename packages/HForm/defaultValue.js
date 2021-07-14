import { values, has, get } from 'lodash';

export class DefaultValueDecoder {
  constructor() {}
  test() {
    return false;
  }
  decode() {
    return undefined;
  }
}

class StoreDecoder extends DefaultValueDecoder {
  static #REGEXP = /^\$store\.[a-zA-Z0-9]*\/?[a-zA-Z0-9]*$/;
  test(defaultValue) {
    return StoreDecoder.#REGEXP.test(defaultValue);
  }
  decode(defaultValue, context) {
    return context.$store.getters[defaultValue.replace('$store.', '')];
  }
}

class DataDecoder extends DefaultValueDecoder {
  static #REGEXP = /^\${[a-zA-Z0-9.[\]'"]*}$/;
  test(defaultValue) {
    return DataDecoder.#REGEXP.test(defaultValue);
  }
  decode(defaultValue, context) {
    return get(context, defaultValue.substring(2, defaultValue.length - 1));
  }
}

const defaultValueDecoderMap = {
  store: new StoreDecoder(),
  data: new DataDecoder()
};

/**
 * @description: 获取默认值解析器数组
 * @return {Array} 默认值解析器数组
 */
export const getDefaultValueDecoders = function() {
  return values(defaultValueDecoderMap);
};

/**
 * @description: 新增默认值解析器
 * @param {*} name 默认值解析器名称
 * @param {*} decoder 解析器, 需继承DefaultValueDecoder
 */
export const addDefaultValueDecoder = function(name, decoder) {
  if (!(decoder instanceof DefaultValueDecoder)) {
    console.error('[HForm Error]: 解析器需继承DefaultValueDecoder');
    return;
  }
  defaultValueDecoderMap[name] = decoder;
};

/**
 * @description: 移除默认值解析器
 * @param {*} name 默认值解析器名称
 */
export const removeDefaultValueDecoder = function(name) {
  if (has(defaultValueDecoderMap, name)) {
    delete defaultValueDecoderMap[name];
  }
};
