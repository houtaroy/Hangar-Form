import { has, pick, keys, values } from 'lodash';

import { deconstructionMethodString } from './Util';

/**
 * 所有选项解析器的父类
 *
 * @class 基础选项解析器
 */
export class BaseOptionsDecoder {
  // 解析器类型
  #type;
  /**
   * @description: 构造方法
   * @param {String} type 选项解析器类型
   */
  constructor(type) {
    this.#type = type;
  }
  /**
   * @description: 检测是否符合解析器规则
   * @param {String} type 解析器类型
   * @return {Boolean} true符合, false不符合
   */
  test(type) {
    return this.#type === type;
  }
  /**
   * @description: 解析选项
   * @param {Object} element 元素json配置
   * @return {Array} 解析结果
   */
  decode(element) {
    return element.options[element.optionsConfig.key];
  }
}

/**
 * 从元素json的options中获取静态配置
 * 未来会将选项配置从options中提取出来
 *
 * @class 静态选项解析器
 */
class StaticOptionsDecoder extends BaseOptionsDecoder {
  constructor() {
    super('static');
  }
}

/**
 * 从接口中获取数据进行选项解析
 *
 * @class 接口选项解析器
 */
class ApiOptionsDecoder extends BaseOptionsDecoder {
  constructor() {
    super('api');
  }
  decode(element, context) {
    return this.decodeByApi(context, element.optionsConfig);
  }
  /**
   * @description: 从接口请求数据进行解析
   * @param {Object} config 选项解析配置
   * @param {Object} context 当前组件上下文
   * @return {Promise} 解析结果
   */
  decodeByApi(config, context) {
    const method = deconstructionMethodString(config.name);
    if (!has(context.$api, method.name)) {
      return [];
    }
    context.loadingCount += 1;
    return new Promise(resolve => {
      context.$api[method.name](method.arguments)
        .then(res => {
          resolve(this.decodeApiResultByOptions(res.data, config.options));
        })
        .catch(() => {
          resolve([]);
        })
        .finally(() => {
          context.loadingCount -= 1;
        });
    });
  }
  /**
   * @description: 根据配置处理接口请求数据结果
   * @param {Array} apiResult 接口请求数据结果
   * @param {Object} options 数据键值映射处理配置, 例如{ code: 'value' }, 会将结果中的键值code修改为value
   * @return {Array} 处理后的结果
   */
  decodeApiResultByOptions(apiResult, options) {
    const result = [];
    apiResult.forEach(data => {
      keys(options).forEach(key => {
        data[options[key]] = data[key];
      });
      result.push(pick(data, values(options)));
    });
    return result;
  }
}

/**
 * 读取页面data中的变量
 *
 * @class 动态选项解析器
 */
class DynamicOptionsDecoder extends BaseOptionsDecoder {
  constructor() {
    super('dynamic');
  }
  decode(element, context) {
    const { optionsConfig: config } = element;
    return super.test(config.type) ? context[config.name] : super.decode(element);
  }
}

/**
 * 调用字典接口获取数据并处理
 *
 * @class 字典选项解析器
 */
class DictionaryOptionsDecoder extends ApiOptionsDecoder {
  #type;
  constructor() {
    super();
    this.#type = 'dictionary';
  }
  test(type) {
    return type === this.#type;
  }
  /**
   * @description: 将字典配置转换为接口配置并解析
   * @param {Object} element 元素json配置
   * @param {Object} context 当前组件上下文
   * @return {Promise} 解析结果
   */
  decode(element, context) {
    const { optionsConfig: config } = element;
    if (!this.test(config.type)) {
      return [];
    }
    config.name = `listDictionaryTypesByCode({ codes: '${config.name}' })`;
    config.options = {
      code: 'value',
      name: 'label'
    };
    return this.decodeByApi(config, context);
  }
}

/**
 * 从缓存中获取枚举数据并处理
 *
 * @class 枚举选项解析器
 */
class EnumOptionsDecoder extends BaseOptionsDecoder {
  constructor() {
    super('enum');
  }
  decode(element, context) {
    const { optionsConfig: config } = element;
    const result = [];
    if (!super.test(config.type)) {
      return result;
    }
    const data = context.$store.getters.enumMap[config.name];
    if (data && data.length > 0) {
      data.forEach(item => {
        result.push({ label: item.name, value: item.value });
      });
    }
    return result;
  }
}

/**
 * 选项解析器Map
 * key为解析器类型, value为解析器实体
 */
const optionsDecoderMap = {
  static: new StaticOptionsDecoder(),
  dynamic: new DynamicOptionsDecoder(),
  api: new ApiOptionsDecoder(),
  dictionary: new DictionaryOptionsDecoder(),
  enum: new EnumOptionsDecoder()
};

/**
 * @description: 获取选项解析器Map
 * @return {Map} 选项解析器Map
 */
export const decodeOptions = function(element, context) {
  return (optionsDecoderMap[element.optionsConfig.type] || optionsDecoderMap.static).decode(
    element,
    context
  );
};

/**
 * @description: 新增选项解析器
 * @param {String} name 选项解析器名称
 * @param {Object} decoder 选项解析器, 需继承BaseOptionsDecoder
 */
export const addOptionsDecoder = function(name, decoder) {
  if (!(decoder instanceof BaseOptionsDecoder)) {
    console.error('[HForm Error]: 选项解析器需继承BaseOptionsDecoder');
    return;
  }
  optionsDecoderMap[name] = decoder;
};

/**
 * @description: 移除选项解析器
 * @param {String} name 选项解析器名称
 */
export const removeOptionsDecoder = function(name) {
  if (has(optionsDecoderMap, name)) {
    delete optionsDecoderMap[name];
  }
};

export default {
  BaseOptionsDecoder,
  decodeOptions,
  addOptionsDecoder,
  removeOptionsDecoder
};
