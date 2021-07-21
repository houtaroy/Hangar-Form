# 默认值解析

## 基础类型

表单解析器提供了两种基础的默认值解析器:

- BaseDefaultValueDecoder: 默认值解析器基类
- BaseRegexpDefaultValueDecoder: 正则默认值解析器基类

所有默认值解析器全部为二者的继承, 并实现test和decode方法

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
      <td>decode</td>
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
import { BaseDefaultValueDecoder, BaseRegexpDefaultValueDecoder } from 'HForm/models'

class MyDecoder extends BaseDefaultValueDecoder {
  test(defaultValue) {

  }
  decode(defaultValue, context) {

  }
}

class MyRegexpDecoder extends BaseRegexpDefaultValueDecoder {
  decode(defaultValue, context) {

  }
}

HForm.addDefaultValueDecoder('myDecoder', new MyDecoder());
HForm.addDefaultValueDecoder('myRegexpDecoder', new MyRegexpDecoder(/^\$my.data$/));
```

## 移除解析器

```js
import HForm from 'HForm'

HForm.removeDefaultValueDecoder('myDecoder');
HForm.removeDefaultValueDecoder('store');
```