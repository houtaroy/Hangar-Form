<template>
  <section>
    <a-row>
      <a-col :span="20" class="personnelPicker-box">
        <a-tag
          v-for="item in tagData"
          :key="item.key"
          :closable="!disabled"
          @close="remove(item)"
          >{{ item.title }}</a-tag
        >
      </a-col>
      <a-col :span="4">
        <a-button
          class="personnelPicker-button"
          :disabled="disabled"
          block
          @click="() => (this.visible = true)"
          >{{ describe }}</a-button
        >
      </a-col>
    </a-row>
    <a-modal
      v-model="visible"
      :width="800"
      :title="describe"
      :maskClosable="false"
      :keyboard="false"
    >
      <template slot="footer">
        <a-button @click="() => (this.visible = false)">关闭</a-button>
      </template>
      <a-spin :spinning="loading">
        <a-row>
          <a-col class="transfer-box" :span="10">
            <a-tree
              checkable
              blockNode
              showIcon
              v-model="checkedKeys"
              :load-data="onLoadData"
              :tree-data="treeData"
            >
              <template slot="organization" slot-scope="{ expanded }">
                <a-icon :type="expanded ? 'folder-open' : 'folder'" style="color: #DE9C00" />
              </template>
              <a-icon slot="department" type="apartment" style="color: #FF4905" />
              <a-icon slot="user" type="user" style="color: #10D269" />
            </a-tree>
          </a-col>
          <a-col class="transfer-button-group" :span="4">
            <a-button @click="addPersonnel">&gt;添加</a-button>
            <a-button @click="removePersonnel">&lt;移走</a-button>
          </a-col>
          <a-col class="transfer-box" :span="10">
            <a-checkbox-group v-model="result">
              <a-checkbox
                class="transfer-box-checkbox"
                v-for="item in tagData"
                :key="item.key"
                :value="item.key"
              >
                {{ item.title }}
              </a-checkbox>
            </a-checkbox-group>
          </a-col>
        </a-row>
      </a-spin>
    </a-modal>
  </section>
</template>

<script>
import { findIndex } from 'lodash';
export default {
  name: 'HPersonnelPicker',
  components: {},
  props: {
    value: {
      type: String,
      required: false,
      default: ''
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    describe: {
      type: String,
      required: false,
      default: '人员选择'
    },
    isMulti: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      tagData: [],
      checkedKeys: [],
      treeData: [],
      dataSource: [],
      result: []
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          const result = [];
          const users = JSON.parse(val);
          users.forEach(user => {
            result.push({
              key: user.id,
              title: user.name
            });
          });
          this.tagData = result;
        }
      },
      immediate: true
    },
    tagData: {
      handler(val) {
        const userKey = [];
        const result = [];
        val.forEach(user => {
          userKey.push(user.key);
          result.push({
            name: user.title,
            id: user.key
          });
        });
        this.handleTreeData(this.treeData, userKey);
        this.$emit('input', JSON.stringify(result));
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    /**
     * @method 更新人员树后触发的事件
     * @desc 将人员树展平处理
     * @param {Array} list 需要处理的人员树
     */
    flatten(list = []) {
      list.forEach(item => {
        this.dataSource.push(item);
        this.flatten(item.children);
      });
    },
    /**
     * @desc 处理左侧树子节点禁用的方法
     * @param {Array} data 左侧人员树的数据
     * @param {Array} targetKeys 右侧选中人员的key
     * @return data Array 处理完成后的结果
     */
    handleTreeData(data, targetKeys = []) {
      data.forEach(item => {
        item['disabled'] = targetKeys.includes(item.key);
        if (item.children) {
          let isDisable = false;
          for (let i = 0; i < item.children.length; i++) {
            isDisable = targetKeys.includes(item.children[i].key);
          }
          item['disabled'] = isDisable;
        }
        if (item.children) {
          this.handleTreeData(item.children, targetKeys);
        }
      });
      return data;
    },
    /**
     * @desc 删除Tag标签后的方法
     * @param {Object} entity 当前删除的人员实体信息
     * @return 无返回
     */
    remove(entity) {
      const originData = this.tagData;
      const result = [];
      originData.forEach(item => {
        if (item.key !== entity.key) {
          result.push(item);
        }
      });
      this.tagData = result;
    },
    /**
     * @desc 初始化页面后加载人员树根节点的方法
     * @return 无返回
     */
    loadTreeData() {
      this.loading = true;
      this.$api
        .listOrgDeptUsers({ searchParentId: null })
        .then(res => {
          const data = res.data.map(i => {
            return {
              ...i,
              scopedSlots: { icon: i.type }
            };
          });
          this.treeData = data;
          this.dataSource = [];
          this.flatten(JSON.parse(JSON.stringify(this.treeData)));
        })
        .catch(e => {})
        .finally(() => {
          this.loading = false;
        });
    },
    /**
     * @method 展开树节点后的事件
     * @desc tree上的懒加载事件
     * @param {Object} treeNode 当前选中节点的对象
     */
    onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        this.$api.listOrgDeptUsers({ searchParentId: treeNode.dataRef.key }).then(resp => {
          if (resp.data && resp.data.length > 0) {
            const data = resp.data.map(i => {
              return {
                ...i,
                scopedSlots: { icon: i.type }
              };
            });
            treeNode.dataRef.children = data;
            this.treeData = [...this.treeData];
          } else {
            treeNode.dataRef.isLeaf = true;
            this.treeData = [...this.treeData];
          }
          this.dataSource = [];
          this.flatten(JSON.parse(JSON.stringify(this.treeData)));
          const userKey = [];
          this.tagData.forEach(user => {
            userKey.push(user.key);
          });
          this.handleTreeData(this.treeData, userKey);
          resolve();
        });
      });
    },
    /**
     * @desc 将人员添加到右侧列表的方法
     * @return 无返回
     */
    addPersonnel() {
      if (!this.checkedKeys.length) {
        return;
      }
      const result = [];
      this.checkedKeys.forEach(userKey => {
        const dataItem = this.dataSource.find(i => i.key === userKey && i.isLeaf);
        if (dataItem) {
          result.push(dataItem);
        }
      });
      if (this.tagData.length + result.length > 1 && !this.isMulti) {
        return this.$message.info('最多选择1人');
      }
      this.tagData = this.tagData.concat(JSON.parse(JSON.stringify(result)));
      this.checkedKeys = [];
    },
    /**
     * @desc 移除右侧人员的方法
     * @return 无返回
     */
    removePersonnel() {
      if (!this.result.length) {
        return;
      }
      const result = [];
      this.tagData.forEach(user => {
        if (findIndex(this.result, key => key === user.key) === -1) {
          result.push(user);
        }
      });
      this.tagData = JSON.parse(JSON.stringify(result));
      this.result = [];
    }
  },
  mounted() {
    this.loadTreeData();
  }
};
</script>

<style scoped>
.spin-content {
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
  padding: 30px;
}
.personnelPicker-box {
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-top-width: 1.02px;
  border-radius: 2px;
  outline: none;
  min-height: 32px;
  padding: 4px;
}
.personnelPicker-button {
  position: absolute;
  right: 0;
  top: 0;
}
.transfer-box {
  border: 1px solid #d9d9d9;
  height: 400px;
  padding: 20px;
  overflow: auto;
}
.transfer-button-group {
  text-align: center;
}

.transfer-box-checkbox {
  display: block;
  margin: 0 0 8px 0 !important;
}
</style>
