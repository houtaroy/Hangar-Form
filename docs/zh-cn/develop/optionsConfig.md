# 选项配置解析

## 基础类型

表单解析器提供了基础的选项配置解析器:

- BaseOptionsParser: 选项配置解析器基类

所有选项配置解析器全部为基类的继承, 需实现parse方法

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
      <td>构造方法</td>
      <td>声明选项配置解析器类型</td>
      <td>type: string</td>
      <td>-</td>
    </tr>
    <tr>
      <td>parse</td>
      <td>解析选项配置</td>
      <td>element: 表单元素Json配置, context: 组件运行上下文</td>
      <td>Promise | 基本型</td>
    </tr>
  </tbody>
</table>

## 内置解析器

系统已提供三种内容解析器:

- dynamic: 动态数据选项配置解析器
- dictionary: 字典选项配置解析器
- enum: 枚举选项配置解析器

## 新增解析器

```js
import HForm from 'HForm'
import { BaseOptionsParser } from 'HForm/models'

class MyParser extends BaseOptionsParser {
  parse(defaultValue, context) {

  }
}

const type = 'my'
HForm.addOptionsParser(type, new MyParser(type));
```

## 移除解析器

```js
import HForm from 'HForm'

HForm.removeOptionsParser('my');
HForm.removeOptionsParser('dictionary');
```