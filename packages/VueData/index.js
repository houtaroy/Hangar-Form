export default class VueData {
  #valueExp;
  #dataName;
  #dataProp;
  #context;
  constructor(valueExp, dataName, dataProp, context) {
    this.#valueExp = valueExp;
    this.#dataName = dataName;
    this.#dataProp = dataProp;
    this.#context = context;
  }
  parse() {
    if (this.#valueExp instanceof Promise) {
      this.#context.loadingCount += 1;
      this.#valueExp
        .then(res => {
          this._setValue(res);
        })
        .finally(() => (this.#context.loadingCount -= 1));
    } else {
      this._setValue(this.#valueExp);
    }
  }
  _setValue(value) {
    this.#context.$set(this.#context[this.#dataName], this.#dataProp, value);
  }
}
