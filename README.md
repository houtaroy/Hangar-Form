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

## Json内容说明

### Json配置

Json整体配置参数

- frame: 前端ui框架, 目前仅支持ant
- version: json版本号, 如非必要请勿擅自修改
- list: 表单元素数组, 树形结构, 内容详见Element配置
- config: 表单配置, 内容详见Form配置

### Form配置

表单相关配置参数

基本参数同k-form-design, 对新增和调整的参数进行说明:

- customStyle: 自定义css内容
- lifecycle: 生命周期方法数组, 内容详见Method配置
- methods: 方法数组, 内容详见Method配置, 会将所有方法与表单组件实例绑定

### Element配置

表单元素相关配置参数

基本参数同k-form-design, 对新增和调整的参数进行说明:

- key: 表单元素唯一标识
- type: 表单元素类别
- columns/trs/tds/list: 子组件数组, 树形结构
- class: 自定义样式类名
- style: 自定义样式
- options: 表单元素组件对应参数(props)
- model: 表单元素绑定数据字段名称
- events: 表单事件数组, 内容详见Event配置
- optionsConfig: 表单元素选项配置, 仅支持部分需要配置数据的表单元素, 内容详见OptionsConfig配置

### Method配置

方法配置参数

- name: 方法名称
- arguments: 方法参数, 多个参数以逗号分隔
- body: 方法体

### Event配置

事件配置参数

- name: 事件名称
- type: 事件绑定类型, create 创建方法 select 选择方法
- methodName: 当type为select时生效, 选择方法名称
- method: 事件创建方法, 当type为create时生效, 内容详见Method配置

### OptionsConfig配置

选项配置参数

- type: 选项配置类型, static 静态数据 dynamic 动态数据 dictionary 字典 enum 枚举
- name: 选项配置
- key: 选项配置键值

## 二次开发

暂无

## 交流

暂无
