<template>
  <div class="properties-centent kk-checkbox">
    <div class="properties-body">
      <a-form>
        <a-form-item label="表单布局">
          <a-radio-group buttonStyle="solid" v-model="config.layout">
            <a-radio-button value="horizontal">水平</a-radio-button>
            <a-radio-button value="vertical">垂直</a-radio-button>
            <a-radio-button value="inline">行内</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="标签布局（水平布局生效）">
          <a-radio-group buttonStyle="solid" v-model="config.labelLayout">
            <a-radio-button value="flex">固定</a-radio-button>
            <a-radio-button value="Grid">栅格</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-show="config.labelLayout === 'flex'" label="标签宽度（px）">
          <a-input-number v-model="config.labelWidth" />
        </a-form-item>
        <a-form-item label="labelCol" v-show="config.labelLayout !== 'flex'">
          <div class="change-col-box">
            <a-slider
              id="test"
              :max="24"
              :min="0"
              v-model="config.labelCol.xs"
              @change="handleChangeCol"
            />
            <div>
              <label>xs:</label>
              <a-input-number v-model="config.labelCol.xs" />
            </div>
            <div>
              <label>sm:</label>
              <a-input-number v-model="config.labelCol.sm" />
            </div>
            <div>
              <label>md:</label>
              <a-input-number v-model="config.labelCol.md" />
            </div>
            <div>
              <label>lg:</label>
              <a-input-number v-model="config.labelCol.lg" />
            </div>
            <div>
              <label>xl:</label>
              <a-input-number v-model="config.labelCol.xl" />
            </div>
            <div>
              <label>xxl:</label>
              <a-input-number v-model="config.labelCol.xxl" />
            </div>
          </div>
        </a-form-item>
        <a-form-item label="wrapperCol" v-show="config.labelLayout !== 'flex'">
          <div class="change-col-box">
            <div>
              <label>xs:</label>
              <a-input-number v-model="config.wrapperCol.xs" />
            </div>
            <div>
              <label>sm:</label>
              <a-input-number v-model="config.wrapperCol.sm" />
            </div>
            <div>
              <label>md:</label>
              <a-input-number v-model="config.wrapperCol.md" />
            </div>
            <div>
              <label>lg:</label>
              <a-input-number v-model="config.wrapperCol.lg" />
            </div>
            <div>
              <label>xl:</label>
              <a-input-number v-model="config.wrapperCol.xl" />
            </div>
            <div>
              <label>xxl:</label>
              <a-input-number v-model="config.wrapperCol.xxl" />
            </div>
          </div>
        </a-form-item>
        <a-form-item label="预览模态框宽度">
          <a-input-number style="width: 100%" v-model="previewOptions.width" />
        </a-form-item>
        <a-form-item label="表单CSS">
          <a-textarea v-model="config.customStyle" />
        </a-form-item>
        <a-form-item label="表单属性">
          <kCheckbox v-model="config.hideRequiredMark" label="隐藏必选标记" />
        </a-form-item>
        <a-form-item label="生命周期">
          <a-button @click="lifecycleModalFlag = true" style="width: 100%">设置</a-button>
          <a-modal
            class="event-modal"
            v-model="lifecycleModalFlag"
            title="生命周期"
            @ok="lifecycleModalFlag = false"
            :maskClosable="false"
            :width="1200"
          >
            <h-form-list
              v-model="config.lifecycle"
              formComponent="h-lifecycle-form"
              labelKey="name"
              :addButton="false"
              :deleteButton="false"
            ></h-form-list>
          </a-modal>
        </a-form-item>
        <a-form-item label="方法">
          <a-button @click="methodModalFlag = true" style="width: 100%">设置</a-button>
          <a-modal
            class="event-modal"
            v-model="methodModalFlag"
            title="方法"
            @ok="methodModalFlag = false"
            :maskClosable="false"
            :width="1200"
          >
            <h-form-list
              v-model="config.methods"
              formComponent="h-method-form"
              labelKey="name"
              @add="handleMethodAdd"
            ></h-form-list>
          </a-modal>
        </a-form-item>
        <a-form-item label="提示"> 实际预览效果请点击预览查看 </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script>
/*
 * author kcz
 * date 2019-11-20
 * description 表单属性设置面板组件
 */
import kCheckbox from '../../KCheckbox/index.vue';
import HFormList from '../../HFormList';

export default {
  name: 'formProperties',
  components: {
    kCheckbox,
    HFormList
  },
  props: {
    config: {
      type: Object,
      required: true
    },
    previewOptions: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      methodModalFlag: false,
      lifecycleModalFlag: false
    };
  },
  methods: {
    handleMethodAdd() {
      this.config.methods.push({
        name: 'method_' + (this.config.methods.length + 1),
        arguments: '',
        body: ''
      });
    },
    handleChangeCol(e) {
      this.config.labelCol.xs = this.config.labelCol.sm = this.config.labelCol.md = this.config.labelCol.lg = this.config.labelCol.xl = this.config.labelCol.xxl = e;

      this.config.wrapperCol.xs = this.config.wrapperCol.sm = this.config.wrapperCol.md = this.config.wrapperCol.lg = this.config.wrapperCol.xl = this.config.wrapperCol.xxl =
        24 - e;
    }
  }
};
</script>
<style lang="less" scoped>
.change-col-box {
  > div {
    padding: 5px;
    display: flex;
    > label {
      text-align: right;
      padding-right: 8px;
      display: block;
      font-size: 16px;
      width: 45px;
    }
  }
}
.event-modal /deep/ .ant-modal-body {
  min-height: 500px;
}
</style>
