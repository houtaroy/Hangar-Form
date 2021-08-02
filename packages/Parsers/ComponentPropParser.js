import { has, pick, pickBy } from 'lodash';

import ComponentUtil from '../Utils/ComponentUtil';

class ComponentPropParser {
  static #cache = {};
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
  static _getPropNames(componentName) {
    const sniffNames = ComponentUtil.sniffName(componentName);
    const cache = this._getCache(sniffNames);
    if (cache) return cache;
    const result = ComponentUtil.getPropNames(...sniffNames);
    this._setCache(componentName, result);
    return result;
  }
  static _getCache(componentSnifferNames) {
    for (const name of componentSnifferNames) {
      if (has(this.#cache, name)) return this.#cache[name];
    }
    return false;
  }
  static _setCache(componentName, propNames) {
    this.#cache[componentName] = propNames;
  }
}

export default ComponentPropParser;
