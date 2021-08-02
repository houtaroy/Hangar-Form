import Vue from 'vue';
import { camelCase, upperFirst, kebabCase, keys } from 'lodash';

/**
 * @description: 嗅探组件名称
 * @param {string} name
 * @return {string[]} 组件可能名称数组, [传入名称, kebabCase风格, PascalCase风格]
 */
function sniffName(name) {
  const kebabCaseName = kebabCase(name);
  return [name, kebabCaseName, upperFirst(camelCase(kebabCaseName))];
}

/**
 * @description: 获取组件构造方法, 名称参数为不定个数, 但若其中一个获取到结果便立刻返回
 * @param {string[]} names 名称数组, 顺序敏感
 * @return {constructor}
 */
function getConstructor(...names) {
  for (const snifferName of names) {
    const temp = Vue.component(snifferName);
    if (temp) return temp;
  }
  return false;
}

/**
 * @description: 获取组件prop名称数组, 参数特点与获取构造函数相同
 * @param {string[]} names
 * @return {*}
 */
function getPropNames(...names) {
  const constructor = getConstructor(...names);
  return constructor ? keys(new constructor().$options.props) : [];
}

export { sniffName, getConstructor, getPropNames };
export default { sniffName, getConstructor, getPropNames };
