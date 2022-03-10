/**
 * 固定组件Map, 在任何前端框架下处理方式都相同
 */
export const constantComponentMap = {
  text: 'text',
  html: 'h-html'
};

/**
 * 组件框架Map
 * key为框架名称, 对应json中的frame树形
 * value为框架组件的对照Map(key对应json中的type, value对应框架中的组件名称)
 */
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
    time: 'a-time-picker',
    dateRange: 'a-range-picker',
    hUpload: 'h-uploader',
    hPersonnelPicker: 'h-personnel-picker',
    hOpinionsViewer: 'h-opinions-viewer',
    hCommentOptions: 'h-comment-options',
    hDatePicker: 'h-date-picker',
    hWebOffice: 'h-web-office'
  }
};

/**
 * 组件子集属性名
 */
export const childrenKeys = ['columns', 'trs', 'tds', 'list'];

/**
 * 非表单组件元素类型
 * 即不需要在外部嵌套一层formItem
 */
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

/**
 * 过滤默认值使用的正则表达式
 */
export const filterDefaultValueRegExp = {
  checkApiDefaultValue: /^\$api\.[a-zA-Z0-9.]*(.*)$/,
  checkStoreDefaultValue: /^\$store\.[a-zA-Z0-9]*\/?[a-zA-Z0-9]*[a-zA-Z0-9.[\]'"]*$/,
  checkDataDefaultValue: /^\${[a-zA-Z0-9.[\]'"]*}$/
};

export const jsonMinimumVersion = '1.1.0';
