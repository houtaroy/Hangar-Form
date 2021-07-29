import Vue from 'vue';
import { camelCase, upperFirst, kebabCase, keys } from 'lodash';

function sniffName(name) {
  const kebabCaseName = kebabCase(name);
  return [name, kebabCaseName, upperFirst(camelCase(kebabCaseName))];
}

function getConstructor(...names) {
  for (const snifferName of names) {
    const temp = Vue.component(snifferName);
    if (temp) return temp;
  }
  return false;
}

function getPropNames(...names) {
  const constructor = getConstructor(...names);
  return constructor ? keys(new constructor().$options.props) : [];
}

export { sniffName, getConstructor, getPropNames };
