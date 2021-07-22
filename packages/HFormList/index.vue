<template>
  <a-row :gutter="20">
    <a-col :span="6">
      <a-row v-if="addButton">
        <a-col :span="6">
          <a-button type="primary" @click="$emit('add')"> 新增 </a-button>
        </a-col>
      </a-row>

      <a-list :data-source="data">
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-list-item-meta>
            <a slot="title" @click="handleSelect(index)">{{ item[labelKey] }}</a>
          </a-list-item-meta>
          <a-button v-if="deleteButton" slot="actions" type="danger" @click.stop="handleDelete(index)"> 删除 </a-button>
        </a-list-item>
      </a-list>
<!--      <div
        v-for="(one, index) in data"
        :key="index"
        @click="handleSelect(index)"
      >

        <a-row>
          <a-col :span="20">
            {{ one[labelKey] }}
          </a-col>
          <a-col v-if="deleteButton" :span="4">
&lt;!&ndash;            <button @click.stop="handleDelete(index)">删除</button>&ndash;&gt;
            <a-button type="danger" @click.stop="handleDelete(index)"> 删除 </a-button>
          </a-col>
        </a-row>
      </div>-->
    </a-col>
    <a-col :span="18">
      <component
        v-if="selected"
        :is="formComponent"
        v-model="selected"
        v-bind="formOptions"
      ></component>
      <h4 v-else class="right-tip">请点击左侧列表选择</h4>
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
      this.selectedIndex = index;
      this.selected = this.data[index];
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

<style scoped>
.right-tip {
  text-align: center;
  margin-top: 20px;
}
</style>
