<template>
  <!-- 月份选择 -->
  <a-month-picker
    v-model="date"
    v-if="format === 'YYYY-MM' && range === false"
    :disabled="disabled"
    :placeholder="placeholder"
    :format="format"
    :valueFormat="valueFormat"
    @change="handleSelectChange"
  />
  <!-- 日期选择 -->
  <a-date-picker
    v-model="date"
    v-else-if="range === false"
    :show-time="showTime"
    :disabled="disabled"
    :placeholder="placeholder"
    :format="showTime ? 'YYYY-MM-DD HH:mm:ss' : format"
    :value-format="valueFormat"
    @change="handleSelectChange"
  />
</template>

<script>
export default {
  name: 'HDatePicker',
  props: {
    value: {},
    range: {
      type: Boolean,
      defaultValue: false
    },
    showTime: {
      type: Boolean,
      defaultValue: false
    },
    disabled: {
      type: Boolean,
      defaultValue: false
    },
    placeholder: {
      type: String,
      defaultValue: ''
    },
    rangePlaceholder: {
      type: Array,
      defaultValue: []
    },
    format: {
      type: String,
      defaultValue: 'YYYY-MM-DD'
    },
    valueFormat: {
      type: String,
      defaultValue: 'x'
    }
  },
  data() {
    return {
      date: ''
    };
  },
  methods: {
    handleSelectChange(val) {
      this.$emit('input', val);
      this.$emit('change', val);
    }
  },
  watch: {
    value: {
      handler(val) {
        this.date = val ? val.toString() : null;
      },
      immediate: true
    }
  }
};
</script>

<style scoped></style>
