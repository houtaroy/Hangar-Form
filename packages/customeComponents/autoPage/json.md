#### 查询项配置

```js
props: {
  queryList: Array, // 搜索列表
  col: Object, // 查询项的布局
  operateButton: Array // 搜索条件后的按钮
}
```

##### queryList

```js
queryList: [
    {
        label: '姓名', // label标签
        model: 'name', // 绑定字段
        type: 'input', // 搜索条件类型
        placeholder: '请输入', //
        isExtendSearch: false, // 是否折叠后的搜索条件
        sort: 1 // 搜索条件的排序
    },
    {
        label: '姓名',
        model: 'name',
        type: 'input',
        placeholder: '请输入',
        isExtendSearch: false,
        sort: 2
    }
]
```

##### col

```js
col: {
    xl: 6,
    lg: 7,
    md: 8,
    sm: 24
}
```

##### operateButton

```js
operatButtons: [
    {
        buttonName: '查询',
        action: 'search'
    },
    {
        buttonName: '重置',
        action: 'reset'
    },
]
```



#### 操作按钮的配置

```js
props: {
  operateButtons: Array, // 操作按钮数组
}
```

##### operateButtons

```js
operateButtons: [
    {
        buttonName: '新增', // 按钮名称
        action: 'add('/add')' // 按钮操作
    },
    {
        buttonName: 'excel导出',
        action: 'exoprt'
    },
    {
        buttonName: '批量操作',
        action: ''
    }
]
```

#### 列表配置

```js
props: {
    dataSource: Array,
    columns: Array
}
```

##### dataSource

```js
columns: [
    {
        title: "", // 列名
        dataIndex: "", // 数据字段
        key: "", // 唯一标识
        scopedSlots: { "customRender": "" }, // slot
        align: "left", // 对齐方式
        ellipsis: false,
        showOverflowTooltip: false,
        colSpan: null, // 合并单元格
        width: null, // 列宽，表头列合并,设置为 0 时，不渲染
        className: "",
        fixed: false,
        editable: true,
        type: "operateBtns", // 'index', 'operateBtns', 'link'可选
        btns: [
            {
                name: "查看详情",
                action: "detailRecord"
            },
            {
                name: "删除",
                action: "deleteRecord"
            }
        ],
        sorter: true, // 是否排序
        sortIndex: 1, // 列名排序
        hidden: false, // 是否显示
        herf: '', // 点击跳转链接
        customRender: (text, record, index) => {
            return text
        }
    }
],
```

###### 举例

```js
const column = [
  {
    title: '序号', // ant-table属性
    dataIndex: 'index', // ant-table属性
    key: 'index', // ant-table属性
    scopedSlots: { customRender: 'index' }, // ant-table属性
    type: 'index' // 排序列
  },
  {
    title: '姓名', // ant-table属性
    dataIndex: 'name', // ant-table属性
    key: 'name', // ant-table属性
    scopedSlots: { customRender: 'name' }, // ant-table属性
    editable: true, // 这一列是否可编辑
    filedOptions: {
      // 字段信息
      type: 'input', // 字段类型
      rules: [
        // 字段规则
        {
          required: true,
          message: '必填项'
        },
        {
          min: 2,
          max: 4,
          message: '请输入正确的位数'
        }
      ]
    }
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 380,
    scopedSlots: { customRender: 'age' },
    editable: true,
    filedOptions: {
      type: 'select',
      optionsConfig: {
        type: 'dictionary',
        name: 'sex',
        options: []
      }
    }
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    ellipsis: true,
    showTooltip: true, // 是否显示tooltip
    width: null,
    scopedSlots: { customRender: 'address' }
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    type: 'operateBtns', // 操作列
    scopedSlots: { customRender: 'operate' },
    buttons: [
      // 按钮定义
      /*{
        name: '查看详情',
        action: 'detailRecord'
      },
      {
        name: '编辑',
        action: 'editRecord'
      },*/
      {
        name: '删除', // 按钮名称
        action: 'deleteRecord' // 按钮操作，这个不可改
      }
    ]
      
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 2 Lake Park, London No. 2 Lake Park'
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park, Sidney No. 1 Lake Park'
  }
];
```

![image-20220315141928594](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220315141928594.png)

