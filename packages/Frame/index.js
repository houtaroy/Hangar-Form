import { get } from 'lodash';

/**
 * 固定组件Map, 在任何前端框架下处理方式都相同
 */
const constantComponents = {
  text: 'text',
  html: 'h-html'
};

/**
 * 组件框架Map
 * key为框架名称, 对应json中的frame树形
 * value为框架组件的对照Map(key对应json中的type, value对应框架中的组件名称)
 */
const components = {
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
    dateRange: 'a-range-picker',
    hUpload: 'h-uploader',
    hCommentOptions: 'h-comment-options'
  }
};

function getFrameComponents(frameName) {
  return Object.assign({}, get(components, frameName, {}), constantComponents);
}

function addFrame(name, frameConfig) {
  components[name] = frameConfig;
}

function removeFrame(name) {
  delete components[name];
}

export { getFrameComponents, addFrame, removeFrame };

export default { getFrameComponents, addFrame, removeFrame };
