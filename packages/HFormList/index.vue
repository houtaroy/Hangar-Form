<template>
  <a-row>
    <a-col :span="6">
      <a-row v-if="addButton">
        <a-col :span="6">
          <button @click="$emit('add')">新增</button>
        </a-col>
      </a-row>
      <div
        v-for="(one, index) in data"
        :key="index"
        @click="handleSelect(index)"
      >
        <a-row>
          <a-col :span="20">
            {{ one[labelKey] }}
          </a-col>
          <a-col v-if="deleteButton" :span="4">
            <button @click.stop="handleDelete(index)">删除</button>
          </a-col>
        </a-row>
      </div>
    </a-col>
    <a-col :span="18">
      <component
        v-if="selected"
        :is="formComponent"
        v-model="selected"
        v-bind="formOptions"
      ></component>
    </a-col>
  </a-row>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      required: true
    },
    formComponent: {
      type: [Object, String],
      required: true
    },
    formOptions: {
      type: Object,
      default: function() {
        return {};
      }
    },
    addButton: {
      type: Boolean,
      default: true
    },
    deleteButton: {
      type: Boolean,
      default: true
    },
    labelKey: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      data: this.value,
      selected: null,
      selectedIndex: null
    };
  },
  watch: {
    value(newVal) {
      this.data = newVal;
    }
  },
  methods: {
    handleSelect(index) {
      console.log('我选中了');
      this.selectedIndex = index;
      this.selected = this.data[index];
      console.log('选中对象', this.selected);
    },
    handleDelete(index) {
      if (index === this.selectedIndex) {
        this.selectedIndex = null;
        this.selected = null;
      }
      this.data.splice(index, 1);
    }
  }
};
</script>

<style></style>
