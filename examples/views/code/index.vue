<template>
  <test ref="test" v-bind="json"></test>
</template>

<script>
import test from '../../../packages/HFormBuilder';

export default {
  components: {
    test
  },
  data() {
    return {
      json: {
        formId: '1',
        config: {
          config: {
            lifecycle: [
              {
                name: 'mounted',
                body: "console.log('this', this)"
              }
            ],
            methods: [
              {
                name: 'test',
                arguments: '',
                body: 'console.log(1)'
              },
              {
                name: 'test2',
                arguments: 'name',
                body: 'this.test()'
              }
            ]
          }
        }
      }
    };
  },
  methods: {
    a() {}
  }
};
</script>

<style></style>
