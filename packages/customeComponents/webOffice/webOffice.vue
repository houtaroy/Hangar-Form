<!--
 * @Author: your name
 * @Date: 2021-08-15 09:46:41
 * @LastEditTime: 2021-08-16 16:26:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \k-form-design-dev\packages\customeComponents\webOffice\webOffice.vue
-->
<template>
  <iframe
    name="iframeOffice"
    id="iframeOfficeViewContent"
    width="100%"
    frameborder="0"
    height="800px"
    :src="iframeSrc"
    ref="iframeDom"
  ></iframe>
</template>

<script>
import { nanoid } from 'nanoid';
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  },
  mixins: [],
  components: {},
  name: 'webOffice',
  install: function(Vue) {
    Vue.component('h-web-office', this);
  },
  data() {
    return {
      iframeSrc: 'office/webOffice.html' + '?fileId=' + this.officeId + '&disabled' + this.disabled,
      iframeWindow: null,
      officeId: null,
      isNewID: null
    };
  },
  mounted() {
    this.iframeWindow = this.$refs.iframeDom.contentWindow;
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal) {
          if (newVal !== this.officeId) {
            this.isNewID = 0;
            this.officeId = newVal;
          } else {
            this.isNewID = 1;
            this.officeId = newVal;
          }
        } else {
          this.officeId = nanoid(16);
          this.isNewID = 1;
          this.$emit('input', this.officeId);
        }
        this.iframeSrc =
          'office/webOffice.html' +
          '?fileId=' +
          this.officeId +
          '&isRead=' +
          this.disabled +
          '&isNewFileId=' +
          this.isNewID;
      },
      immediate: true
    }
  },
  methods: {
    saveMethod() {
      const saveResult = this.iframeWindow.saveFileToUrl();
      this.officeId = this.iframeWindow.fileId;
      this.$emit('input', this.officeId);
      return saveResult;
    },
    isFileSaved() {
      return this.iframeWindow.isObjSaved();
    }
  }
};
</script>
