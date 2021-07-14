import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';

import { bind, has, keys, pick } from 'lodash';

import { version as decoderVersion } from '../../package.json';

import {
  componentMap,
  constantComponentMap,
  childrenKeys,
  excludeFormElementTypes
} from './config';
import { getDefaultValueDecoders } from './modules/DefaultValueDecoder';
import { generateProps } from './modules/ComponentProp';
import { renderMethod } from './modules/Util';

const globalLifecycle = {};

const runLifecycle = function(name) {
  if (has(globalLifecycle, name)) {
    globalLifecycle[name]();
  }
};

export default {
  name: 'h-form',
  install: function(Vue) {
    Vue.component(this.name, this);
  },
  props: {
    value: {
      type: Object,
      default: function() {
        return {};
      }
    },
    formId: {
      type: String,
      required: true
    },
    config: {
      type: Object,
      required: true
    },
    extendConfigs: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      locale,
      decodeError: {
        flag: false,
        code: 500,
        message: '解析错误'
      },
      antFormModalItemAttrs: {},
      defaultValueDecoders: getDefaultValueDecoders(),
      constantRender: {
        table: this._renderTable,
        td: this._renderTd,
        'a-tab-pane': this._renderAntTabPane,
        text: this._renderText,
        'h-html': this._renderHtml
      },
      data: {},
      elementMap: {}
    };
  },
  methods: {
    /**
     * @description: 表单校验, 调用表单自身方法(目前仅支持ant)
     * @param {*} callback 回调函数, 参数为验证结果
     */
    validate(callback) {
      this.$refs.form.validate((valid, result) => {
        callback(valid, result);
      });
    },
    /**
     * @description: 表单提交, 先校验再提交(目前仅支持ant)
     * @param {*} callback 回调函数, 参数为[校验结果, 表单数据]
     */
    submit(callback) {
      this.$refs.form.validate((valid, object) => {
        callback(valid, valid ? this.data : object);
      });
    },
    /**
     * @description: 表单重置, 调用表单自身方法(目前仅支持ant)
     */
    resetFields() {
      this.$refs.form.resetFields();
    },
    /**
     * @description: 检查json版本是否与解析器匹配
     * @param {*} version json版本
     * @return {Boolean} true 匹配 false 不匹配
     */
    _checkVersion(version) {
      let result = true;
      if (decoderVersion !== version) {
        result = false;
        this.decodeError.flag = true;
        this.decodeError.message = `版本不匹配: json版本[${version}], 解析器版本[${decoderVersion}]`;
        console.error(this.decodeError.message);
      }
      return result;
    },
    /**
     * @description: 根据json配置
     * @param {*} elements 树形结构元素配置json
     * @return {*} 无
     */
    _decodeData(elements) {
      if (!elements) {
        return;
      }
      elements.forEach(element => {
        if (element.model) this._decodeModel(element);
        if (element.events) element.listeners = this._decodeEvents(element.events);
        childrenKeys.forEach(key => {
          if (element[key]) {
            this._decodeData(element[key]);
          }
        });
      });
    },
    /**
     * @description: 解析json的model属性, 包括表单数据对象和元素Map
     * @param {*} element 元素配置json
     * @return {*}
     */
    _decodeModel(element) {
      this.$set(this.data, element.model, element.options.defaultValue || undefined);
      this.$set(this.elementMap, element.model, element);
    },
    _decodeDefaultValues(data) {
      keys(data).forEach(key => {
        if (key !== undefined) {
          data[key] = this._decodeDefaultValue(data[key]);
        }
      });
      return data;
    },
    _decodeDefaultValue(defaultValue) {
      for (const decoder of this.defaultValueDecoders) {
        if (decoder.test(defaultValue)) {
          return decoder.decode(defaultValue, this);
        }
      }
      return defaultValue;
    },
    /**
     * @description: 解析json的events属性, 生成方法和用于绑定的事件参数
     * @param {*} events 事件数组
     * @return {*} 事件参数Map, key为事件名称(如click, 不需要增加on前缀), value为方法实体
     */
    _decodeEvents(events) {
      const result = {};
      events.forEach(event => {
        if (event.type === 'create') {
          this[event.method.name] = bind(renderMethod(event.method), this);
          result[event.name] = this[event.method.name];
        } else {
          result[event.name] = this[event.methodName];
        }
      });
      return result;
    },
    /**
     * @description: 解析ant design中a-form-model-item样式, 适配KFormDesign编辑器
     * @param {*} formConfig 表单配置
     * @return {*} 样式对象
     */
    _decodeAntFormModalItemAttrs(formConfig) {
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
    },
    /**
     * @description: 批量渲染元素
     * @param {*} elements 树形结构元素配置json
     * @return {*} 渲染结果
     */
    _renderElements(elements) {
      const result = [];
      elements.forEach(element => {
        result.push(
          excludeFormElementTypes.includes(element.type)
            ? this._renderElement(element)
            : this._renderFormElement(element)
        );
      });
      return result;
    },
    /**
     * @description: 渲染表单元素
     * @param {*} element 表单元素配置json
     * @return {*} 渲染结果
     */
    _renderFormElement(element) {
      const FormTag = this._getTag('formItem');
      return (
        <FormTag
          {...{
            props: generateProps(FormTag, element, this.antFormModalItemAttrs, {
              prop: element.model
            })
          }}
          style={this.antFormModalItemAttrs.style}>
          {this._renderElement(element)}
        </FormTag>
      );
    },
    /**
     * @description: 渲染元素
     * @param {*} element 元素配置json
     * @return {*} 渲染结果
     */
    _renderElement(element) {
      const Tag = this._getTag(element.type);
      if (has(this.constantRender, Tag)) {
        return this.constantRender[Tag](element);
      }
      const attrs = this._renderTagAttrs(Tag, element);
      if (element.model) {
        return (
          <Tag v-model={this.data[element.model]} {...attrs}>
            {this._renderChildren(element)}
          </Tag>
        );
      }
      return <Tag {...attrs}>{this._renderChildren(element)}</Tag>;
    },
    /**
     * @description: 渲染组件参数
     * @param {*} Tag 组件标签名称
     * @param {*} element 元素配置json
     * @return {*} 参数对象, 包含[props, on]
     */
    _renderTagAttrs(Tag, element) {
      return {
        props: this._renderTagProps(Tag, element),
        on: element.listeners
      };
    },
    /**
     * @description: 渲染组件props
     * @param {*} Tag 组件标签名称
     * @param {*} element 元素配置json
     * @return {*} 组件props对象
     */
    _renderTagProps(Tag, element) {
      const options = [element, element.options];
      this.extendConfigs.forEach(extendConfig => {
        const key = element.model || element.key;
        if (has(extendConfig, key)) {
          options.push(extendConfig[key]);
        }
      });
      const result = Object.assign(generateProps(Tag, ...options), { locale: this.locale });
      delete result['type'];
      return result;
    },
    /**
     * @description: 渲染表格元素
     * @param {*} tableElement 表格元素配置json
     * @return {*} 渲染结果
     */
    _renderTable(tableElement) {
      const attr = {
        class: pick(tableElement.options, ['bright', 'small', 'bordered']),
        style: tableElement.options.customStyle
      };
      return (
        <table class="kk-table-9136076486841527" {...attr}>
          {this._renderElements(tableElement.trs)}
        </table>
      );
    },
    /**
     * @description: 渲染表单列元素
     * @param {*} tdElement 表单列元素配置json
     * @return {*} 渲染结果
     */
    _renderTd(tdElement) {
      const attr = {
        colSpan: tdElement.colspan,
        rowSpan: tdElement.rowspan
      };
      return (
        <td class="table-td" {...attr}>
          {this._renderChildren(tdElement)}
        </td>
      );
    },
    /**
     * @description: ant-design的a-tab-pane存在问题, 未找到解决办法, 暂时进行特殊处理
     * @param {*} element a-tab-pane配置对象
     * @return {*} 渲染结果
     */
    _renderAntTabPane(element) {
      return (
        <a-tab-pane key={element.value} tab={element.label}>
          {this._renderChildren(element)}
        </a-tab-pane>
      );
    },
    /**
     * @description: 渲染文本元素
     * @param {*} tdElement 文本元素配置json
     * @return {*} 渲染结果
     */
    _renderText(textElement) {
      const divAttrs = {
        style: `text-align: ${textElement.options.textAlign}`
      };
      const labelAttrs = {
        class: { 'ant-form-item-required': textElement.options.showRequiredMark },
        style: pick(textElement.options, ['fontFamily', 'fontSize', 'color'])
      };
      return (
        <div {...divAttrs}>
          <label {...labelAttrs}>{textElement.label}</label>
        </div>
      );
    },
    /**
     * @description: 渲染html元素
     * @param {*} tdElement html元素配置json
     * @return {*} 渲染结果
     */
    _renderHtml(htmlElement) {
      return <h-html v-model={this.data} {...this._renderTagAttrs('h-html', htmlElement)}></h-html>;
    },
    /**
     * @description: 渲染子元素
     * @param {*} element 子元素配置数组
     * @return {*} 渲染结果
     */
    _renderChildren(element) {
      let result = [];
      childrenKeys.forEach(childrenKey => {
        if (element[childrenKey]) {
          result = result.concat(this._renderElements(element[childrenKey]));
        }
      });
      return result;
    },
    /**
     * @description: 根据元素类型获取组件标签, 如不存在则使用原值
     * @param {*} type 元素类型
     * @return {*} 组件标签名称
     */
    _getTag(type) {
      return constantComponentMap[type] || this.componentMap[type] || type;
    }
  },
  render() {
    if (this.decodeError.flag) {
      return <h1 style="text-align: center">{this.decodeError.message}</h1>;
    }
    const { config: formConfig, list: elements } = this.$props.config;
    const Tag = this._getTag('form');
    return (
      <Tag
        class="k-form-build-9136076486841527"
        ref="form"
        {...{ props: generateProps(Tag, formConfig, { model: this.data }) }}>
        {...this._renderElements(elements)}
      </Tag>
    );
  },
  created() {
    if (!this._checkVersion(this.config.version)) {
      return;
    }
    const { frame, config: formConfig, list: elements } = this.$props.config;
    const { lifecycle, methods } = formConfig;
    lifecycle.forEach(one => {
      globalLifecycle[one.name] = bind(renderMethod(one), this);
    });
    runLifecycle('created');
    methods.forEach(method => {
      this[method.name] = bind(renderMethod(method), this);
    });
    this.componentMap = componentMap[frame] || componentMap['ant'];
    if (frame === 'ant') {
      this.antFormModalItemAttrs = this._decodeAntFormModalItemAttrs(formConfig);
    }
    this._decodeData(elements);
    this.data = this._decodeDefaultValues(Object.assign({}, this.data, this.value));
  },
  mounted() {
    runLifecycle('mounted');
  }
};
