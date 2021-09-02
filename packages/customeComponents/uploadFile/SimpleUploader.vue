<!--
* @Description:
-->
<template>
  <div style="display: inline-block;margin: 0 10px;">
    <div>
      <span>{{ text }}</span>
      <a-button @click="openUploader" v-if="!disabled" type="link">
        上传
      </a-button>
    </div>
    <div class="file-item" v-for="(item, index) in fileData" :key="index">
      <!-- 判断文件图标 -->
      <span class="file-type">
        <a-icon v-if="item.name.indexOf('.png') !== -1" type="file-image" style="color: #faad14;" />
        <a-icon
          v-else-if="item.name.indexOf('.jpg') !== -1"
          type="file-image"
          style="color: #faad14;"
        />
        <a-icon
          v-else-if="item.name.indexOf('.pdf') !== -1"
          type="file-pdf"
          style="color: #f5222d;"
        />
        <a-icon
          v-else-if="item.name.indexOf('.doc') !== -1"
          type="file-word"
          style="color: #1890ff;"
        />
        <a-icon
          v-else-if="item.name.indexOf('.docx') !== -1"
          type="file-word"
          style="color: #1890ff;"
        />
        <a-icon
          v-else-if="item.name.indexOf('.xls') !== -1"
          type="file-excel"
          style="color: #52c41a;"
        />
        <a-icon v-else-if="item.name.indexOf('.xlsx') !== -1" type="file" style="color: #52c41a;" />
        <a-icon v-else type="file" />
      </span>
      <!-- 文件名称 -->
      <span class="file-name" :title="item.name">{{ item.name }}</span>
      <!-- 文件操作 -->
      <span class="file-function">
        <a @click="download(item)">下载</a>
        <a v-if="item.name.indexOf('.pdf') !== -1" type="eye" @click="openPdf(item)">预览</a>
        <a v-if="item.name.indexOf('.png') !== -1" @click="picViewer(item)">预览</a>
        <a v-if="item.name.indexOf('.jpg') !== -1" @click="picViewer(item)">预览</a>
        <a-icon v-if="!disabled" @click.stop="delFile(index)" type="close" />
      </span>
    </div>
    <div style="display: none">{{ fileData }}</div>
    <!-- 上传弹窗 -->
    <a-modal
      :maskClosable="false"
      width="1000px"
      title="上传"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <uploader
        v-if="resetUploader"
        :options="options"
        class="uploader-example enclosure"
        :file-status-text="statusText"
        ref="uploader"
        @file-complete="fileComplete"
        @file-error="fileError"
        @file-added="fileAdded"
      >
        <uploader-unsupport></uploader-unsupport>
        <uploader-drop>
          <uploader-btn :attrs="attrs">
            <a-icon style="font-size: 48px; color: #1890ff" type="inbox" />
            <p style="font-size: 18px; margin-top: 20px; font-weight: 600;">
              拖动文件到此处，或点击此处
            </p>
          </uploader-btn>
          <!--<uploader-btn :attrs="attrs">选择图片</uploader-btn>-->
        </uploader-drop>
        <uploader-list></uploader-list>
      </uploader>
    </a-modal>
    <!-- 图片预览弹窗 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleViewCancel" :width="800">
      <img style="width: 100%; margin-top: 20px;" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';
import storage from 'store';
import { ACCESS_TOKEN } from '../../../examples/store/mutation-types';
export default {
  name: 'uploadFile',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    text: String,
    value: {
      type: String,
      default: ''
    },
    uploadOptions: {
      type: Object,
      default: () => {}
    },
    downloadUrl: {
      type: String,
      default: '/api/fileInfos/download?id='
    },
    openPdfUrl: {
      type: String,
      default: '/api/fileInfos/showPdf?id='
    },
    uploadMergeFileUrl: {
      type: String,
      default: '/api/fileInfos/mergeFile'
    },
    attrs: {
      type: Object,
      default: () => {
        return {
          accept: ''
        };
      }
    },
    fileNumber: {
      type: Number,
      default: 2
    }
  },
  watch: {
    value(val) {
      if (!val) return;
      this.fileData = JSON.parse(val);
    },
    uploadOptions: {
      handler(val) {
        Object.assign(this.options, val);
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      sequence: [], // 待合并序列
      resetUploader: true,
      fileData: [], // 附件所存信息
      options: {
        target: '/api/fileInfos/chunk',
        chunkSize: 10 * 1024 * 1024,
        singleFile: true,
        headers: {
          Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN)
        }
      }, // 附件配置
      /*attrs: {
        accept: ''
      }, // 上传类型配置*/
      statusText: {
        success: '成功了',
        error: '出错了',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中'
      }, // 自定义文字
      visible: false, // 上传组件弹窗
      visibleFile: false, // 附件列表弹窗
      confirmLoading: false,
      previewVisible: false, // 图片预览弹窗
      previewImage: '' // 图片的地址
    };
  },
  methods: {
    /**
     * @method 删除附件
     * @desc 根据索引删除附件列表
     * @param {number} index 数组索引
     * @return {type} 无返回
     */
    delFile(index) {
      const that = this;
      this.$confirm({
        title: '确定要删除吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          that.fileData.splice(index, 1);
          if (that.fileData.length === 0) {
            that.$emit('input', '');
          } else {
            that.$emit('input', JSON.stringify(that.fileData));
          }
          that.$message.success('保存成功');
        }
      });
    },
    /**
     * @description 下载附件
     * @param {type} 无参
     * @Modify
     */
    download(item) {
      /*  axios.get(`/api/fileInfos/download?id=${item.id}`).then(resp => {
        const blob = new Blob([resp], { type: 'application/zip' }); // 如类型为excel,type为：'application/vnd.ms-excel'
        const fileName = item.name;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', fileName);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // 点击后移除，防止生成很多个隐藏a标签
      }); */
      window.open(`${this.downloadUrl}${item.id}`);
    },
    /**
     * @description 预览PDF
     * @param {type} 无参
     * @Modify
     */
    openPdf(item) {
      window.open(this.openPdfUrl + item.id, '_blank');
    },
    /**
     * @description 预览查看附件列表
     * @Modify
     */
    showFileList() {
      this.visibleFile = true;
    },
    /**
     * 取消上传
     */
    handleCancel() {
      this.visible = false;
      this.visibleFile = false;
      this.resetUploader = false;
      setTimeout(() => {
        this.resetUploader = true;
      }, 500);
    },
    /**
     * 确认上传完毕
     */
    handleOk() {
      this.sequence.forEach(item => {
        this.fileData.push(item);
      });
      this.$emit('input', JSON.stringify(this.fileData));
      this.$message.success('保存成功');
      this.visible = false;
      this.resetUploader = false;
      setTimeout(() => {
        this.resetUploader = true;
      }, 500);
    },
    /**
     * @description 项目描述
     * @param {type} 无参
     * @Modify
     */
    handleFileOk() {
      // do some thing
    },
    /**
     * 打开上传控件窗口
     * 初始化上传控件
     */
    openUploader() {
      this.visible = true;
      this.$nextTick(() => {
        this.sequence = [];
      });
    },
    /**
     * 上传到最后，合并文件碎片
     */
    fileComplete() {
      console.log('上传完成,即将开始合并');
      console.log('file complete', arguments);
      this.sequence = [];
      const file = arguments[0].file;
      axios
        .post(
          this.uploadMergeFileUrl,
          qs.stringify({
            filename: file.name,
            identifier: arguments[0].uniqueIdentifier,
            totalSize: file.size,
            type: file.type
          }),
          {
            headers: {
              Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN)
            }
          }
        )
        .then(resp => {
          this.sequence.push({
            id: resp.data.data.id,
            name: resp.data.data.filename
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    /**
     * 上传文件失败后的回调函数
     */
    fileError(rootFile, file, message) {
      const fileResponse = JSON.parse(message);
      if (fileResponse.code && fileResponse.code === 500) {
        return this.$message.error(
          fileResponse.message !== 'Index: 1, Size: 1' ? fileResponse.message : '不支持的文件类型'
        );
      }
    },
    /**
     * @method 上传前的事件
     * @desc 解释说明
     * @return {type} 无返回
     */
    fileAdded(file) {
      let result = false;

      // 判断文件个数
      const length = this.fileData.length;
      if (length >= this.fileNumber) {
        this.$message.error(`最多上传 ${this.fileNumber} 个文件`);
        file.ignored = !result;
        return result;
      }

      // 判断文件上传类型，先判断类型是不是包含'',这种情况下任何文件都可以上传
      const acceptType = this.attrs.accept;
      const fileTypeArray = acceptType.split(',');
      const allType = fileTypeArray.some(i => i === '');

      if (allType) {
        result = true;
        return result;
      }

      const idx = file.name.lastIndexOf('.');
      const ext = file.name.substr(idx + 1);
      result = fileTypeArray.includes(ext);
      file.ignored = !result;
      if (!result) {
        this.$message.error(`请上传 ${acceptType} 文件`);
      }
      return result;
    },
    /**
     * @description 预览照片
     * @param {type} 无参
     * @Modify
     */
    picViewer(item) {
      this.previewVisible = true;
      this.previewImage = `${this.downloadUrl}${item.id}`;
    },
    /**
     * @description 预览弹窗的关闭事件
     * @param {type} 无参
     * @Modify
     */
    handleViewCancel() {
      this.previewVisible = false;
      this.pdfViewVisible = false;
      setTimeout(() => {
        this.previewImage = '';
        this.pdfFilePath = '';
      }, 300);
    }
  }
};
</script>

<style>
.uploader-example {
  width: 880px;
  padding: 15px;
  margin: 0 auto;
  font-size: 12px;
}
.uploader-example .uploader-btn {
  margin-right: 4px;
}
.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
.file-item {
  cursor: pointer;
  width: 400px;
  margin: 10px 0;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  padding: 10px;
  overflow: hidden;
}

.file-type {
  float: left;
  width: 30px;
  height: 30px;
  font-size: 30px;
  text-align: center;
  line-height: 30px;
}

.file-name {
  float: left;
  width: 260px;
  height: 30px;
  line-height: 30px;
  padding-left: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-function {
  float: left;
  width: 84px;
  height: 30px;
  line-height: 30px;
  text-align: right;
}

.file-function > a {
  font-size: 12px;
  margin-left: 6px;
}

.file-function > i {
  margin-left: 4px;
}

.enclosure .uploader-drop {
  border: 0 !important;
  background-color: white !important;
}

.enclosure .uploader-btn {
  display: block;
  border: 0;
  padding: 0;
  text-align: center;
}
</style>
