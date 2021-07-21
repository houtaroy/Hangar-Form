import { has, defaults } from 'lodash';

/**
 * @description: 解析方法
 * @param {Object} methodConfig 方法配置
 * @param {Object} defaultConfig 默认配置, 自动补齐方法配置中不存在的属性
 * @return {Function} 方法
 */
const parseMethod = function(methodConfig, defaultConfig) {
  defaults(methodConfig, defaultConfig);
  return methodConfig.arguments
    ? new Function(...methodConfig.arguments.split(','), methodConfig.body)
    : new Function(methodConfig.body);
};

/**
 * @description: 批量解析方法
 * @param {Array} methodConfigs 方法配置数组
 * @param {Object} defaultConfig 默认配置, 自动补齐方法配置中不存在的属性
 * @return {Object} 方法结果对象, key为方法名称, value为方法实体
 */
const parseMethods = function(methodConfigs, defaultConfig) {
  const result = [];
  methodConfigs.forEach(methodConfig => {
    result[methodConfig.name] = parseMethod(methodConfig, defaultConfig);
  });
  return result;
};

/**
 * @description: 批量解析计算属性
 * @param {Array} computedConfigs 计算属性配置数组
 * @return {Object} 计算属性结果对象, key为计算属性名称, value为方法实体
 */
const parseComputeds = function(computedConfigs) {
  const result = [];
  computedConfigs.forEach(computedConfig => {
    result[computedConfig.name] = {
      get: parseMethod({ body: computedConfig.get }),
      set: has(computedConfig, 'set')
        ? parseMethod({ body: computedConfig.set, arguments: 'newValue' })
        : undefined
    };
  });
  return result;
};

/**
 * @description: 批量解析侦听器
 * @param {Array} watchConfigs 侦听器配置数组
 * @return {Object} 侦听器结果对象, key为侦听器名称, value为方法实体
 */
const parseWatch = function(watchConfigs) {
  return parseMethods(watchConfigs, { arguments: 'newValue,oldValue' });
};

/**
 * @description: 批量解析过滤器
 * @param {Array} filterConfigs 过滤器配置数组
 * @return {Object} 过滤器结果对象, key为过滤器名称, value为方法实体
 */
const parseFilter = function(filterConfigs) {
  return parseMethods(filterConfigs, { arguments: 'value' });
};

/**
 * @description: 解析Vue配置, 将解析后的内容直接合并到$options中
 * @param {Object} context 组件运行上下文
 * @param {Object} vueConfig vue相关Json配置
 */
const parseOptions = function(context, vueConfig) {
  const { computed, watch, filter, methods } = vueConfig;
  Object.assign(context.computed, parseComputeds(computed));
  Object.assign(context.watch, parseWatch(watch));
  Object.assign(context.filter, parseFilter(filter));
  Object.assign(context.methods, parseMethods(methods));
};

export { parseMethod, parseOptions };

export default {
  parseOptions,
  parseComputeds,
  parseWatch,
  parseFilter,
  parseMethods
};
