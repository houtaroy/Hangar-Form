/**
 * 该文件是为了按需加载，剔除掉了一些不需要的框架组件。
 * 减少了编译支持库包大小
 *
 * 当需要更多组件依赖时，在该文件加入即可
 */
import Vue from 'vue';
import {
  ConfigProvider,
  Layout,
  Input,
  Rate,
  Slider,
  InputNumber,
  Button,
  Switch,
  Radio,
  Checkbox,
  Select,
  Card,
  Empty,
  Form,
  Row,
  Col,
  Modal,
  Table,
  Tabs,
  Icon,
  Steps,
  Alert,
  Tag,
  Divider,
  DatePicker,
  TimePicker,
  message,
  Upload,
  Tooltip,
  FormModel,
  Collapse,
  Cascader,
  TreeSelect,
  Spin,
  List
} from 'ant-design-vue';
import vcolorpicker from 'vcolorpicker';

import KBatch from '../KBatch';
import KSelectInputList from '../KSelectInputList';
import KEditor from '../KEditor';
import UploadFile from '../UploadFile';
import UploadImg from '../UploadImg';
import KDatePicker from '../KDatePicker';
import KTimePicker from '../KTimePicker';
import HMethodForm from '../HMethodForm';
import HLifecycleForm from '../HLifecycleForm';
import HEventForm from '../HEventForm';
import HForm from '../HForm';
import HHtml from '../HHtml';
import HUploader from '../customeComponents/uploadFile/SimpleUploader';
import uploader from 'vue-simple-uploader';
import HCommentOptions from '../customeComponents/commonOptions/commonOptions';
import HDatePicker from '../customeComponents/HDatePicker/HDatePicker';
import HAceEditor from '../customeComponents/ace-editor';
import HWebOffice from '../customeComponents/webOffice/webOffice';
import HTable from '../customeComponents/operateTotalCountTable/index';

export default {
  input: Input,
  number: InputNumber,
  select: Select,
  checkbox: Checkbox,
  radio: Radio,
  date: KDatePicker,
  time: KTimePicker,
  rate: Rate,
  slider: Slider,
  switch: Switch,
  uploadFile: UploadFile,
  uploadImg: UploadImg,
  treeSelect: TreeSelect,
  cascader: Cascader,
  batch: KBatch,
  selectInputList: KSelectInputList,
  editor: KEditor
};

Vue.use(ConfigProvider);
Vue.use(Tooltip);
Vue.use(Empty);
Vue.use(FormModel);
Vue.use(Collapse);
Vue.use(Layout);
Vue.use(Input);
Vue.use(Rate);
Vue.use(Slider);
Vue.use(InputNumber);
Vue.use(Button);
Vue.use(Switch);
Vue.use(Radio);
Vue.use(Checkbox);
Vue.use(Select);
Vue.use(Card);
Vue.use(Form);
Vue.use(Row);
Vue.use(Col);
Vue.use(Modal);
Vue.use(Table);
Vue.use(Tabs);
Vue.use(Icon);
Vue.use(Steps);
Vue.use(Alert);
Vue.use(Tag);
Vue.use(Divider);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(Upload);
Vue.use(vcolorpicker);
Vue.use(TreeSelect);
Vue.use(Cascader);
Vue.use(Spin);
Vue.use(List);
Vue.use(HMethodForm);
Vue.use(HLifecycleForm);
Vue.use(HEventForm);
Vue.use(HForm);
Vue.use(HHtml);
Vue.use(HCommentOptions);
Vue.component('h-date-picker', HDatePicker);
Vue.component('h-uploader', HUploader);
Vue.use(uploader);
Vue.use(HAceEditor);
Vue.use(HWebOffice);
// Vue.use(HTable);
Vue.component('h-table', HTable);

Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$message = message;
