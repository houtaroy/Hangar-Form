export const constantComponentMap = {
  text: 'text',
  html: 'h-html'
};

export const componentMap = {
  ant: {
    form: 'a-form-model',
    formItem: 'a-form-model-item',
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
    date: 'a-date-picker',
    dateRange: 'a-range-picker'
  }
};

export const childrenKeys = ['columns', 'trs', 'tds', 'list'];

export const excludeFormElementTypes = [
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
