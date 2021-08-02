import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';

import { has, get, bind } from 'lodash';

import { getFrameComponents } from '../Frame';
import { getConstantRenders } from './ConstantRender';
import ComponentPropParser from '../Parsers/ComponentPropParser';
import { isHidden, isFormItem, getChildren } from '../Utils/ElementUtil';

/**
 * 初始化渲染器
 * 共完成以下操作: 设置框架组件匹配库/手动绑定常量渲染函数/生成ant特殊配置
 * @param {string} frameName 框架名称
 * @param {object} formConfig 表单配置
 */
function _initRender(frameName, formConfig) {
  this.frameComponents = getFrameComponents(frameName);
  this.constantRenders = getConstantRenders();
  for (const name in this.constantRenders) {
    const render = this.constantRenders[name];
    this.constantRenders[name] = bind(render, this);
  }
  if (frameName === 'ant') {
    this.antFormModalItemAttrs = this._renderAntFormModalItemAttrs(formConfig);
  }
}

function _renderList(h, elements) {
  const result = [];
  elements.forEach(element => {
    if (!isHidden(element)) {
      result.push(
        isFormItem(element) ? this._renderWithFormItem(h, element) : this._renderElement(h, element)
      );
    }
  });
  return result;
}

/**
 * 嵌套一层form-model的元素渲染
 */
function _renderWithFormItem(h, element) {
  const FormItemComponentName = this._getComponentName({ type: 'formItem' });
  return (
    <FormItemComponentName
      {...{
        props: ComponentPropParser.parse(
          FormItemComponentName,
          element,
          this.antFormModalItemAttrs,
          {
            prop: element.model
          },
          { rules: get(element, 'options.disabled') ? undefined : element.rules }
        )
      }}
      style={this.antFormModalItemAttrs.style}>
      {this._renderElement(h, element)}
    </FormItemComponentName>
  );
}

function _renderElement(h, element) {
  const ComponentName = this._getComponentName(element);
  if (has(this.constantRenders, ComponentName)) {
    return this.constantRenders[ComponentName](h, element);
  }
  const attrs = this._renderComponentAttrs(ComponentName, element);
  if (element.model) {
    return (
      <ComponentName v-model={this.data[element.model]} {...attrs}>
        {this._renderList(h, getChildren(element))}
      </ComponentName>
    );
  }
  return <ComponentName {...attrs}>{this._renderList(h, getChildren(element))}</ComponentName>;
}

function _getComponentName(element) {
  return this.frameComponents[element.type] || element.type;
}

function _renderComponentAttrs(componentName, element) {
  return {
    ref: element.key,
    class: element.class ? element.class.split(',') : '',
    style: this._renderStyle(element),
    props: this._renderComponentProps(componentName, element),
    on: element.listeners
  };
}

function _renderStyle(element) {
  return element.options && element.options.width
    ? element.style + `width: ${element.options.width};`
    : element.style;
}

function _renderComponentProps(componentName, element) {
  const options = [element, element.options, { locale: locale }];
  this.extendConfigs.forEach(extendConfig => {
    const key = element.model || element.key;
    if (has(extendConfig, key)) {
      options.push(extendConfig[key]);
    }
  });
  const result = ComponentPropParser.parse(componentName, ...options);
  if (element.optionsConfig) {
    result[element.optionsConfig.key] = this.optionsMap[element.key];
  }
  delete result['type'];
  return result;
}

/**
 * 根据k-form-design代码, 表单整体布局为手动读取配置生成
 * 暂时不想大范围调整json, 故做此适配
 */
function _renderAntFormModalItemAttrs(formConfig) {
  return {
    labelCol:
      formConfig.layout === 'horizontal'
        ? formConfig.labelLayout === 'flex'
          ? { style: `width:${formConfig.labelWidth}px` }
          : formConfig.labelCol
        : {},
    wrapperCol:
      formConfig.layout === 'horizontal'
        ? formConfig.labelLayout === 'flex'
          ? { style: 'width:auto;flex:1' }
          : formConfig.wrapperCol
        : {},
    style:
      formConfig.layout === 'horizontal' && formConfig.labelLayout === 'flex'
        ? { display: 'flex' }
        : {}
  };
}

export default {
  _initRender,
  _renderList,
  _renderWithFormItem,
  _renderElement,
  _getComponentName,
  _renderComponentAttrs,
  _renderStyle,
  _renderComponentProps,
  _renderAntFormModalItemAttrs
};
