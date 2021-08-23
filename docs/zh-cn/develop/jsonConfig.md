# Json配置说明

## 整体配置

- frame: 前端ui框架, 目前仅支持ant
- version: json版本号, 如非必要请勿擅自修改
- list: 表单元素数组, 树形结构, 内容详见Element配置
- config: 表单配置, 内容详见Form配置

## 表单配置

基本参数同k-form-design, 对新增和调整的参数进行说明:

- customStyle: 自定义css内容
- lifecycle: 生命周期方法数组, 内容详见Method配置
- methods: 方法数组, 内容详见Method配置, 会将所有方法与表单组件实例绑定

## 表单元素配置

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

## 方法配置

- name: 方法名称
- arguments: 方法参数, 多个参数以逗号分隔
- body: 方法体

## 事件配置

- name: 事件名称
- type: 事件绑定类型, create 创建方法 select 选择方法
- methodName: 当type为select时生效, 选择方法名称
- method: 事件创建方法, 当type为create时生效, 内容详见Method配置

## 选项配置

- type: 选项配置类型, static 静态数据 dynamic 动态数据 dictionary 字典 enum 枚举
- name: 选项配置
- key: 选项配置键值