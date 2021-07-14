# 表单定制 Hangar-Form

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/Kchengz/k-form-design/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="license">
  </a>
</p>

## 简介

本代码基于K-Form-Design项目, 对其中部分源码进行大胆修改, 并增加了例如HHtml等组件处理特殊元素

项目内容分为表单设计器(Designer)和表单解析器(Decoder)

设计器大部分延用K-Form-Design, 仅对属性面板和json格式进行一定程度的封装修改, 增加Vue生命周期/方法/事件的配置

在解析器方面, 我们舍弃了K-Form-Design的方式, 创建HForm(名称暂定), 理论上支持多前端框架, 支持对设计器中新增的配置, 详细的使用方式会在后续进行文档说明

本质上, 项目沿用K-Form-Design根据json生成表单的核心业务逻辑, 完全重构解析器, 希望能支持更多更完善的功能

注：该项目不兼容vue3.0项目，兼容vue3.0的计划正在商讨中

- [码云](https://gitee.com/houtaroy/k-form-design)

## 特性


## 组件
- KFormDesign 表单设计器（基于可视化操作快速设计出表单页面，生成配置json或页面）
- HForm 表单解析器（根据设计器中获取的配置json数据，快速构建出表单页面）



## 安装


## 引入组件
``` javascript
// 在main.js引入

import KFormDesign from 'k-form-design'
import 'k-form-design/lib/k-form-design.css'
Vue.use(KFormDesign)
```

## 使用组件
``` html
<template>
  <div>
   <k-form-design />
  </div>
</template>
```

## 交流


