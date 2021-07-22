# 默认值解析

## 基础类型

表单解析器提供了两种基础的默认值解析器:

- BaseDefaultValueParser: 默认值解析器基类
- BaseRegexpDefaultValueParser: 正则默认值解析器基类

所有默认值解析器全部为二者的继承, 并实现test和parse方法

<table>
  <thead>
    <tr>
      <th>方法</th>
      <th>说明</th>
      <th>参数</th>
      <th>返回结果</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>test</td>
      <td>检测默认值表达式是否符合当前解析器规则</td>
      <td>defaultValue: string</td>
      <td>boolean</td>
    </tr>
    <tr>
      <td>parse</td>
      <td>解析默认值</td>
      <td>defaultValue: string, context: 组件运行上下文</td>
      <td>Promise | 基本型</td>
    </tr>
  </tbody>
</table>

## 内置解析器

系统已提供三种内置解析器:

- store: 缓存默认值解析器
- data: 当前组件数据默认值解析器
- api: 接口默认值解析器

## 新增解析器

```js
import HForm from 'HForm'
import { BaseDefaultValueParser, BaseRegexpDefaultValueParser } from 'HForm/models'

class MyParser extends BaseDefaultValueParser {
  test(defaultValue) {

  }
  parse(defaultValue, context) {

  }
}

class MyRegexpParser extends BaseRegexpDefaultValueParser {
  parse(defaultValue, context) {

  }
}

HForm.addDefaultValueParser('myParser', new MyParser());
HForm.addDefaultValueParser('myRegexpParser', new MyRegexpParser(/^\$my.data$/));
```

## 移除解析器

```js
import HForm from 'HForm'

HForm.removeDefaultValueParser('myParser');
HForm.removeDefaultValueParser('store');
```