# 特殊组件

text和html为特殊组件, 不会因前端组件库切换产生变化

## text

## html

html使用HHtml进行封装, 可使用表单数据, 例如:

```html
<div>
  my name is {{ data.name }}
</div>
```

**注意: 表单数据需要data前缀**