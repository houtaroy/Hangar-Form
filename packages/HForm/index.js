import bind from 'lodash/bind';
import has from 'lodash/has';
// import capitalize from 'lodash/capitalize';
import { version as decoderVersion } from '../../package.json';

import { componentMap, constantComponentMap, childrenKeys, layoutKeys } from './config';

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
          this.$set(this.data, element.model, 0);
          this.$set(this.elementMap, element.model, element);
        }
        childrenKeys.forEach(key => {
          if (element[key]) {
            this.decodeData(element[key]);
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
        result.push(this._renderElement(element));
      });
      return result;
    },
    /**
     * @description: 渲染元素
     * @param {*} element 元素配置对象
     * @return {*} 渲染结果
     */
    _renderElement(element) {
      return layoutKeys.includes(element.type)
        ? this._renderLayout(element)
        : this._renderFormItem(element);
    },
    /**
     * @description: 渲染布局元素
     * @param {*} element 布局元素配置对象
     * @return {*} 渲染结果
     */
    _renderLayout(element) {
      const Tag = this._getTag(element.type);
      if (Tag === 'a-tab-pane') {
        return this._renderAntTabPane(element);
      }
      return <Tag {...{ props: element.options || element }}>{this._renderChildren(element)}</Tag>;
    },
    /**
     * @description: 渲染表单元素
     * @param {*} element 表单元素配置对象
     * @return {*} 渲染结果
     */
    _renderFormItem(element) {
      const Tag = this._getTag(element.type);
      return (
        <a-form-model-item {...{ props: element }}>
          <Tag v-model={this.data[element.model]} {...{ props: element.options || element }}>
            {this._renderChildren(element)}
          </Tag>
        </a-form-model-item>
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
    return (
      <a-form-model v-model={this.data} {...{ props: formConfig }}>
        {...this._renderElements(elements)}
      </a-form-model>
    );
  },
  created() {
    if (!this._checkVersion(this.config.version)) {
      return;
    }
    const { frame, config: formConfig } = this.$props.config;
    this.componentMap = componentMap[frame] || componentMap['ant'];
    const { lifecycle, methods, list: elements } = formConfig;
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
