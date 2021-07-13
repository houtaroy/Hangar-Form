<template>
  <component v-show="!hidden" :data="value" :is="component"></component>
</template>

<script>
import Vue from 'vue/dist/vue.esm.js';

export default {
  name: 'h-html',
  install: function(Vue) {
    Vue.component(this.name, this);
  },
  props: {
    value: {
      type: Object,
      required: function() {
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
    console.log(this);
    this.component = Vue.extend({
      template: `<div>${this.defaultValue}</div>`,
      props: ['data'],
      mounted() {
        console.log(this.data);
      }
    });
  }
};
</script>

<style></style>
