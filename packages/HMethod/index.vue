<template>
  <a-row>
    <a-col :span="6">
      <a-row>
        <a-col :span="4">
          <button @click="handleAdd">新增方法</button>
        </a-col>
      </a-row>
      <div v-for="(one, index) in data" :key="index" @click="selected = one">
        <a-row>
          <a-col :span="20">
            {{ one.name }}
          </a-col>
          <a-col v-if="one.name !== 'mounted'" :span="4">
            <button @click.stop="handleDelete(index)">删除</button>
          </a-col>
        </a-row>
      </div>
    </a-col>
    <a-col :span="18">
      <editor v-if="selected" v-model="selected"></editor>
    </a-col>
  </a-row>
</template>

<script>
import Editor from './components/Editor.vue';

export default {
  props: ['value'],
  components: {
    Editor
  },
  data() {
    return {
      data: this.value,
      selected: null,
      selectedIndex: null
    };
  },
  computed: {
    nextFuncName() {
      return 'method_' + (this.data.length + 1);
    }
  },
  methods: {
    handleAdd() {
      this.data.push(
        Object.assign({
          name: this.nextFuncName,
          arguments: '',
          body: ''
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
