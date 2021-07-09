import bind from 'lodash/bind';
import has from 'lodash/has';

const childrenKeys = ['columns', 'trs', 'tds', 'list'];

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

const decodeItems = function(items) {
  items.forEach(item => {
    if (has(item, 'model') && item.model) {
      this.$set(this.modelObject, item.model, '');
      this.modelMap[item.model] = item;
    }
    childrenKeys.forEach(childrenKey => {
      if (item[childrenKey]) {
        this.decodeItems(item[childrenKey]);
      }
    });
  });
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
      modelObject: {},
      modelMap: {}
    };
  },
  methods: {
    decodeItems: decodeItems
  },
  render() {
    return <h-form-decoder v-model={this.value} items={this.config.list}></h-form-decoder>;
  },
  created: function() {
    const { config: formConfig, list: items } = this.$props.config;
    const { lifecycle, methods } = formConfig;
    lifecycle.forEach(one => {
      globalLifecycle[one.name] = bind(renderMethod(one), this);
    });
    methods.forEach(method => {
      this[method.name] = bind(renderMethod(method), this);
    });
    this.decodeItems(items);
    this.modelObject = Object.assign(this.modelObject, this.value);
    runLifecycle('created');
    console.log(this.modelObject);
    console.log(this.modelMap);
  },
  mounted() {
    runLifecycle('mounted');
  }
};
