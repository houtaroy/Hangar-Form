<template>
  <div>
    <div @click="selectTab(1)" :class="tab === '1' ? 'activity' : ''">tab1</div>
    <div @click="selectTab(2)" :class="tab === '2' ? 'activity' : ''">tab2</div>
    <!--        <h-forms-render ref="forms" :form-array="formArr" :activity-key.sync="tab" :form-data="value" />-->
    <!--    <div>
      <h-form ref="test" v-model="value" v-bind="json" @change="changeValue"></h-form>
    </div>-->
    <!--    <div v-show="tab === 2">
      <h-form ref="test1" v-model="value" v-bind="json1" @change="changeValue"></h-form>
    </div>-->
    {{ value }}
    <!--    <button @click="submit" class="test">提交</button>-->
    <button @click="submit1" class="test">提交1</button>
    <button @click="reset">重置</button>
    <button @click="jsonMethods">调用方法</button>
    <a-switch v-model="handleAdd" />添加 <a-switch v-model="handledisabele" />禁用
    <operate-total-count-table
      :columns="column"
      :handleAdd="handleAdd"
      :disabled="handledisabele"
      v-model="data"
      @validate="validate"
    />
    {{ data }}
    <autoPage :queryList="queryList" :col="col" />
    <!--    <a-modal title="Title" :visible="true">
      <h-form ref="test" v-model="value" v-bind="json"></h-form>
    </a-modal>-->
  </div>
</template>

<script>
import testConfig from '../../../public/test.json';
import testConfig1 from '../../../public/test1.json';
import { getFieldInfo } from '../../apis';
import HFormsRender from './components/h-forms-render';
import autoPage from "../../../packages/customeComponents/autoPage";

import OperateTotalCountTable from '../../../packages/customeComponents/operateTotalCountTable/index';

const column = [
  {
    title: '序号', // ant-table属性
    dataIndex: 'index', // ant-table属性
    key: 'index', // ant-table属性
    scopedSlots: { customRender: 'index' }, // ant-table属性，必填，render时需要
    type: 'index' // 排序列
  },
  {
    title: '姓名', // ant-table属性
    dataIndex: 'name', // ant-table属性
    key: 'name', // ant-table属性
    scopedSlots: { customRender: 'name' }, // ant-table属性，必填，render时需要
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
  }
];

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

export default {
  name: 'codePage',
  components: {
    // HFormsRender,
    'operate-total-count-table': OperateTotalCountTable,
    autoPage
  },
  data() {
    return {
      handleAdd: true,
      handledisabele: false,
      treeExpandedKeys: [],
      treeSelectData: undefined,
      form: {
        value: {}
      },
      value: {
        student: {
          table: []
        }
      },
      formArr: [
        {
          formId: '1',
          config: testConfig,
          extendConfigs: [],
          disabled: false
        },
        {
          formId: '2',
          config: testConfig1,
          extendConfigs: [],
          disabled: false
        }
      ],
      json: {
        formId: '1',
        config: testConfig,
        extendConfigs: [],
        disabled: false
      },
      json1: {
        formId: '2',
        config: testConfig1,
        extendConfigs: [],
        disabled: false
      },
      tab: '1',
      num: 1,
      column,
      data,
      name: '',
      age: 0,
      queryList: [
        {
          label: '姓名',
          model: 'name',
          type: 'input',
          placeholder: '请输入',
          isExtendSearch: false,
          sort: 1
        },
        {
          label: '姓名',
          model: 'name',
          type: 'input',
          placeholder: '请输入',
          isExtendSearch: false,
          sort: 2
        }
      ],
      col: {
        xl: 6,
        lg: 7,
        md: 8,
        sm: 24
      }
    }
  },
  methods: {
    submit() {
      this.$refs.test.submit((valid, data) => {
        console.log('验证', valid);
        console.log('数据', data);
      });
      console.log('原始数据', this.value);
    },
    submit1() {
      this.$refs.forms.submit((valid, data) => {
        console.log('验证', valid);
        console.log('数据', data);
      });
    },
    reset() {
      this.$refs.forms.resetFields();
    },
    changeValue(val) {
      console.log(val);
      Object.assign(this.value, val);
      this.$forceUpdate();
      if (this.num === 1) {
        this.value = { ...this.value };
      }
      this.num = this.num + 1;
    },
    selectTab(tab) {
      this.tab = tab.toString();
      // this.$refs.test1.getDefaultValue();
    },
    loadData() {
      // this.value = { ...this.value };
      this.value = {
        teacher: {
          name: '11',
          age: ''
        },
        student: {
          name: '11',
          age: '',
          table: data
        }
      };
      // this.$refs.test1.getDefaultValue();
      // this.$api.getFieldInfo().then(res => {
      //   this.value = res;
      // });
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    jsonMethods() {
      debugger;
      this.$refs.forms.$refs[`form-1`][0].outMethod1('student.name');
    },
    validate(validate, message) {
      console.log(validate, message);
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style>
.activity {
  background-color: red;
}
.form-group__message {
  display: none;
  font-size: 12px;
  color: #cc3333;
}
.form-group--error > input + .form-group__message {
  display: block;
  color: #cc3333;
}
.form-group--error input,
.form-group--error input:focus,
.form-group--error input:hover,
.form-group--error textarea {
  border-color: #cc3333;
}
</style>
