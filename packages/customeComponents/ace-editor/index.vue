<!--
* @Description:
-->
<template>
  <section>
    <editor
      height="550"
      width="100%"
      ref="editor"
      v-model="content"
      :lang="'json'"
      @init="editorInit"
      theme="chrome"
      :options="options"
      @input="valueChange"
    >
    </editor>
  </section>
</template>

<script>
import Editor from 'vue2-ace-editor';
export default {
  name: 'aceEditor',
  install: function(Vue) {
    Vue.component('h-ace-editor', this);
  },
  components: {
    Editor
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      content: '',
      options: {
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        tabSize: 2,
        fontSize: 14,
        showPrintMargin: false //去除编辑器里的竖线
      }
    };
  },
  created() {},
  mounted() {},
  activited() {},
  methods: {
    editorInit() {
      require('brace/ext/language_tools'); //language extension prerequsite...
      require('brace/mode/json');
      require('brace/theme/chrome');
      require('brace/snippets/json');
      require('brace/ext/beautify');
    },
    valueChange() {
      // this.$emit('input', JSON.parse(this.content));
      let value1;
      try {
        value1 = JSON.parse(this.content);
        this.$emit('input', value1);
      } catch (e) {}
    }
  },
  filter: {},
  computed: {},
  watch: {
    value: {
      handler(val) {
        if (!val) return;
        // this.content = JSON.stringify(val);
        this.content = JSON.stringify(val, null, '\t');
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="scss"></style>
