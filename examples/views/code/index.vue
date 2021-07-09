<template>
  <h-form ref="test" v-model="value" v-bind="json"></h-form>
</template>

<script>
import testConfig from '../../../public/test.json';

export default {
  data() {
    return {
      value: {
        cascader_1625624234757: '123'
      },
      json: {
        formId: '1',
        config: testConfig
      }
    };
  },
  methods: {
    a() {}
  },
  mounted() {
    // this.$refs.test.test3();
  }
};
</script>

<style></style>
