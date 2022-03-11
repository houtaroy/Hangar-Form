<template>
  <div class="properties-centent kk-checkbox">
    <div class="properties-body">
      <a-empty class="hint-box" v-show="selectItem.key === ''" description="未选择控件" />

      <a-form v-show="selectItem.key !== ''">
        <a-form-item v-if="selectItem.hasOwnProperty('key')" label="标识">
          {{ selectItem.key }}
        </a-form-item>
        <a-form-item v-if="typeof selectItem.label !== 'undefined'" label="标签">
          <a-input v-model="selectItem.label" placeholder="请输入" />
        </a-form-item>
        <a-form-item
          v-if="!hideModel && typeof selectItem.dataId !== 'undefined'"
          label="数据库表名称"
        >
          <a-select
            v-model="selectItem.dataId"
            style="width: 100%"
            @change="handleTableChange"
            placeholder="请选择"
          >
            <a-select-option v-for="table in tableList" :key="table.id" :value="table.tableName">
              {{ table.tableName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="!hideModel && typeof selectItem.dataProp !== 'undefined'"
          label="数据库表字段"
        >
          <a-select v-model="selectItem.dataProp" style="width: 100%" placeholder="请选择">
            <template v-if="loadingColumn" slot="notFoundContent">
              <div style="text-align: center">
                <a-spin size="small" />
                <p>加载中</p>
              </div>
            </template>
            <a-select-option
              v-for="col in columnNameMap.get(selectItem.dataId)"
              :key="col.id"
              :value="col.name"
            >
              {{ col.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <!-- input type start -->
        <a-form-item v-if="selectItem.type === 'input'" label="输入框type">
          <a-input v-model="options.type" placeholder="请输入" />
        </a-form-item>
        <!-- input type end -->
        <a-form-item
          v-if="typeof options.rangePlaceholder !== 'undefined' && options.range"
          label="占位内容"
        >
          <a-input placeholder="请输入" v-model="options.rangePlaceholder[0]" />
          <a-input placeholder="请输入" v-model="options.rangePlaceholder[1]" />
        </a-form-item>

        <a-form-item v-else-if="typeof options.placeholder !== 'undefined'" label="占位内容">
          <a-input placeholder="请输入" v-model="options.placeholder" />
        </a-form-item>
        <a-form-item
          v-if="selectItem.type === 'textarea' || selectItem.type === 'hCommentOptions'"
          label="自适应内容高度"
        >
          <a-input-number
            style="width: 100%"
            v-model="options.autoSize.minRows"
            placeholder="最小高度"
          />
          <a-input-number
            style="width: 100%"
            v-model="options.autoSize.maxRows"
            placeholder="最大高度"
          />
        </a-form-item>
        <a-form-item v-if="typeof options.width !== 'undefined'" label="宽度">
          <a-input placeholder="请输入" v-model="options.width" />
        </a-form-item>
        <a-form-item v-if="typeof options.height !== 'undefined'" label="高度">
          <a-input-number v-model="options.height" />
        </a-form-item>
        <a-form-item v-if="typeof options.step !== 'undefined'" label="步长">
          <a-input-number v-model="options.step" placeholder="请输入" />
        </a-form-item>
        <a-form-item v-if="typeof options.min !== 'undefined'" label="最小值">
          <a-input-number v-model="options.min" placeholder="请输入" />
        </a-form-item>
        <a-form-item v-if="typeof options.max !== 'undefined'" label="最大值">
          <a-input-number v-model="options.max" placeholder="请输入" />
        </a-form-item>
        <a-form-item v-if="typeof options.maxLength !== 'undefined'" label="最大长度">
          <a-input-number v-model="options.maxLength" placeholder="请输入" />
        </a-form-item>
        <a-form-item v-if="typeof options.tabBarGutter !== 'undefined'" label="标签间距">
          <a-input-number v-model="options.tabBarGutter" placeholder="请输入" />
        </a-form-item>
        <a-form-item v-if="typeof options.precision !== 'undefined'" label="数值精度">
          <a-input-number :min="0" :max="50" v-model="options.precision" placeholder="请输入" />
        </a-form-item>
        <a-form-item v-if="typeof options.dictCode !== 'undefined'" label="dictCode">
          <a-input v-model="options.dictCode"></a-input>
        </a-form-item>
        <!-- 选项配置及动态数据配置 start -->
        <a-form-item
          v-if="
            typeof options.options !== 'undefined' ||
              typeof options.treeData !== 'undefined' ||
              typeof options.listData !== 'undefined'
          "
          :label="typeof options.listData !== 'undefined' ? '列表数据' : '选项配置'"
        >
          <a-radio-group buttonStyle="solid" v-model="selectItem.optionsConfig.type" size="small">
            <a-radio-button value="static">静态数据</a-radio-button>
            <a-radio-button value="dynamic">动态数据</a-radio-button>
            <a-radio-button value="dictionary">字典</a-radio-button>
            <a-radio-button value="enum">枚举</a-radio-button>
          </a-radio-group>

          <a-input
            v-show="selectItem.optionsConfig.type === 'dynamic'"
            v-model="selectItem.optionsConfig.name"
            placeholder="动态数据变量名"
          ></a-input>

          <a-input
            v-show="selectItem.optionsConfig.type === 'dictionary'"
            v-model="selectItem.optionsConfig.name"
            placeholder="字典变量名"
          ></a-input>

          <a-input
            v-show="selectItem.optionsConfig.type === 'enum'"
            v-model="selectItem.optionsConfig.name"
            placeholder="枚举变量名"
          ></a-input>

          <!--          <KChangeOption
            v-if="typeof options.options !== 'undefined' && selectItem.type !== 'cascader'"
            v-show="selectItem.optionsConfig.type === 'static'"
            v-model="options.options"
          />-->
          <a
            v-if="
              typeof options.treeData !== 'undefined' ||
                typeof options.options !== 'undefined' ||
                typeof options.listData !== 'undefined'
            "
            v-show="selectItem.optionsConfig.type === 'static'"
            @click="staticEditModalVisible = true"
            >添加静态数据</a
          >

          <a-modal
            v-model="staticEditModalVisible"
            title="静态数据JSON"
            @ok="staticEditModalVisible = false"
            :maskClosable="false"
            :width="1200"
          >
            <h-ace-editor v-model="aceEditorValue" />
          </a-modal>
          <!--<KChangeOption
            v-if="typeof options.treeData !== 'undefined'"
            v-show="selectItem.optionsConfig.type === 'static'"
            v-model="options.treeData"
          />-->
        </a-form-item>
        <!-- 选项配置及动态数据配置 end -->
        <!-- tabs配置 start -->
        <a-form-item
          v-if="['tabs', 'selectInputList'].includes(selectItem.type)"
          :label="selectItem.type === 'tabs' ? '页签配置' : '列选项配置'"
        >
          <KChangeOption v-model="selectItem.columns" type="tab" />
        </a-form-item>
        <!-- tabs配置 end -->
        <a-form-item v-if="selectItem.type === 'grid'" label="栅格间距">
          <a-input-number v-model="selectItem.options.gutter" placeholder="请输入" />
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'grid'" label="列配置项">
          <KChangeOption v-model="selectItem.columns" type="colspan" />
        </a-form-item>

        <a-form-item v-if="selectItem.type === 'switch'" label="默认值">
          <a-switch v-model="options.defaultValue" />
        </a-form-item>
        <a-form-item v-if="['number', 'slider'].indexOf(selectItem.type) >= 0" label="默认值">
          <a-input-number
            :step="options.step"
            :min="options.min || -Infinity"
            :max="options.max || Infinity"
            v-model="options.defaultValue"
          />
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'rate'" label="默认值">
          <a-rate
            v-model="options.defaultValue"
            :allowHalf="options.allowHalf"
            :count="options.max"
          />
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'select'" label="默认值">
          <a-select :options="options.options" v-model="options.defaultValue" />
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'radio'" label="默认值">
          <a-radio-group :options="options.options" v-model="options.defaultValue" />
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'checkbox'" label="默认值">
          <a-checkbox-group :options="options.options" v-model="options.defaultValue" />
        </a-form-item>
        <!-- 日期选择器默认值 start -->
        <a-form-item v-if="selectItem.type === 'date'" label="默认值">
          <a-input
            v-if="!options.range"
            v-model="options.defaultValue"
            :placeholder="typeof options.format === 'undefined' ? '' : options.format"
          />
          <a-input
            v-if="options.range"
            v-model="options.rangeDefaultValue[0]"
            :placeholder="typeof options.format === 'undefined' ? '' : options.format"
          />
          <a-input
            v-if="options.range"
            v-model="options.rangeDefaultValue[1]"
            :placeholder="typeof options.format === 'undefined' ? '' : options.format"
          />
        </a-form-item>
        <!-- 日期选择器默认值 start -->
        <a-form-item
          v-if="
            ![
              'number',
              'radio',
              'checkbox',
              'date',
              'rate',
              'select',
              'switch',
              'slider',
              'html'
            ].includes(selectItem.type) && typeof options.defaultValue !== 'undefined'
          "
          label="默认值"
        >
          <a-input
            v-model="options.defaultValue"
            :placeholder="typeof options.format === 'undefined' ? '请输入' : options.format"
          />
        </a-form-item>
        <!-- 修改html -->
        <a-form-item v-if="selectItem.type === 'html'" label="默认值">
          <a-textarea v-model="options.defaultValue" :autoSize="{ minRows: 4, maxRows: 8 }" />
        </a-form-item>
        <a-form-item v-if="typeof options.format !== 'undefined'" label="时间格式">
          <a-input v-model="options.format" placeholder="时间格式如：YYYY-MM-DD HH:mm:ss" />
        </a-form-item>

        <a-form-item v-if="typeof options.orientation !== 'undefined'" label="标签位置">
          <a-radio-group buttonStyle="solid" v-model="options.orientation">
            <a-radio-button value="left">左</a-radio-button>
            <a-radio-button value="">居中</a-radio-button>
            <a-radio-button value="right">右</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <!-- 页签位置 start -->
        <a-form-item v-if="selectItem.type === 'tabs'" label="页签位置">
          <a-radio-group buttonStyle="solid" v-model="options.tabPosition">
            <a-radio value="top">top</a-radio>
            <a-radio value="right">right</a-radio>
            <a-radio value="bottom">bottom</a-radio>
            <a-radio value="left">left</a-radio>
          </a-radio-group>
        </a-form-item>
        <!-- 页签位置 end -->
        <!-- 页签类型 start -->
        <a-form-item v-if="selectItem.type === 'tabs'" label="页签类型">
          <a-radio-group buttonStyle="solid" v-model="options.type">
            <a-radio-button value="line">line</a-radio-button>
            <a-radio-button value="card">card</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <!-- 页签类型 end -->
        <!-- 页签大小 start -->
        <a-form-item v-if="typeof options.size !== 'undefined'" label="大小">
          <a-radio-group buttonStyle="solid" v-model="options.size">
            <a-radio-button value="large">large</a-radio-button>
            <a-radio-button value="default">default</a-radio-button>
            <a-radio-button value="small">small</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <!-- 页签大小 end -->
        <a-form-item v-if="selectItem.type === 'button'" label="类型">
          <a-radio-group buttonStyle="solid" v-model="options.type">
            <a-radio value="primary">Primary</a-radio>
            <a-radio value="default">Default</a-radio>
            <a-radio value="dashed">Dashed</a-radio>
            <a-radio value="danger">Danger</a-radio>
          </a-radio-group>
        </a-form-item>
        <!-- 下载方式 start -->
        <a-form-item v-if="typeof options.downloadWay !== 'undefined'" label="下载方式">
          <a-radio-group buttonStyle="solid" v-model="options.downloadWay">
            <a-radio-button value="a">a标签</a-radio-button>
            <a-radio-button value="ajax">ajax</a-radio-button>
            <a-radio-button value="dynamic">动态函数</a-radio-button>
          </a-radio-group>
          <a-input
            v-show="options.downloadWay === 'dynamic'"
            v-model="options.dynamicFun"
            placeholder="动态函数名"
          ></a-input>
        </a-form-item>
        <!-- 下载方式 end -->
        <a-form-item v-if="selectItem.type === 'button'" label="按钮操作">
          <a-radio-group buttonStyle="solid" v-model="options.handle">
            <a-radio-button value="submit">提交</a-radio-button>
            <a-radio-button value="reset">重置</a-radio-button>
            <a-radio-button value="dynamic">动态函数</a-radio-button>
          </a-radio-group>
          <a-input
            v-show="options.handle === 'dynamic'"
            v-model="options.dynamicFun"
            placeholder="动态函数名"
          ></a-input>
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'alert'" label="辅助描述">
          <a-input v-model="options.description"></a-input>
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'alert'" label="类型">
          <a-radio-group buttonStyle="solid" v-model="options.type">
            <a-radio value="success">success</a-radio>
            <a-radio value="info">info</a-radio>
            <a-radio value="warning">warning</a-radio>
            <a-radio value="error">error</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'alert'" label="操作属性">
          <kCheckbox v-model="options.showIcon" label="显示图标" />
          <kCheckbox v-model="options.banner" label="无边框" />
          <kCheckbox v-model="options.closable" label="可关闭" />
        </a-form-item>
        <!-- 上传图片 -->
        <a-form-item v-if="selectItem.type === 'uploadImg'" label="样式">
          <a-radio-group buttonStyle="solid" v-model="options.listType">
            <a-radio-button value="text">text</a-radio-button>
            <a-radio-button value="picture">picture</a-radio-button>
            <a-radio-button value="picture-card">card</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <!-- 上传数量 -->
        <a-form-item v-if="typeof options.limit !== 'undefined'" label="最大上传数量">
          <a-input-number :min="1" v-model="options.limit" />
        </a-form-item>

        <!-- scrollY -->
        <a-form-item v-if="typeof options.scrollY !== 'undefined'" label="scrollY">
          <a-input-number :min="0" v-model="options.scrollY" />
        </a-form-item>

        <!-- 上传地址 -->
        <a-form-item v-if="typeof options.action !== 'undefined'" label="上传地址">
          <a-input v-model="options.action" placeholder="请输入"></a-input>
        </a-form-item>

        <!-- 文件name -->
        <a-form-item v-if="typeof options.fileName !== 'undefined'" label="文件name">
          <a-input v-model="options.fileName" placeholder="请输入"></a-input>
        </a-form-item>
        <!-- 上传额外参数 -->
        <a-form-item v-if="typeof options.data !== 'undefined'" label="额外参数（JSON格式）">
          <a-textarea v-model="options.data" placeholder="严格JSON格式"></a-textarea>
        </a-form-item>

        <!-- 自定义上传的 -->
        <a-form-item v-if="typeof options.text !== 'undefined'" label="文件标题">
          <a-input v-model="options.text" placeholder="请输入"></a-input>
        </a-form-item>

        <a-form-item v-if="typeof options.uploadOptions !== 'undefined'" label="上传地址配置">
          <a-input
            v-model="options.uploadOptions.target"
            placeholder="/api/fileInfos/chunk"
          ></a-input>
        </a-form-item>

        <!--上传请求头配置-->
        <!--<a-form-item v-if="typeof options.uploadOptions !== 'undefined'" label="上传请求头配置">
          <a-input v-model="options.uploadOptions.target" placeholder="/api/fileInfos/chunk"></a-input>
          <kCheckbox
            v-model="options.uploadOptions.singleFile"
            label="singleFile"
          />
          <a-input v-model="options.uploadOptions.headers.Authorization" placeholder="headers.Authorization"></a-input>
        </a-form-item>
        &lt;!&ndash;下载路径配置&ndash;&gt;
        <a-form-item v-if="typeof options.downloadUrl !== 'undefined'" label="下载路径配置">
          <a-input v-model="options.downloadUrl" placeholder="请输入"></a-input>
        </a-form-item>
        &lt;!&ndash;查看pdf路径配置&ndash;&gt;
        <a-form-item v-if="typeof options.openPdfUrl !== 'undefined'" label="查看pdf路径配置">
          <a-input v-model="options.openPdfUrl" placeholder="请输入"></a-input>
        </a-form-item>
        &lt;!&ndash;合并文件路径配置&ndash;&gt;
        <a-form-item v-if="typeof options.uploadMergeFileUrl !== 'undefined'" label="合并文件路径配置">
          <a-input v-model="options.uploadMergeFileUrl" placeholder="请输入"></a-input>
        </a-form-item>-->

        <!--上传文件类型配置-->
        <a-form-item v-if="typeof options.attrs !== 'undefined'" label="文件上传类型">
          <a-input v-model="options.attrs.accept" placeholder=".ppt或者.img，用逗号分隔"></a-input>
        </a-form-item>
        <!--上传文件个数配置-->
        <a-form-item v-if="typeof options.fileNumber !== 'undefined'" label="文件上传个数">
          <a-input-number v-model="options.fileNumber" placeholder="请输入" />
        </a-form-item>

        <!-- 自定义常用意见-->
        <a-form-item v-if="selectItem.type === 'hCommentOptions'" label="默认值">
          <a-input v-model="options.defaultValue" />
        </a-form-item>

        <!-- 人员选择插件 -->
        <a-form-item v-if="typeof options.describe !== 'undefined'" label="按钮文字">
          <a-input v-model="options.describe" />
        </a-form-item>
        <a-form-item v-if="typeof options.isMulti !== 'undefined'" label="属性">
          <kCheckbox v-model="options.isMulti" style="width: 100%" label="是否支持多选" />
        </a-form-item>

        <!-- 意见查看 -->
        <a-form-item v-if="typeof options.taskDefKey !== 'undefined'" label="流程节点ID">
          <a-input v-model="options.taskDefKey" placeholder="支持填入多个（用英文逗号分隔）" />
        </a-form-item>
        <a-form-item v-if="typeof options.fontSize !== 'undefined'" label="字体大小">
          <a-input v-model="options.fontSize" />
        </a-form-item>
        <a-form-item v-if="typeof options.fontColor !== 'undefined'" label="字体颜色">
          <a-input v-model="options.fontColor" />
        </a-form-item>
        <a-form-item v-if="typeof options.borderStyle !== 'undefined'" label="边框样式">
          <a-input v-model="options.borderStyle" />
        </a-form-item>
        <a-form-item v-if="typeof options.isOpinionShow !== 'undefined'" label="意见">
          <kCheckbox v-model="options.isOpinionShow" style="width: 100%" label="是否显示意见" />
        </a-form-item>
        <a-form-item v-if="typeof options.isAuthorShow !== 'undefined'" label="人员">
          <kCheckbox v-model="options.isAuthorShow" style="width: 100%" label="是否显示人员" />
        </a-form-item>
        <a-form-item v-if="typeof options.isDateShow !== 'undefined'" label="日期">
          <kCheckbox v-model="options.isDateShow" style="width: 100%" label="是否显示日期" />
        </a-form-item>
        <!--        <a-form-item v-if="typeof options.listData !== 'undefined'" label="列表数据">
          <a-radio-group buttonStyle="solid" v-model="options.dynamic">
            <a-radio-button :value="false">静态数据</a-radio-button>
            <a-radio-button :value="true">动态数据</a-radio-button>
          </a-radio-group>

          <a-input
            v-show="options.dynamic"
            v-model="options.dynamicKey"
            placeholder="动态数据变量名"
          ></a-input>

          <KChangeOption v-show="!options.dynamic" v-model="options.listData" />
        </a-form-item>-->

        <!-- 文字对齐方式 -->
        <a-form-item v-if="selectItem.type === 'text'" label="文字对齐方式">
          <a-radio-group buttonStyle="solid" v-model="options.textAlign">
            <a-radio-button value="left">左</a-radio-button>
            <a-radio-button value="center">居中</a-radio-button>
            <a-radio-button value="right">右</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <!-- 文字字体 -->
        <a-form-item v-if="selectItem.type === 'text'" label="字体属性设置">
          <colorPicker v-model="options.color" />
          <a-select
            :options="familyOptions"
            v-model="options.fontFamily"
            style="width: 36%; margin-left: 2%; vertical-align: bottom"
          />
          <a-select
            :options="sizeOptions"
            v-model="options.fontSize"
            style="width: 35%; margin-left: 2%; vertical-align: bottom"
          />
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'text'" label="操作属性">
          <kCheckbox v-model="options.showRequiredMark" label="显示必选标记" />
        </a-form-item>

        <a-form-item
          v-if="
            typeof options.hidden !== 'undefined' ||
              typeof options.disabled !== 'undefined' ||
              typeof options.readonly !== 'undefined' ||
              typeof options.allowClear !== 'undefined' ||
              typeof options.multiple !== 'undefined' ||
              typeof options.range !== 'undefined' ||
              typeof options.showTime !== 'undefined' ||
              typeof options.allowHalf !== 'undefined' ||
              typeof options.showInput !== 'undefined' ||
              typeof options.animated !== 'undefined'
          "
          label="操作属性"
        >
          <kCheckbox
            v-if="typeof options.hidden !== 'undefined'"
            v-model="options.hidden"
            label="隐藏"
          />
          <kCheckbox
            v-if="typeof options.disabled !== 'undefined'"
            v-model="options.disabled"
            label="禁用"
          />
          <kCheckbox
            v-if="typeof options.readonly !== 'undefined'"
            v-model="options.readonly"
            label="只读"
          />
          <kCheckbox
            v-if="typeof options.allowClear !== 'undefined'"
            v-model="options.allowClear"
            label="可清除"
          />
          <kCheckbox
            v-if="typeof options.multiple !== 'undefined'"
            v-model="options.multiple"
            label="多选"
          />
          <kCheckbox
            v-if="typeof options.range !== 'undefined'"
            v-model="options.range"
            label="范围选择"
          />
          <kCheckbox
            v-if="typeof options.showTime !== 'undefined'"
            v-model="options.showTime"
            label="时间选择器"
          />
          <kCheckbox
            v-if="typeof options.allowHalf !== 'undefined'"
            v-model="options.allowHalf"
            label="允许半选"
          />
          <kCheckbox
            v-if="typeof options.showInput !== 'undefined'"
            v-model="options.showInput"
            label="显示输入框"
          />
          <kCheckbox
            v-if="typeof options.showLabel !== 'undefined'"
            v-model="options.showLabel"
            label="显示Label"
          />
          <kCheckbox
            v-if="typeof options.chinesization !== 'undefined'"
            v-model="options.chinesization"
            label="汉化"
          />
          <kCheckbox
            v-if="typeof options.hideSequence !== 'undefined'"
            v-model="options.hideSequence"
            label="隐藏序号"
          />
          <kCheckbox
            v-if="typeof options.drag !== 'undefined'"
            v-model="options.drag"
            label="允许拖拽"
          />
          <kCheckbox
            v-if="typeof options.showSearch !== 'undefined'"
            v-model="options.showSearch"
            label="可搜索"
          />
          <kCheckbox
            v-if="typeof options.treeCheckable !== 'undefined'"
            v-model="options.treeCheckable"
            label="可勾选"
          />
          <kCheckbox
            v-if="typeof options.animated !== 'undefined'"
            v-model="options.animated"
            label="动画切换"
          />
        </a-form-item>

        <a-form-item
          v-if="typeof selectItem.rules !== 'undefined' && selectItem.rules.length > 0"
          label="校验"
        >
          <kCheckbox v-model="selectItem.rules[0].required" label="必填" style="width: 100%" />
          <a-input
            v-show="selectItem.rules[0].required"
            v-model="selectItem.rules[0].message"
            placeholder="必填校验提示信息"
          />
          <KChangeOption v-model="selectItem.rules" type="rules" />
        </a-form-item>

        <!-- 表格选项 -->
        <a-form-item v-if="selectItem.type === 'table'" label="表格样式CSS">
          <a-input v-model="selectItem.options.customStyle" />
        </a-form-item>
        <a-form-item v-if="selectItem.type === 'table'" label="属性">
          <kCheckbox v-model="selectItem.options.bordered" label="显示边框" />
          <kCheckbox v-model="selectItem.options.bright" label="鼠标经过点亮" />
          <kCheckbox v-model="selectItem.options.small" label="紧凑型" />
        </a-form-item>

        <a-form-item v-if="selectItem.type === 'table'" label="提示">
          <p style="line-height: 26px">请点击右键增加行列，或者合并单元格</p>
        </a-form-item>

        <a-form-item v-if="typeof selectItem.help !== 'undefined'" label="帮助信息">
          <a-input v-model="selectItem.help" placeholder="请输入" />
        </a-form-item>

        <!-- 前缀 -->
        <a-form-item label="前缀" v-if="typeof options.addonBefore !== 'undefined'">
          <a-input v-model="options.addonBefore" placeholder="请输入" />
        </a-form-item>

        <!-- 后缀 -->
        <a-form-item label="后缀" v-if="typeof options.addonAfter !== 'undefined'">
          <a-input v-model="options.addonAfter" placeholder="请输入" />
        </a-form-item>

        <!--class选择-->
        <a-form-item label="类名" v-if="typeof selectItem.class !== 'undefined'">
          <a-input v-model="selectItem.class" placeholder="请输入" />
        </a-form-item>

        <!--style-->
        <a-form-item label="控件CSS" v-if="typeof selectItem.style !== 'undefined'">
          <a-textarea v-model="selectItem.style" placeholder="请输入" :auto-size="{ minRows: 2 }" />
        </a-form-item>

        <!--自定义事件-->
        <a-form-item v-if="selectItem.hasOwnProperty('events')" label="事件">
          <a-button @click="eventModalFlag = true" style="width: 100%">设置</a-button>
          <a-modal
            class="event-modal"
            v-model="eventModalFlag"
            title="方法"
            @cancel="methodModalHandleClosed"
            :maskClosable="false"
            :width="1200"
            :footer="null"
          >
            <h-form-list
              v-model="selectItem.events"
              formComponent="h-event-form"
              :formOptions="{ methods: formMethods }"
              labelKey="name"
              @add="handleEventAdd"
              ref="hFormList"
            ></h-form-list>
          </a-modal>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script>
/*
 * author kcz
 * date 2019-11-20
 * description 表单控件属性设置组件,因为配置数据是引用关系，所以可以直接修改
 */
import KChangeOption from '../../KChangeOption/index.vue';
import kCheckbox from '../../KCheckbox/index.vue';
import HFormList from '../../HFormList';

export default {
  name: 'formItemProperties',
  data() {
    return {
      familyOptions: [
        // 字体选择设置
        {
          value: 'SimSun',
          label: '宋体'
        },
        {
          value: 'FangSong',
          label: '仿宋'
        },
        {
          value: 'SimHei',
          label: '黑体'
        },
        {
          value: 'PingFangSC-Regular',
          label: '苹方'
        },
        {
          value: 'KaiTi',
          label: '楷体'
        },
        {
          value: 'LiSu',
          label: '隶书'
        }
      ],
      sizeOptions: [
        //字号选择设置
        {
          value: '26pt',
          label: '一号'
        },
        {
          value: '24pt',
          label: '小一'
        },
        {
          value: '22pt',
          label: '二号'
        },
        {
          value: '18pt',
          label: '小二'
        },
        {
          value: '16pt',
          label: '三号'
        },
        {
          value: '15pt',
          label: '小三'
        },
        {
          value: '14pt',
          label: '四号'
        },
        {
          value: '12pt',
          label: '小四'
        },
        {
          value: '10.5pt',
          label: '五号'
        },
        {
          value: '9pt',
          label: '小五'
        }
      ],
      eventModalFlag: false,
      staticEditModalVisible: false,
      tableList: [],
      columnNameMap: new Map(),
      loadingColumn: false
    };
  },
  computed: {
    options() {
      return this.selectItem.options || {};
    },
    aceEditorValue: {
      get() {
        return (
          this.selectItem.options.options ||
          this.selectItem.options.treeData ||
          this.selectItem.options.listData ||
          []
        );
      },
      set(val) {
        if (this.selectItem.options.options) {
          this.selectItem.options.options = val;
        }
        if (this.selectItem.options.treeData) {
          this.selectItem.options.treeData = val;
        }
        if (this.selectItem.options.listData) {
          this.selectItem.options.listData = val;
        }
      }
    }
  },
  props: {
    selectItem: {
      type: Object,
      required: true
    },
    formMethods: {
      type: Array,
      default: function() {
        return [];
      }
    },
    hideModel: {
      type: Boolean,
      default: false
    },
    formDefinitionId: {
      type: String,
      default: '',
      required: true
    }
  },
  components: {
    KChangeOption,
    kCheckbox,
    HFormList
  },
  methods: {
    handleEventAdd() {
      this.selectItem.events.push(
        Object.assign({
          name: 'event_' + (this.selectItem.events.length + 1),
          type: 'select',
          methodName: '',
          method: {
            name: '',
            arguments: '',
            body: ''
          }
        })
      );
    },
    methodModalHandleClosed() {
      this.eventModalFlag = false;
      this.$nextTick(() => {
        this.$refs.hFormList.selected = null;
      });
    },
    handleTableChange(val) {
      this.loadingColumn = true;
      this.selectItem.dataProp = '';
      const alreadyExit = this.columnNameMap.has(val);
      if (alreadyExit) {
        this.loadingColumn = false;
        return;
      }
      const tableId = this.tableList.find(item => item.tableName === val).id;
      this.loadColumnList(tableId)
        .then(resp => {
          this.columnNameMap.set(val, resp);
        })
        .finally(_ => {
          this.loadingColumn = false;
        });
    },
    loadTableList(id) {
      this.$api.loadFormDefinitionById({ id: id }).then(resp => {
        this.tableList = resp.data.storages;
      });
    },
    async loadColumnList(id) {
      let result = [];
      await this.$api
        .listStorageFields({ searchStorageId: id, pageNumber: 0, pageSize: 200 })
        .then(resp => {
          result = resp.data.content;
        });
      return result;
    }
  },
  mounted() {
    this.$nextTick(_ => {
      if (!this.formDefinitionId) {
        console.error('缺少表单定义id');
        return;
      }
      this.loadTableList(this.formDefinitionId);
    });
  }
};
</script>
<style scoped>
.event-modal /deep/ .ant-modal-body {
  min-height: 500px;
}
</style>
