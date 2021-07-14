<template>
  <component v-show="!hidden" :data="value" :is="component"></component>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'h-html',
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
    hidden: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      component: null
    };
  },
  created() {
    console.log('created', this);
  },
  mounted() {
    this.component = Vue.extend({
      template: `<div>${this.defaultValue}</div>`,
      props: ['data']
    });
  }
};
</script>

<style></style>
