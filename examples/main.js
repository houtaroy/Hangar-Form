/*
 * @Descripttion:
 * @Author: kcz
 * @Date: 2021-05-02 16:04:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-14 13:47:04
 */
// 引入@babel/polyfill处理兼容
import '@babel/polyfill';

import Vue from 'vue';
import App from './App.vue';
import router from './router/';
import store from './store/';

import KFormDesign from '../packages/index';
// import Cmp from './components/CustomComponent/index.vue';
import uploader from 'vue-simple-uploader';
// import HUploader from './components/uploadFile/SimpleUploader';
// const Cmp = {
//   name: "cmp",
//   render: function(h) {
//     return h("div", "我是自定义组件");
//   }
// };
/*KFormDesign.setFormDesignConfig({
  title: '测试自定义字段',
  list: [
    {
      type: 'demo', // 表单类型
      label: '自定义组件', // 标题文字
      icon: 'icon-gallery',
      component: Cmp,
      options: {
        defaultValue: undefined,
        multiple: false,
        disabled: false,
        width: '100%',
        clearable: true,
        placeholder: '请选择',
        showSearch: false,
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: '必填项'
        }
      ]
    },
    {
      type: 'hUpload', // 表单类型
      label: '自定义上传', // 标题文字
      icon: 'icon-upload',
      component: HUploader,
      options: {
        defaultValue: undefined,
        disabled: false,
        width: '100%',
        text: ''
      },
      model: '',
      key: '',
      rules: [
        {
          required: false,
          message: '必填项'
        }
      ]
    }
  ],
  uploadFile: '',
  uploadImage: '',
  uploadFileName: '',
  uploadImageName: '',
  uploadFileData: { data: 1545 },
  uploadImageData: { data: 1545 },
  uploadFileHeaders: { data: 1545 },
  uploadImageHeaders: { data: 1545 }
});*/
Vue.use(KFormDesign);
Vue.use(uploader);
// KFormDesign.setFormBuildConfig({
//   dynamicData: {
//     test: [
//       { label: "test", value: "1" },
//       { label: "test1", value: "2" }
//     ]
//   }
// });
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
