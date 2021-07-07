<template>
  <a-row>
    <a-col :span="6">
      <a-row>
        <a-col :span="4">
          <button @click="handleAdd">新增事件</button>
        </a-col>
      </a-row>
      <div v-for="(one, index) in data" :key="index" @click="selected = one">
        <a-row>
          <a-col :span="20">
            {{ one.name }}
          </a-col>
          <a-col :span="4">
            <button @click.stop="handleDelete(index)">删除</button>
          </a-col>
        </a-row>
      </div>
    </a-col>
    <a-col v-if="selected" :span="18">
      <a-form-model
        v-model="selected"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="事件名称">
          <a-input v-model="selected.name"></a-input>
        </a-form-model-item>
        <a-form-model-item label="事件方法">
          <a-select v-model="selected.methodName">
            <a-select-option
              v-for="method in methods"
              :key="method.name"
              :value="method.name"
              >{{ method.name }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-col>
  </a-row>
</template>

<script>
export default {
  props: ['value', 'methods'],
  data() {
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
      data: this.value,
      selected: null
    };
  },
  computed: {
    nextEventName() {
      return 'event_' + (this.data.length + 1);
    }
  },
  methods: {
    handleAdd() {
      this.data.push(
        Object.assign({
          name: this.nextEventName,
          methodName: ''
        })
      );
    },
    handleDelete(index) {
      if (this.selected && this.selected.name === this.data[index].name) {
        this.selected = null;
      }
      this.data.splice(index, 1);
    }
  }
};
</script>

<style></style>
