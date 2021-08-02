import { pick } from 'lodash';
import { getChildren } from '../Utils/ElementUtil';

/**
 * @description: a-tab-pane非常特殊, 必须手写绑定key和tab属性, 否则无效
 */
function _renderAntTabPane(h, element) {
  return (
    <a-tab-pane key={element.value} tab={element.label}>
      {this._renderList(h, getChildren(element))}
    </a-tab-pane>
  );
}

/**
 * @description: 表格为html原生标签, 无prop, 目前json不支持配置html原生属性, 故特写此方法, 以下同理
 */
function _renderTable(h, element) {
  const attr = {
    class: pick(element.options, ['bright', 'small', 'bordered']),
    style: element.options.customStyle
  };
  return (
    <table class="kk-table-9136076486841527" {...attr}>
      {this._renderList(h, getChildren(element))}
    </table>
  );
}

function _renderTd(h, element) {
  if (element.colspan && element.rowspan) {
    return (
      <td class="table-td" colSpan={element.colspan} rowSpan={element.rowspan}>
        {this._renderList(h, getChildren(element))}
      </td>
    );
  }
}

function _renderText(h, element) {
  const divAttrs = {
    style: `text-align: ${element.options.textAlign}`
  };
  const labelAttrs = {
    class: { 'ant-form-item-required': element.options.showRequiredMark },
    style: pick(element.options, ['fontFamily', 'fontSize', 'color'])
  };
  return (
    <div {...divAttrs}>
      <label {...labelAttrs} class={element.class} style={element.style}>
        {element.label}
      </label>
    </div>
  );
}

function _renderHtml(h, element) {
  return <h-html v-model={this.data} {...this._renderComponentAttrs('h-html', element)}></h-html>;
}

const constantRender = {
  'a-tab-pane': _renderAntTabPane,
  table: _renderTable,
  td: _renderTd,
  text: _renderText,
  html: _renderHtml
};

function getConstantRenders() {
  return Object.assign({}, constantRender);
}

function getConstantRender(componentName) {
  return constantRender[componentName];
}

function addConstantRender(componentName, renderFunction) {
  if (!(renderFunction instanceof Function)) {
    console.error('[HForm Error]: 常量渲染器应为方法');
  }
  constantRender[componentName] = renderFunction;
}

function removeConstantRender(componentName) {
  delete constantRender[componentName];
}

export { getConstantRenders, getConstantRender, addConstantRender, removeConstantRender };
export default { getConstantRenders, getConstantRender, addConstantRender, removeConstantRender };
