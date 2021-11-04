<template>
  <div class="common-options">
    <a-textarea
      v-model="textareaValue"
      :placeholder="placeholder"
      :auto-size="autoSize"
      @change="valueChange"
      :allow-clear="allowClear"
      :max-length="maxLength"
      :disabled="disabled"
      @blur="itemBlur"
    />
    <a-button v-if="!disabled" type="link" class="common-options-btn" @click.prevent="openModal">
      常用意见
    </a-button>
    <a-modal v-model="visible" title="常用意见">
      <template slot="footer">
        <a-button key="back" @click="visible = false">
          取消
        </a-button>
      </template>
      <a-list :data-source="listData">
        <a-list-item
          class="common-options-list"
          slot="renderItem"
          slot-scope="item"
          @click="selectOptions(item)"
          style="cursor: pointer"
        >
          {{ item.content }}
        </a-list-item>
      </a-list>
    </a-modal>
  </div>
</template>

<script>
/**
 * @module commonOptions
 */
export default {
  name: 'commonOptions',
  install: function(Vue) {
    Vue.component('h-comment-options', this);
  },
  mixins: [],
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    listData: {
      type: Array,
      default: () => []
    },
    autoSize: {
      type: Object,
      default: () => {}
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: 300
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      textareaValue: '',
      visible: false,
      data: []
    };
  },
  computed: {},
  watch: {
    value: {
      handler(val) {
        this.textareaValue = val ? val : null;
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    openModal() {
      this.visible = true;
    },
    selectOptions(item) {
      this.textareaValue = item.content;
      this.$emit('input', this.textareaValue);
      this.$emit('click');
      this.visible = false;
    },
    valueChange() {
      this.$emit('input', this.textareaValue);
    },
    itemBlur() {
      this.$emit('blur');
    }
  }
};
</script>

<style scoped>
.common-options {
  position: relative;
}
.common-options:hover .common-options-btn {
  display: block;
}
.common-options-btn {
  display: none;
  position: absolute;
  top: 6px;
  right: 10px;
  margin-right: 10px;
  background-color: #fafafa;
  padding: 2px 4px;
  border-radius: 6px;
}

.common-options-list {
  transition: color 0.8s;
  -webkit-transition: color 0.8s; /* Safari */
}

.common-options-list:hover {
  color: #1e90ff;
}
</style>
