import { has } from 'lodash';

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
class DictionaryOptionsDecoder extends BaseOptionsDecoder {
  constructor() {
    super('dictionary');
  }
  decode(element, context) {
    const { optionsConfig: config } = element;
    if (!super.test(config.type)) {
      return [];
    }
    return new Promise(resolve => {
      context.loadingCount += 1;
      context.$api
        .dictionary({ type: config.name })
        .then(res => {
          const result = [];
          res.data.forEach(data => {
            result.push({ value: data.code, label: data.name });
          });
          resolve(result);
        })
        .catch(() => {
          resolve([]);
        })
        .finally(() => {
          context.loadingCount -= 1;
        });
    });
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
