import { has, pick, keys, values } from 'lodash';

import { deconstructionMethodString } from './Util';

/**
 * 所有选项解析器的父类
 *
 * @class 基础选项解析器
 */
export class BaseOptionsParser {
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
  parse(element) {
    return element.options[element.optionsConfig.key];
  }
}

/**
 * 从元素json的options中获取静态配置
 * 未来会将选项配置从options中提取出来
 *
 * @class 静态选项解析器
 */
class StaticOptionsParser extends BaseOptionsParser {
  constructor() {
    super('static');
  }
}

/**
 * 从接口中获取数据进行选项解析
 *
 * @class 接口选项解析器
 */
class ApiOptionsParser extends BaseOptionsParser {
  constructor() {
    super('api');
  }
  parse(element, context) {
    return this.parseByApi(element.optionsConfig, context);
  }
  /**
   * @description: 从接口请求数据进行解析
   * @param {Object} config 选项解析配置
   * @param {Object} context 当前组件上下文
   * @return {Promise} 解析结果
   */
  parseByApi(config, context) {
    const method = deconstructionMethodString(config.name);
    if (!has(context.$api, method.name)) {
      return [];
    }
    return new Promise(resolve => {
      context.$api[method.name](method.arguments)
        .then(res => {
          resolve(this.parseApiResultByOptions(res.data, config.options));
        })
        .catch(() => {
          resolve([]);
        });
    });
  }
  /**
   * @description: 根据配置处理接口请求数据结果
   * @param {Array} apiResult 接口请求数据结果
   * @param {Object} options 数据键值映射处理配置, 例如{ code: 'value' }, 会将结果中的键值code修改为value
   * @return {Array} 处理后的结果
   */
  parseApiResultByOptions(apiResult, options) {
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
class DynamicOptionsParser extends BaseOptionsParser {
  constructor() {
    super('dynamic');
  }
  parse(element, context) {
    const { optionsConfig: config } = element;
    return super.test(config.type) ? context[config.name] : super.parser(element);
  }
}

/**
 * 调用字典接口获取数据并处理
 *
 * @class 字典选项解析器
 */
class DictionaryOptionsParser extends ApiOptionsParser {
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
  parse(element, context) {
    const { optionsConfig: config } = element;
    if (!this.test(config.type)) {
      return [];
    }
    config.name = `listDictionaryTypesByCode({ codes: '${config.name}' })`;
    config.options = {
      code: 'value',
      name: 'label'
    };
    return this.parseByApi(config, context);
  }
}

/**
 * 从缓存中获取枚举数据并处理
 *
 * @class 枚举选项解析器
 */
class EnumOptionsParser extends BaseOptionsParser {
  constructor() {
    super('enum');
  }
  parse(element, context) {
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
const optionsParsers = {
  static: new StaticOptionsParser(),
  dynamic: new DynamicOptionsParser(),
  api: new ApiOptionsParser(),
  dictionary: new DictionaryOptionsParser(),
  enum: new EnumOptionsParser()
};

/**
 * @description: 获取选项解析器Map
 * @return {Map} 选项解析器Map
 */
export const parseOptionsConfig = function(element, context) {
  return (optionsParsers[element.optionsConfig.type] || optionsParsers.static).parse(
    element,
    context
  );
};

/**
 * @description: 新增选项解析器
 * @param {String} name 选项解析器名称
 * @param {Object} parser 选项解析器, 需继承BaseOptionsParser
 */
export const addOptionsConfigParser = function(name, parser) {
  if (!(parser instanceof BaseOptionsParser)) {
    console.error('[HForm Error]: 选项解析器需继承BaseOptionsParser');
    return;
  }
  optionsParsers[name] = parser;
};

/**
 * @description: 移除选项解析器
 * @param {String} name 选项解析器名称
 */
export const removeOptionsConfigParser = function(name) {
  if (has(optionsParsers, name)) {
    delete optionsParsers[name];
  }
};

export default {
  parseOptionsConfig,
  addOptionsConfigParser,
  removeOptionsConfigParser
};
