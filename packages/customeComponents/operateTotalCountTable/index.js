/**
 * 需要实现的功能有3个
 * 1.超长的数据带有tooltip，ellipsis和showTooltip同为true时生效
 * 2.默认生成操作，type: operateBtns时生效，按钮由btns数据生成。
 * 3.默认生成index，type: index时生效
 * 4.增加新增功能，新增的表单来源于column，需要配置canEdit为true，filedOptions为当前字段的配置项
 * 5.默认存在，修改，删除和查看详情的功能，这些功能绑定在页面，按照btns的事件操作
 */
import T from 'ant-design-vue/es/table/Table';
import TColumn from 'ant-design-vue/es/table/Column';
import { clone } from 'lodash';
import { Descriptions } from 'ant-design-vue';
import { DescriptionsItem } from 'ant-design-vue/es/descriptions';

import { DefaultFormJson } from '../../KFormDesign/config/defaultFromJson';
import EditCell from './components/editCell';

export default {
  name: 'HTable',
  model: {
    prop: 'dataSource',
    event: 'input'
  },
  components: {
    'a-descriptions': Descriptions,
    'a-descriptions-item': DescriptionsItem,
    'edit-cell': EditCell
  },
  data() {
    return {
      localDataSource: this.dataSource,
      localPagination: this.pagination,
      tableColumns: clone(TColumn.props),
      localColumns: this.columns,
      formJson: DefaultFormJson,
      editForm: {},
      modelVisible: false,
      detailModelVisible: false,
      detailList: [],
      editRowIndex: 1
    };
  },
  /*install: function(Vue) {
    Vue.component('h-table', this);
  },*/
  props: Object.assign({}, T.props, {
    pagination: {
      type: [Object, Boolean],
      default: false
    },
    disabled: {
      type: [String, Boolean],
      default: false
    },
    handleAdd: {
      type: Boolean,
      default: true
    }
  }),
  watch: {
    dataSource(val) {
      this.localDataSource = val;
    },
    pagination(val) {
      this.localPagination = val;
    },
    columns(val) {
      /*val.map(item => {
        Object.keys(item).map(key => {
          this.tableColumns[key] && (item[key] = this.tableColumns[key]);
        });
      })*/
      this.localColumns = val;
    }
  },
  computed: {
    modalTitle() {
      return typeof this.editForm.index !== 'undefined' ? '编辑' : '新增';
    }
  },
  methods: {
    renderColumn() {
      const scopedSlots = {};
      const _this = this;
      this.columns.forEach(item => {
        if (item.type === 'index') {
          scopedSlots[item.scopedSlots.customRender] = function(props, record, index) {
            return <span slot={item.scopedSlots.customRender}>{index + 1}</span>;
          };
        }
        if (item.ellipsis && item.showTooltip) {
          scopedSlots[item.scopedSlots.customRender] = function(props) {
            return (
              // props 就相当于 slot-scope="{title}" 里面的值
              <a-tooltip placement="topLeft" slot={item.scopedSlots.customRender} title={props}>
                {props}
              </a-tooltip>
            );
          };
        }
        if (item.type === 'operateBtns') {
          let operateBtns = item.buttons;
          if (_this.disabled) {
            operateBtns = item.buttons.filter(btn => {
              return btn.action !== 'editRecord' && btn.action !== 'deleteRecord';
            });
          }
          scopedSlots[item.scopedSlots.customRender] = function(props, record, index) {
            return (
              <p slot={item.scopedSlots.customRender}>
                {operateBtns.map((btn, idx) => (
                  <span>
                    <a
                      onClick={function() {
                        _this[btn.action](record, index);
                      }}>
                      {btn.name}
                    </a>
                    {idx < operateBtns.length - 1 ? <a-divider type="vertical" /> : null}
                  </span>
                ))}
              </p>
            );
          };
        }
      });
      return scopedSlots;
    },
    renderEditDialog() {
      let canEditFiled = [];
      const json = {
        formId: '1',
        extendConfigs: [],
        disabled: false
      };
      canEditFiled = this.columns.map(col => {
        return {
          ...col.filedOptions,
          dataId: 'editForm'
        };
      });
      json.config = Object.assign(this.formJson, { list: canEditFiled });
      return (
        <a-modal
          title={this.modalTitle}
          visible={this.modelVisible}
          onOk={this.modalOk}
          onCancel={() => {
            this.modelVisible = false;
          }}>
          <h-form ref="hForm" v-model={this.editForm} {...{ props: json }} />
        </a-modal>
      );
    },
    modalOk() {
      this.$refs.hForm.submit((valid, data) => {
        if (valid) {
          if (typeof this.editForm.index !== 'undefined') {
            this.localDataSource.splice(this.editForm.index, 1, data.editForm);
          } else {
            (this.localDataSource || []).push(data.editForm);
          }
          this.$emit('input', this.localDataSource);
          this.modelVisible = false;
        }
      });
    },
    addData() {
      /*this.modelVisible = true;
      this.editForm = {
        editForm: {}
      };*/
      const ItemKey = Object.keys(this.localDataSource);
      const Item = {};
      ItemKey.forEach(item => {
        Item[item] = '';
      });
      this.localDataSource.push(Item);
    },
    editRecord(record, index) {
      /*this.modelVisible = true;
      this.editForm = {
        editForm: record,
        index: index
      };*/
      this.editRowIndex = index;
    },
    deleteRecord(record, index) {
      this.$confirm({
        title: '确定删除这条数据吗',
        onOk: () => {
          this.localDataSource.splice(index, 1);
          this.$emit('input', this.localDataSource);
        },
        onCancel() {}
      });
    },
    renderDetailModal() {
      return (
        <a-modal
          title="查看详情"
          visible={this.detailModelVisible}
          onOk={() => {
            this.detailModelVisible = false;
          }}
          onCancel={() => {
            this.detailModelVisible = false;
          }}>
          <a-descriptions column={2}>
            {this.detailList.map(item => (
              <a-descriptions-item label={item.title}>{item.data}</a-descriptions-item>
            ))}
          </a-descriptions>
        </a-modal>
      );
    },
    detailRecord(record, index) {
      this.detailList = [];
      this.detailList = this.localColumns.filter(col => {
        return col.type !== 'index' && col.type !== 'operateBtns';
      });
      this.detailList = this.detailList.map(item => {
        return {
          title: item.title,
          dataIndex: item.dataIndex
        };
      });
      for (const recordElement in record) {
        this.detailList.forEach(item => {
          if (item.dataIndex === recordElement) {
            this.$set(item, 'data', record[recordElement]);
          }
        });
      }
      this.detailModelVisible = true;
    },
    renderEditCell() {
      const scopedSlots = {};
      const editCell = this.columns.filter(col => {
        return col.editable;
      });
      editCell.forEach(cell => {
        scopedSlots[cell.scopedSlots.customRender] = (props, record, index) => {
          return (
            <edit-cell
              slot={cell.scopedSlots.customRender}
              v-model={props}
              {...{ props: { ...cell.filedOptions, dataIndex: cell.dataIndex } }}
              on-input={val => {
                this.changeInputVal(val, cell.dataIndex, record, index);
              }}
              on-validate={(validateState, validateMessage) => {
                this.$emit('validate', validateState, { [cell.dataIndex]: validateMessage });
              }}
            />
          );
        };
      });
      return scopedSlots;
    },
    changeInputVal(val, dataIndex, record, index) {
      const newObj = {
        [dataIndex]: val
      };
      Object.assign(record, newObj);
      this.$emit('input', this.localDataSource);
    }
  },
  render() {
    const props = {};
    const localKeys = Object.keys(this.$data);
    Object.keys(T.props).forEach(k => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`;
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey];
        return props[k];
      }
      this[k] && (props[k] = this[k]);
      return props[k];
    });
    const table = (
      <a-table
        {...{
          props,
          scopedSlots: { ...this.$scopedSlots, ...this.renderColumn(), ...this.renderEditCell() }
        }}
        onChange={(pagination, filters, sorter, { currentDataSource }) => {
          this.$emit('change', pagination, filters, sorter, { currentDataSource });
        }}
        onExpand={(expanded, record) => {
          this.$emit('expand', expanded, record);
        }}>
        {Object.keys(this.$slots).map(name => (
          <template slot={name}>{this.$slots[name]}</template>
        ))}
      </a-table>
    );
    return (
      <div class={'default-table'}>
        {this.handleAdd && !this.disabled ? (
          <a-button on-click={this.addData} type="primary" icon="plus">添加</a-button>
        ) : null}
        {table}
        {this.modelVisible ? this.renderEditDialog() : null}
        {this.detailModelVisible ? this.renderDetailModal() : null}
      </div>
    );
  }
};
