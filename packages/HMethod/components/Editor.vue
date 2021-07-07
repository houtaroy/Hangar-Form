<template>
  <a-form-model :model="data" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-model-item label="方法名称">
      <a-input v-model="data.name"></a-input>
    </a-form-model-item>
    <a-form-model-item label="方法参数">
      <a-input v-model="data.arguments"></a-input>
    </a-form-model-item>
    <a-form-model-item label="方法内容">
      <div>{{ data.name }} ({{ data.arguments }}) {</div>
      <codemirror
        v-model="data.body"
        ref="codemirror"
        :options="options"
      ></codemirror>
      <div>}</div>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { codemirror } from 'vue-codemirror-lite';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/javascript-hint';

export default {
  props: ['value'],
  components: {
    codemirror
  },
  data() {
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
      data: this.value,
      options: {
        mode: 'javascript',
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true
      }
    };
  },
  watch: {
    value(newVale) {
      this.data = newVale;
    }
    // data(newVal) {
    //   this.$emit('input', newVal);
    // }
  },
  computed: {
    editor() {
      // get current editor object
      return this.$refs.codemirror.editor;
    }
  },
  mounted() {
    this.editor.on('keypress', () => {
      this.editor.showHint({ completeSingle: false });
    });
  }
};
</script>

<style>
.CodeMirror-hints {
  z-index: 2000;
}
</style>
