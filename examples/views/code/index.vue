<template>
  <div>
    <h-method v-model="funcs"></h-method>
  </div>
</template>

<script>
import HMethod from '../../../packages/HMethod';

export default {
  components: {
    HMethod
  },
  data() {
    return {
      methods: [
        {
          name: 'mounted',
          arguments: '',
          body: ''
        },
        {
          name: 'test',
          arguments: 'name, code',
          body: ''
        }
      ]
    };
  }
};
</script>

<style></style>
