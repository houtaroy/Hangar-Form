const jsonMinimumVersion = '1.0.0';

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

export { jsonMinimumVersion, excludeFormElementTypes, elementChildrenKeys };
