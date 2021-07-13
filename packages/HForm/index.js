import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';

import 'moment/locale/zh-cn';
import bind from 'lodash/bind';
import has from 'lodash/has';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
// import capitalize from 'lodash/capitalize';
import { version as decoderVersion } from '../../package.json';
import { getPropKeys } from './util';
import {
  componentMap,
  constantComponentMap,
  childrenKeys,
  excludeFormElementTypes
} from './config';

const globalLifecycle = {};

const renderMethod = function(method) {
  if (method.arguments) {
    return new Function(...method.arguments.split(','), method.body);
  } else {
    return new Function(method.body);
  }
};

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
      constantRender: {
        table: this._renderTable,
        td: this._renderTd,
        'a-tab-pane': this._renderAntTabPane,
        text: this._renderText,
        'h-html': this._renderHtml
      },
      decodeError: {
        flag: false,
        code: 500,
        message: '解析错误'
      },
      data: {},
      elementMap: {}
    };
  },
  methods: {
    validate(callback) {
      this.$refs.form.validate(valid => {
        callback(valid);
      });
    },
    submit(callback) {
      this.$refs.form.validate(valid => {
        callback(valid, this.data);
      });
    },
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
     * @description: 根据json解析data, 包括表单数据对象和元素Map
     * @param {*} elements 树形结构元素配置json
     * @return {*} 无
     */
    _decodeData(elements) {
      if (!elements) {
        return;
      }
      elements.forEach(element => {
        if (element.model) {
          this.$set(this.data, element.model, null);
          this.$set(this.elementMap, element.model, element);
        }
        childrenKeys.forEach(key => {
          if (element[key]) {
            this._decodeData(element[key]);
          }
        });
      });
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
    _renderFormElement(element) {
      const FormTag = this._getTag('formItem');
      const propKeys = getPropKeys(FormTag);
      const props = Object.assign({}, pick(element, propKeys));
      props.prop = element.model;
      return <FormTag {...{ props: props }}>{this._renderElement(element)}</FormTag>;
    },
    _renderElement(element) {
      const Tag = this._getTag(element.type);
      if (Object.prototype.hasOwnProperty.call(this.constantRender, Tag)) {
        return this.constantRender[Tag](element);
      }
      const propKeys = getPropKeys(Tag);
      const props = pickBy(
        Object.assign({}, pick(element, propKeys), pick(element.options, propKeys), {
          locale: this.locale
        })
      );
      delete props['type'];
      if (element.model) {
        return (
          <Tag v-model={this.data[element.model]} {...{ props: props }}>
            {this._renderChildren(element)}
          </Tag>
        );
      }
      return <Tag {...{ props: props }}>{this._renderChildren(element)}</Tag>;
    },
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
    _renderTd(tdElement) {
      // const attr = pick(tdElement, ['colspan', 'rowspan']);
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
    _renderHtml(htmlElement) {
      const propKeys = getPropKeys('h-html');
      const props = pickBy(Object.assign({}, pick(htmlElement.options, propKeys)));
      return <h-html v-model={this.data} {...{ props: props }}></h-html>;
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
    const propKeys = getPropKeys(Tag);
    const props = Object.assign({}, pick(formConfig, propKeys));
    props.model = this.data;
    return (
      <Tag ref="form" {...{ props: props }}>
        {...this._renderElements(elements)}
      </Tag>
    );
  },
  created() {
    if (!this._checkVersion(this.config.version)) {
      return;
    }
    const { frame, config: formConfig, list: elements } = this.$props.config;
    this.componentMap = componentMap[frame] || componentMap['ant'];
    const { lifecycle, methods } = formConfig;
    lifecycle.forEach(one => {
      globalLifecycle[one.name] = bind(renderMethod(one), this);
    });
    methods.forEach(method => {
      this[method.name] = bind(renderMethod(method), this);
    });
    this._decodeData(elements);
    this.data = Object.assign({}, this.data, this.value);
    runLifecycle('created');
  },
  mounted() {
    runLifecycle('mounted');
  }
};
