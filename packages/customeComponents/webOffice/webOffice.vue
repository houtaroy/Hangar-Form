<!--
 * @Author: your name
 * @Date: 2021-08-15 09:46:41
 * @LastEditTime: 2021-08-16 16:26:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \k-form-design-dev\packages\customeComponents\webOffice\webOffice.vue
-->
<template>
  <div>
    <iframe width="100%" frameborder="0" height="800px" :src="iframeSrc"></iframe>
  </div>
</template>

<script>

import storage from 'store';
import { ACCESS_TOKEN } from '../../../examples/store/mutation-types';
  export default {
    props: {
      disabled: {
        type: Boolean,
        default: false
      }
    },
    mixins: [],
    components: {},
    name: 'webOffice',
    install: function (Vue) {
      Vue.component('h-web-office', this);
    },
    data() {
      return {
        iframeSrc: "office/webOffice.html?token=" + storage.get(ACCESS_TOKEN)
      };
    },
    mounted() {

    },
    methods: {}
  };
</script>
