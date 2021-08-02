import FormDataParser from '../FormData';
import { getDefaultValueParsers } from '../FormParser/modules/DefaultValueParser';

const dataTemplate = {
  error: false,
  errorMessage: '',
  loadingCount: 0,
  antFormModalItemAttrs: {},
  // 原始数据, 用于重置
  originalData: {},
  data: {},
  // 元素配置
  elementConfigs: {},
  // 选项配置数据
  optionsMap: {}
};

export default class DataParser {
  static parse(...options) {
    return function() {
      return Object.assign({}, dataTemplate, {
        formDataParser: new FormDataParser(),
        defaultValueParsers: getDefaultValueParsers(),
        ...options
      });
    };
  }
}
