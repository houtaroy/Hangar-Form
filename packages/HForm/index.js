import postcss from 'postcss';
import postcssPrefixer from 'postcss-prefixer';

import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';

import { bind, has, keys, pick } from 'lodash';

import {
  componentMap,
  constantComponentMap,
  childrenKeys,
  excludeFormElementTypes,
  jsonMinimumVersion
} from './config';
import { getDefaultValueDecoders } from './modules/DefaultValueDecoder';
import { decodeOptions } from './modules/OptionsDecoder';
import { generateProps } from './modules/ComponentProp';
import { renderMethod, checkVersion } from './modules/Util';

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
      loadingCount: 0,
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
      elementMap: {},
      optionsMap: {}
    };
  },
  computed: {
    loading: function() {
      return this.loadingCount > 0;
    }
  },
  methods: {
    /**
     * @description: 表单校验, 调用表单自身方法(目前仅支持ant)
     * @param {Function} callback 回调函数, 参数为验证结果
     */
    validate(callback) {
      this.$refs.form.validate((valid, result) => {
        callback(valid, result);
      });
    },
    /**
     * @description: 表单提交, 先校验再提交(目前仅支持ant)
     * @param {Function} callback 回调函数, 参数为[校验结果, 表单数据]
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
     * @param {String} version json版本
     * @return {Boolean} true 匹配 false 不匹配
     */
    _checkVersion(version) {
      const result = checkVersion(version);
      if (!result) {
        this.decodeError.flag = true;
        this.decodeError.message = `Json配置版本不匹配: 当前版本[${version}], 解析器支持最低版本[${jsonMinimumVersion}]`;
        console.error(this.decodeError.message);
      }
      return result;
    },
    /**
     * @description: 根据json配置
     * @param {Array} elements 树形结构元素配置json
     */
    _decodeData(elements) {
      if (!elements) {
        return;
      }
      elements.forEach(element => {
        if (element.model) this._decodeModel(element);
        if (element.optionsConfig) this._decodeOptions(element);
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
     * @param {Object} element 元素配置json
     */
    _decodeModel(element) {
      this.$set(this.data, element.model, element.options.defaultValue || undefined);
      this.$set(this.elementMap, element.model, element);
    },
    /**
     * @description: 解析json的events属性, 生成方法和用于绑定的事件参数
     * @param {Array} events 事件数组
     * @return {Object} 事件参数Map, key为事件名称(如click, 不需要增加on前缀), value为方法实体
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
    _decodeOptions(element) {
      const decodeResult = decodeOptions(element, this);
      if (decodeResult instanceof Promise) {
        decodeResult.then(res => this.$set(this.optionsMap, element.key, res));
      } else {
        this.$set(this.optionsMap, element.key, decodeResult);
      }
    },
    /**
     * @description: 解析表单数据对象默认值
     * @param {Object} data 表单数据对象
     * @return {Object} 默认值解析结果
     */
    _decodeDefaultValues(data) {
      keys(data).forEach(key => {
        if (key !== undefined) {
          const result = this._decodeDefaultValue(data[key]);
          if (result instanceof Promise) {
            this.loadingCount += 1;
            result
              .then(res => {
                data[key] = res;
              })
              .catch(() => {
                data[key] = undefined;
              })
              .finally(() => {
                this.loadingCount -= 1;
              });
          } else {
            data[key] = result;
          }
        }
      });
      return data;
    },
    /**
     * @description: 解析数据默认值, 按解析器顺序进行解析, 如果命中则立即返回, 无命中则返回原值
     * @param {*} defaultValue 表单数据对象某一属性内容
     * @return {*} 默认值解析结果
     */
    _decodeDefaultValue(defaultValue) {
      for (const decoder of this.defaultValueDecoders) {
        if (decoder.test(defaultValue)) {
          return decoder.decode(defaultValue, this);
        }
      }
      return defaultValue;
    },
    /**
     * @description: 解析ant design中a-form-model-item样式, 适配KFormDesign编辑器
     * @param {Object} formConfig 表单配置
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
     * @description: 渲染css, 为所有选择器增加表单唯一id, 例如: test => form-1-test
     * @param {String} css内容
     * @return {String} 渲染结果
     */
    _renderCss(css) {
      return postcss([postcssPrefixer({ prefix: `form-${this.formId}-` })]).process(css).css;
    },
    /**
     * @description: 批量渲染元素
     * @param {Array} elements 树形结构元素配置json
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
     * @param {Object} element 表单元素配置json
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
     * @param {Object} element 元素配置json
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
     * @param {String} Tag 组件标签名称
     * @param {Object} element 元素配置json
     * @return {Object} 参数对象, 包含[props, on]
     */
    _renderTagAttrs(Tag, element) {
      return {
        ref: element.key,
        class: this._renderClass(element.class),
        style: element.style,
        props: this._renderTagProps(Tag, element),
        on: element.listeners
      };
    },
    /**
     * @description: 渲染元素样式类名, 增加表单唯一标识后的类名, 例如: test => form-1-test
     * @param {String} classes 样式类名, 如果多个则以逗号分隔
     * @return {String} 渲染结果
     */
    _renderClass(classes) {
      const result = [];
      if (classes) {
        classes.split(',').forEach(className => {
          result.push(`form-${this.formId}-${className}`);
        });
      }
      return result.join(' ');
    },
    /**
     * @description: 渲染组件props
     * @param {String} Tag 组件标签名称
     * @param {Object} element 元素配置json
     * @return {Object} 组件props对象
     */
    _renderTagProps(Tag, element) {
      const options = [element, element.options, { locale: this.locale }];
      this.extendConfigs.forEach(extendConfig => {
        const key = element.model || element.key;
        if (has(extendConfig, key)) {
          options.push(extendConfig[key]);
        }
      });
      const result = generateProps(Tag, ...options);
      if (element.optionsConfig) {
        result[element.optionsConfig.key] = this.optionsMap[element.key];
      }
      delete result['type'];
      return result;
    },
    /**
     * @description: 渲染表格元素
     * @param {Object} tableElement 表格元素配置json
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
     * @param {Object} tdElement 表单列元素配置json
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
     * @param {Object} element a-tab-pane配置对象
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
     * @param {Object} textElement 文本元素配置json
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
     * @param {Object} htmlElement html元素配置json
     * @return {*} 渲染结果
     */
    _renderHtml(htmlElement) {
      return <h-html v-model={this.data} {...this._renderTagAttrs('h-html', htmlElement)}></h-html>;
    },
    /**
     * @description: 渲染子元素
     * @param {Object} element 元素配置数组
     * @return {Array} 所有子元素渲染结果
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
     * @param {String} type 元素类型
     * @return {String} 组件标签名称
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
      <section>
        <a-spin spinning={this.loading} size="large">
          <Tag
            class={['k-form-build-9136076486841527', this.formId]}
            ref="form"
            {...{ props: generateProps(Tag, formConfig, { model: this.data }) }}>
            {...this._renderElements(elements)}
          </Tag>
        </a-spin>
        <style>{this._renderCss(formConfig.customStyle)}</style>
      </section>
    );
  },
  created() {
    this.loadingCount += 1;
    if (!this._checkVersion(this.config.version)) {
      return;
    }
    const { frame, config: formConfig, list: elements } = this.$props.config;
    const { lifecycle, methods } = formConfig;
    lifecycle.forEach(one => {
      globalLifecycle[one.name] = bind(renderMethod(one), this);
    });
    methods.forEach(method => {
      this[method.name] = bind(renderMethod(method), this);
    });
    runLifecycle('created');
    this.componentMap = componentMap[frame] || componentMap['ant'];
    if (frame === 'ant') {
      this.antFormModalItemAttrs = this._decodeAntFormModalItemAttrs(formConfig);
    }
    this._decodeData(elements);
    this.data = this._decodeDefaultValues(Object.assign({}, this.data, this.value));
  },
  mounted() {
    runLifecycle('mounted');
    this.loadingCount -= 1;
  }
};
