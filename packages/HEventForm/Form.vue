<template>
  <a-form-model v-model="data" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-model-item label="事件名称">
      <a-input v-model="data.name"></a-input>
    </a-form-model-item>
    <a-form-model-item label="创建方式">
      <a-radio-group v-model="data.type">
        <a-radio value="select">
          选择
        </a-radio>
        <a-radio value="create">
          创建
        </a-radio>
      </a-radio-group>
    </a-form-model-item>
    <a-form-model-item v-if="data.type === 'select'" label="选择方法">
      <a-select v-model="data.methodName">
        <a-select-option
          v-for="method in methods"
          :key="method.name"
          :value="method.name"
          >{{ method.name }}</a-select-option
        >
      </a-select>
    </a-form-model-item>
    <a-form-model-item v-else>
      <h-method-form v-model="data.method"></h-method-form>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
export default {
  name: 'h-event-form',
  props: {
    value: {
      type: Object,
      required: true
    },
    methods: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
      data: this.value
    };
  },
  watch: {
    value(newVal) {
      this.data = newVal;
    }
  }
};
</script>

<style></style>
