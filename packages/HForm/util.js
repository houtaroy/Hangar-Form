import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import kebabCase from 'lodash/kebabCase';
import keys from 'lodash/keys';
import Vue from 'vue';

const propKeysCacheMap = {};

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

const getPropKeysCache = function(...names) {
  for (const name of names) {
    if (Object.prototype.hasOwnProperty.call(propKeysCacheMap, name)) {
      return propKeysCacheMap[name];
    }
  }
};
