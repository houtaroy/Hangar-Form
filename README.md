# 表单定制 hangar-form

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/Kchengz/k-form-design/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="license">
  </a>
</p>

## 简介

本代码基于k-form-design项目, 对其中部分源码进行修改, 增加了HHtml等组件处理特殊元素

项目内容分为表单设计器(Designer)和表单解析器(Parser)

表单设计器大部分延用k-form-design, 通过对属性面板和默认Json的修改实现生命周期/方法/事件等功能的支持

表单解析器舍弃了k-form-design的KFormBuild, 编写新的实现方式HForm, 同步支持设计器中的功能

本质上, 项目沿用k-form-design根据Json生成表单的核心业务逻辑, 完全重构解析器, 在增加部分新功能的同时对公司后台进行一定程度的适配

注：该项目不兼容vue3.0项目，兼容vue3.0的计划正在商讨中

- [Gitee](https://gitee.com/houtaroy/k-form-design)

## 特性

- 支持配置Vue组件生命周期
- 支持配置Vue组件方法
- 支持配置表单元素事件
- 支持表单自定义CSS
- 支持表单元素自定义class与style
- 支持表单元素默认值解析
- 支持表单元素选项配置解析

## 组件

- KFormDesign 表单设计器（基于可视化操作快速设计出表单页面，生成配置json或页面）
- HForm 表单解析器（根据设计器中获取的配置json数据，快速构建出表单页面）

## 安装

暂无

## 引入组件

``` javascript
// 在main.js引入
import KFormDesign from 'k-form-design'
import HForm from 'k-form-design'
import 'k-form-design/lib/k-form-design.css'
Vue.use(KFormDesign)
Vue.use(HForm)
```

## 使用组件

```html
<template>
  <div>
   <k-form-design />
   <h-form v-model="data" :formId="formId" :config="jsonConfig" :extendConfigs="extendConfigs">
  </div>
</template>

<script>
export default {
  data() {
    return {
      formId: 'test-01',
      data: {
        name: 'test'
      },
      jsonConfig: {
        frame: 'ant',
        version: '1.0.0',
        list: [],
        config: {}
      },
      extendConfigs: [
          {
            name: {
              disabled: true
            }
          }
        ]
    };
  },
</script>
```
如果需要隐藏某个选项，用到联动，可以在hidden里写boolen的表达式。页面操作暂未更改，还没想好怎么展示比较好。
