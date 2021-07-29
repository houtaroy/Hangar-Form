class VueData {
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
  _setValue(value, context) {
    context.$set(context[this.#dataName], this.#dataProp, value);
  }
}

class VueDataParser {
  static parse(vueData, context) {
    vueData.parse(context);
  }
  static parseList(vueDatas, context) {
    vueDatas.forEach(vueData => {
      this.parse(vueData, context);
    });
  }
}

export { VueData, VueDataParser };
export default VueDataParser;
