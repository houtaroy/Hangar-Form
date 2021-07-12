const antComponentMap = {
  grid: 'a-row',
  col: 'a-col',
  tabs: 'a-tabs',
  tabPane: 'a-tab-pane',
  input: 'a-input',
  number: 'a-input-number',
  textarea: 'a-textarea',
  select: 'a-select',
  treeSelect: 'a-tree-select',
  cascader: 'a-cascader',
  radio: 'a-radio-group',
  checkbox: 'a-checkbox-group',
  text: 'label',
  html: 'div'
};

export const constantComponentMap = {
  html: 'h-html'
};

export const componentMap = {
  ant: antComponentMap
};

export const childrenKeys = ['columns', 'trs', 'tds', 'list'];
export const layoutKeys = ['grid', 'col', 'tabs', 'tabPane'];
