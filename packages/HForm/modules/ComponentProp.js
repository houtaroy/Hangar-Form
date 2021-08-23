import Vue from 'vue';

import { camelCase, upperFirst, kebabCase, has, keys, pick, pickBy } from 'lodash';

/**
 * 组件props缓存Map
 * key为组件名称, value为props名称数组
 */
const propKeysCacheMap = {};

/**
 * @description: 生成组件props
 * @param {String} componentName 组件名称
 * @param {array} options 数据配置项
 * @return {Object} props对象, key为prop名称, value为数据
 */
export const generateProps = function(componentName, ...options) {
  const propKeys = getPropKeys(componentName);
  if (propKeys.length === 0) {
    return {};
  }
  const pickOptions = options.map(option => {
    return pick(option, propKeys);
  });
  return pickBy(Object.assign({}, ...pickOptions));
};

/**
 * @description: 获取组件props, 如果不存在则先写入缓存再返回
 * @param {String} componentName 组件名称
 * @return {array} 组件props名称数组
 */
export const getPropKeys = function(componentName) {
  const kebabCaseName = kebabCase(componentName);
  const pascalCaseName = upperFirst(camelCase(kebabCaseName));
  const cache = getPropKeysCache(componentName, kebabCaseName, pascalCaseName);
  if (cache) return cache;
  const constructor =
    Vue.component(componentName) || Vue.component(kebabCaseName) || Vue.component(pascalCaseName);
  if (constructor) {
    const temp = new constructor();
    const result = keys(temp.$options.props);
    propKeysCacheMap[componentName] = result;
    return result;
  }
  return [];
};

/**
 * @description: 从缓存中获取组件props名称数组
 * @param {array} names 组件名称数组, 指同一组件的多种可能名称, 顺序匹配, 如果命中则返回
 * @return {array} 组件props名称数组
 */
const getPropKeysCache = function(...names) {
  for (const name of names) {
    if (has(propKeysCacheMap, name)) {
      return propKeysCacheMap[name];
    }
  }
};
