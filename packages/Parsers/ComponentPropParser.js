import { has, pick, pickBy } from 'lodash';

import { sniffName, getPropNames } from '../Utils/ComponentUtil';

class ComponentPropParser {
  static #cache = {};
  /**
   * @description: 编译组件prop
   * @param {string} componentName 组件名称
   * @param {Array} options 数据配置项
   * @return {object} props对象, key为prop名称, value为数据
   */
  static parse(componentName, ...options) {
    const propNames = this._getPropNames(componentName);
    if (propNames.length === 0) {
      return {};
    }
    const pickedOptions = options.map(option => {
      return pick(option, propNames);
    });
    return pickBy(Object.assign({}, ...pickedOptions));
  }
  /**
   * @description: 获取组件prop名称数组, 如果是第一次获取则进行缓存
   * @param {string} componentName 组件名称
   * @return {Array} 组件prop名称数组
   */
  static _getPropNames(componentName) {
    const sniffNames = sniffName(componentName);
    const cache = this._getCache(sniffNames);
    if (cache) return cache;
    const result = getPropNames(...sniffNames);
    this._setCache(componentName, result);
    return result;
  }
  /**
   * @description: 获取组件prop名称数组缓存
   * @param {string[]} componentSnifferNames 组件嗅探名称数组
   * @return {string[] | boolean} 组件prop名称数组, 如不存在则为false
   */
  static _getCache(componentSnifferNames) {
    for (const name of componentSnifferNames) {
      if (has(this.#cache, name)) return this.#cache[name];
    }
    return false;
  }
  /**
   * @description: 设置组件prop名称数组缓存
   * @param {string} componentName 组件名称
   * @param {string[]} propNames 组件prop名称数组
   */
  static _setCache(componentName, propNames) {
    this.#cache[componentName] = propNames;
  }
}

export default ComponentPropParser;
