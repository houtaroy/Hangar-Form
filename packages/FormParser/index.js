import 'moment/locale/zh-cn';

import Schema from 'async-validator';
import { bind, get, has, values } from 'lodash';

import { addDefaultValueParser, removeDefaultValueParser } from './modules/DefaultValueParser';
import {
  parseOptionsConfig,
  addOptionsConfigParser,
  removeOptionsConfigParser
} from './modules/OptionsParser';
import ElementRender from '../Renders/ElementRender';
import ComponentPropParser from '../Parsers/ComponentPropParser';
import { ElementUtil, StyleUtil, VersionUtil } from '../Utils';

import { getParser } from '../Parsers';

const globalLifecycle = {};

const runLifecycle = function(name) {
  if (has(globalLifecycle, name)) {
    globalLifecycle[name]();
  }
};

function install(Vue) {
  Vue.component('form-parser', FormParser);
}

const FormParser = {
  name: 'form-parser',
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
  computed: {
    loading: function() {
      return this.loadingCount > 0;
    },
    rules: function() {
      const result = {};
      values(this.elementConfigs).forEach(elementConfig => {
        if (!get(elementConfig, 'options.disabled') && elementConfig.model && elementConfig.rules) {
          result[elementConfig.model] = elementConfig.rules;
        }
      });
      return result;
    }
  },
  watch: {
    loadingCount: function(newVal) {
      if (newVal === 0) this.resetFields();
    }
  },
  filter: {},
  methods: {
    /**
     * @description: 表单校验, 调用表单自身方法(目前仅支持ant)
     * @param {Function} callback 回调函数, 参数为验证结果
     */
    validate(callback) {
      new Schema();
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
     * @description: 表单重置
     */
    resetFields() {
      this.data = Object.assign({}, this.originalData);
    },
    /**
     * @description: 根据json配置
     * @param {Array} elements 树形结构元素配置json
     */
    _parseData(elements) {
      if (!elements) {
        return;
      }
      elements.forEach(element => {
        if (element.model) this._parseModel(element);
        if (element.optionsConfig) this._parseOptions(element);
        if (element.events) element.listeners = getParser('event').parseList(element.events, this);
        this._parseData(ElementUtil.getChildren(element));
      });
    },
    /**
     * @description: 解析json的model属性, 包括表单数据对象和元素Map
     * @param {Object} element 元素配置json
     */
    _parseModel(element) {
      const key = element.model;
      has(this.value, key)
        ? this.$set(this.originalData, key, this.value[key])
        : this._parseDefaultValue(key, element.options.defaultValue);
      this.$set(this.elementConfigs, key, element);
    },
    /**
     * @description: 解析默认值
     * @param {String} key 默认值对应属性名称
     * @param {String} defaultValue 默认值表达式
     */
    _parseDefaultValue(key, defaultValue) {
      let result = defaultValue;
      for (const parser of this.defaultValueParsers) {
        if (parser.test(defaultValue)) {
          result = parser.parse(defaultValue, this);
          break;
        }
      }
      this.formDataParser.add(result, 'originalData', key);
    },
    /**
     * @description: 解析选项配置
     * @param {Object} element 表单元素Json
     */
    _parseOptions(element) {
      this.formDataParser.add(parseOptionsConfig(element, this), 'optionsMap', element.key);
    },
    ...ElementRender
  },
  render(h) {
    if (this.error) {
      return <h1 style="text-align: center">{this.errorMessage}</h1>;
    }
    const { config: formConfig, list: elements } = this.$props.config;
    const FormComponentName = this._getComponentName({ type: 'form' });
    return (
      <section>
        <a-spin spinning={this.loading} size="large">
          <FormComponentName
            class={['k-form-build-9136076486841527', `form-${this.formId}`]}
            ref="form"
            {...{
              props: ComponentPropParser.parse(FormComponentName, formConfig, { model: this.data })
            }}>
            {...this._renderList(h, elements)}
          </FormComponentName>
        </a-spin>
        <style>{StyleUtil.addPrefixSelector(formConfig.customStyle, `form-${this.formId}`)}</style>
      </section>
    );
  },
  beforeCreate() {
    const { config: jsonCofing } = this.$options.propsData;
    const versionCheckResult = VersionUtil.checkJsonVersion(jsonCofing.version);
    if (versionCheckResult.error) {
      this.$options.data = function() {
        return versionCheckResult;
      };
      this.$options.created = undefined;
      this.$options.mounted = undefined;
      return;
    }
    this.$options.data = getParser('data').parse();
    const { component } = jsonCofing.config;
    for (const key in component) {
      const parser = getParser(key);
      if (parser) {
        const data = component[key];
        this.$options[key] = Object.assign(
          {},
          this.$options[key],
          data instanceof Array ? parser.parseList(data) : parser.parse(data)
        );
      }
    }
  },
  created() {
    this.loadingCount += 1;
    const { config: jsonConfig } = this.$props;
    const { frame, config: formConfig, list: elements } = jsonConfig;
    const { lifecycle } = formConfig;
    lifecycle.forEach(one => {
      globalLifecycle[one.name] = bind(getParser('method').parse(one), this);
    });
    this._initRender(frame, formConfig);
    runLifecycle('created');
    this._parseData(elements);
    this.formDataParser.parse(this);
  },
  mounted() {
    runLifecycle('mounted');
    this.loadingCount -= 1;
  }
};

export {
  FormParser,
  addDefaultValueParser,
  removeDefaultValueParser,
  addOptionsConfigParser,
  removeOptionsConfigParser
};

export default {
  install,
  FormParser,
  addDefaultValueParser,
  removeDefaultValueParser,
  addOptionsConfigParser,
  removeOptionsConfigParser
};
