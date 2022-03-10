<template>
  <section>
    <div
      class="opinion-box"
      :style="{ width: width, color: fontColor, fontSize: fontSize, border: borderStyle }"
    >
      <div class="opinion-block" v-for="item in opinionData" :key="item.taskId">
        <span
          class="opinion-text"
          :style="{ color: item.comment ? fontColor : '#929292' }"
          v-if="isOpinionShow"
          >{{ item.comment ? item.comment : '暂无意见' }}</span
        >
        <span class="opinion-author" v-if="isAuthorShow">{{
          item.assignee ? item.assignee.name : '--'
        }}</span>
        <span class="opinion-date" v-if="isDateShow">{{
          item.taskEndTime ? timestampToDate(item.taskEndTime) : '--'
        }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import moment from 'moment';
export default {
  name: 'HOpinionViewer',
  props: {
    taskDefKey: {
      type: String,
      required: false,
      default: ''
    },
    fontSize: {
      type: String,
      required: false,
      default: '14px'
    },
    fontColor: {
      type: String,
      required: false,
      default: 'black'
    },
    borderStyle: {
      type: String,
      required: false,
      default: '0'
    },
    width: {
      type: String,
      required: false,
      default: '100%'
    },
    isOpinionShow: {
      type: Boolean,
      required: false,
      default: true
    },
    isAuthorShow: {
      type: Boolean,
      required: false,
      default: true
    },
    isDateShow: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  watch: {
    taskDefKey: {
      handler(val) {
        if (val) {
          this.taskDefKeyArray = val.split(',');
          this.loadData();
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      taskDefKeyArray: [],
      opinionData: []
    };
  },
  methods: {
    loadData() {
      let rowInfo = {};
      if (this.$route.query.rowInfo) {
        rowInfo = JSON.parse(this.$route.query.rowInfo);
      }
      if (this.$route.query.ransactRowInfo) {
        rowInfo = JSON.parse(this.$route.query.ransactRowInfo);
      }
      if (JSON.stringify(rowInfo) !== '{}') {
        this.$api
          .trace({
            processInstanceId: rowInfo.processInstanceId,
            taskDefinitionKeys: this.taskDefKeyArray
          })
          .then(resp => {
            const data = resp.data || [];
            const result = [];
            data.forEach(opinion => {
              if (opinion.taskEndTime) {
                result.push(opinion);
              }
            });
            this.opinionData = result;
          })
          .catch(e => {
            this.$message.error(e.response.data.message || this.$t('message.load.fail'));
          })
          .finally(() => {});
      }
    },
    timestampToDate(timestamp) {
      if (!timestamp) {
        return '';
      } else {
        timestamp = Number(timestamp);
        return moment(timestamp).format('YYYY-MM-DD');
      }
    }
  },
  mounted() {}
};
</script>

<style scoped>
.opinion-box {
  box-sizing: border-box;
  background-color: #fff;
  border-top-width: 1.02px;
  border-radius: 2px;
  outline: none;
  min-height: 32px;
  padding: 12px;
  overflow: hidden;
}
.opinion-box:last-child {
  margin-bottom: 0;
}
.opinion-block {
  margin-bottom: 8px;
  border-bottom: 1px dotted #e6e6e6;
  overflow: hidden;
  padding-top: 8px;
  padding-bottom: 12px;
}
.opinion-block:last-child {
  border-bottom: 0;
  margin-bottom: 0;
  padding-bottom: 0;
}
.opinion-text {
  display: inline-block;
  width: 100%;
  margin-bottom: 12px;
}
.opinion-author {
  display: inline-block;
  float: left;
  text-align: left;
  width: 50%;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.opinion-date {
  display: inline-block;
  color: #666666;
  float: right;
  text-align: right;
  width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
