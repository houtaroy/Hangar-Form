import { values, has, get } from 'lodash';

/**
 * 所有默认值解析器的父类
 *
 * @class 基础默认值解析器
 */
export class BaseDefaultValueDecoder {
  constructor() {}
  test() {
    return false;
  }
  decode() {
    return undefined;
  }
}

/**
 * 将默认值解析为vuex中数据的解析器
 * 默认值格式类似$store.user/name, 对应vuex中的this.$store.getters['user/name']
 *
 * @class vuex默认值解析器
 */
class StoreDecoder extends BaseDefaultValueDecoder {
  static #REGEXP = /^\$store\.[a-zA-Z0-9]*\/?[a-zA-Z0-9]*$/;
  test(defaultValue) {
    return StoreDecoder.#REGEXP.test(defaultValue);
  }
  decode(defaultValue, context) {
    return context.$store.getters[defaultValue.replace('$store.', '')];
  }
}

/**
 * 将默认值解析为组件data中数据的解析器
 * 默认值格式类似${a[0].a.b}, 对应当前表单组件中的this.a[0].a.b, 支持多层级
 *
 * @class 组件data默认值解析器
 */
class DataDecoder extends BaseDefaultValueDecoder {
  static #REGEXP = /^\${[a-zA-Z0-9.[\]'"]*}$/;
  test(defaultValue) {
    return DataDecoder.#REGEXP.test(defaultValue);
  }
  decode(defaultValue, context) {
    return get(context, defaultValue.substring(2, defaultValue.length - 1));
  }
}

/**
 * 默认值解析器Map, key为解析器名称, value为解析器实体
 */
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
  if (!(decoder instanceof BaseDefaultValueDecoder)) {
    console.error('[HForm Error]: 解析器需继承BaseDefaultValueDecoder');
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

export default {
  BaseDefaultValueDecoder,
  getDefaultValueDecoders,
  addDefaultValueDecoder,
  removeDefaultValueDecoder
};
