import { has, get } from 'lodash';

/**
 * 非表单组件元素类型
 * 即不需要在外部嵌套一层formItem
 */
const excludeFormElementTypes = [
  'grid',
  'col',
  'tabs',
  'tabPane',
  'table',
  'tr',
  'td',
  'text',
  'html'
];

/**
 * 组件子集属性名
 */
const elementChildrenKeys = ['columns', 'trs', 'tds', 'list'];

function isHidden(element) {
  return get(element, 'options.hidden', false);
}

function isFormItem(element) {
  return !excludeFormElementTypes.includes(element.type);
}

function getChildren(element) {
  for (const key of elementChildrenKeys) {
    if (has(element, key)) {
      return element[key];
    }
  }
  return [];
}

export { isHidden, isFormItem, getChildren };
export default { isHidden, isFormItem, getChildren };
