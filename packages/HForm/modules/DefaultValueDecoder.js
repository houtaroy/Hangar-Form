import { values, has, get } from 'lodash';

/**
 * 所有默认值解析器的父类
 *
 * @class 默认值解析器抽象类
 */
export class BaseDefaultValueDecoder {
  constructor() {}
  /**
   * @description: 检测是否符合解析器规则
   * @param {String} 默认值表达式
   * @return {Boolean} true符合, false不符合
   */
  test() {
    return false;
  }
  /**
   * @description: 解析默认值表达式
   * @param {String} 默认值表达式
   * @return {*} 解析结果
   */
  decode() {
    return undefined;
  }
}

/**
 * 初始化需提供正则表达式
 * test方法会利用正则表达式对默认值进行匹配, 成功为true, 失败为false
 *
 * @class 正则表达式默认值解析器抽象类
 */
export class BaseRegexpDefaultValueDecoder {
  #regexp = undefined;
  /**
   * @description: 构造方法
   * @param {RegExp} regexp 正则表达式
   */
  constructor(regexp) {
    this.#regexp = regexp;
  }
  test(defaultValue) {
    return this.#regexp ? this.#regexp.test(defaultValue) : false;
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
class StoreDecoder extends BaseRegexpDefaultValueDecoder {
  constructor() {
    super(/^\$store\.[a-zA-Z0-9]*\/?[a-zA-Z0-9]*$/);
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
class DataDecoder extends BaseRegexpDefaultValueDecoder {
  constructor() {
    super(/^\${[a-zA-Z0-9.[\]'"]*}$/);
  }
  decode(defaultValue, context) {
    return get(context, defaultValue.substring(2, defaultValue.length - 1));
  }
}

/**
 * 将默认值解析为请求后台接口的结果
 * 默认值格式类似$api.test({ param: '1' })
 *
 * @class 接口默认值解析器
 */
class ApiDecoder extends BaseRegexpDefaultValueDecoder {
  constructor() {
    super(/^\$api\.[a-zA-Z0-9]*(.*)$/);
  }
  decode(defaultValue, context) {
    const exp = defaultValue.replace(/this\./g, 'context.');
    const name = exp.substring(5, exp.indexOf('('));
    if (!has(context.$api, name)) {
      return undefined;
    }
    const params = eval(exp.substring(exp.indexOf('('), exp.length));
    return context.$api[name](params);
  }
}

/**
 * 默认值解析器Map, key为解析器名称, value为解析器实体
 */
const defaultValueDecoderMap = {
  store: new StoreDecoder(),
  data: new DataDecoder(),
  api: new ApiDecoder()
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
