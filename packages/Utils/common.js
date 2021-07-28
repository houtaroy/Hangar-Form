import { defaults } from 'lodash';

/**
 * @description: 解析方法
 * @param {Object} methodConfig 方法配置
 * @param {Object} defaultConfig 默认配置, 自动补齐方法配置中不存在的属性
 * @return {Function} 方法
 */
function parseMethod(methodConfig, defaultConfig) {
  defaults(methodConfig, defaultConfig);
  return methodConfig.arguments
    ? new Function(...methodConfig.arguments.split(','), methodConfig.body)
    : new Function(methodConfig.body);
}

/**
 * @description: 批量解析方法
 * @param {Array} methodConfigs 方法配置数组
 * @param {Object} defaultConfig 默认配置, 自动补齐方法配置中不存在的属性
 * @return {Object} 方法结果对象, key为方法名称, value为方法实体
 */
function parseMethods(methodConfigs, defaultConfig) {
  const result = [];
  methodConfigs.forEach(methodConfig => {
    result[methodConfig.name] = parseMethod(methodConfig, defaultConfig);
  });
  return result;
}

export { parseMethod, parseMethods };
