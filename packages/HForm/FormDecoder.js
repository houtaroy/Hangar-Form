import has from 'lodash/has';

const componentMap = {
  grid: 'a-row',
  input: 'a-input'
};

export default {
  name: 'h-form-decoder',
  install: function(Vue) {
    Vue.component(this.name, this);
  },
  props: ['value', 'items'],
  render(h) {
    const result = this.renderItems(h, this.items);
    console.log(result);
    return h('a-form-model', {}, result);
  },
  methods: {
    renderItems(h, items) {
      let result = [];
      items.forEach(item => {
        if (has(componentMap, item.type)) {
          const test = h(componentMap[item.type], { attrs: item.options });
          result.push(h('a-form-model-item', { attrs: item }, [test]));
        }
        if (item.columns) {
          result = result.concat(this.renderItems(h, item.columns));
        }
        if (item.list) {
          result = result.concat(this.renderItems(h, item.list));
        }
      });
      return result;
    }
  }
};
