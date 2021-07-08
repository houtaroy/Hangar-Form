const lifecycle = {};

const renderMethod = function(method) {
  if (method.arguments) {
    return new Function(...method.arguments.split(','), method.body);
  } else {
    return new Function(method.body);
  }
};

export default {
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
  render() {},
  created: function() {
    const { config: formConfig } = this.$props.config;
    formConfig.lifecycle.forEach(one => {
      lifecycle[one.name] = one;
    });
    formConfig.methods.forEach(method => {
      const func = renderMethod(method);
      this[method.name] = func;
    });
  },
  mounted() {
    this.test2();
  }
};
