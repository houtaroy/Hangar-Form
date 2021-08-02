class FormData {
  #valueExp;
  #dataName;
  #dataProp;
  constructor(valueExp, dataName, dataProp) {
    this.#valueExp = valueExp;
    this.#dataName = dataName;
    this.#dataProp = dataProp;
  }
  parse(context) {
    if (this.#valueExp instanceof Promise) {
      context.loadingCount += 1;
      this.#valueExp
        .then(res => {
          this._setValue(res, context);
        })
        .finally(() => (context.loadingCount -= 1));
    } else {
      this._setValue(this.#valueExp, context);
    }
  }
  /**
   * 利用vue的this.$set响应式赋值
   */
  _setValue(value, context) {
    context.$set(context[this.#dataName], this.#dataProp, value);
  }
}

export default class FormDataParser {
  #datas;
  constructor() {
    this.#datas = [];
  }
  /**
   * 新增表单数据对象
   * 用于同步/异步数据一并处理
   * @param {string} valueExp 表单数据表达式
   * @param {string} dataName vue中对应的属性名称
   * @param {string} dataProp vue中对应的属性键值
   */
  add(valueExp, dataName, dataProp) {
    this.#datas.push(new FormData(valueExp, dataName, dataProp));
  }
  parse(context) {
    this.#datas.forEach(data => {
      data.parse(context);
    });
  }
}
