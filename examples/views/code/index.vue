<template>
  <div>
    <h-form ref="test" v-model="value" v-bind="json"></h-form>
    <button @click="submit" class="test">提交</button>
    <button @click="reset">重置</button>
  </div>
</template>

<script>
import testConfig from '../../../public/test.json';

export default {
  name: 'codePage',
  data() {
    return {
      value: {
        // input_1625624184608: '123',
        number_1625624195507: 0,
        hWebOfficeInput: '1212121212212'
      },
      json: {
        formId: '1',
        config: testConfig,
        extendConfigs: [
          {
            textarea_1625624188841: {
              disabled: true
            }
          }
        ],
        disabled: false
      }
    };
  },
  methods: {
    submit() {
      this.$refs.test.submit((valid, data) => {
        console.log('验证', valid);
        console.log('数据', data);
      });
      console.log('原始数据', this.value);
    },
    reset() {
      this.$refs.test.resetFields();
    }
  }
};
</script>

<style></style>
