<template>
  <div>
    <form-parser ref="test" v-model="value" v-bind="json"></form-parser>
    <button @click="submit" class="test">提交</button>
    <button @click="reset">重置</button>
  </div>
</template>

<script>
import testConfig from '../../../public/test.json';

// import { BaseParser, getParsers, setParser } from '../../../packages/Parsers';

export default {
  data() {
    return {
      value: {
        // input_1625624184608: '123',
        number_1625624195507: 0
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
        ]
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
  // mounted() {
  //   console.log('开始的方法解析器', getParsers()['method']);
  //   class MyMethod extends BaseParser {}
  //   setParser('method', new MyMethod());
  //   console.log('之后的1', getParsers()['method']);
  // }
};
</script>

<style></style>
