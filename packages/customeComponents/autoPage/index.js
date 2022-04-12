import operateTotalCountTable from '../operateTotalCountTable';

export default {
  name: 'HPage',
  props: {
    queryList: Array, // 搜索列表
    col: Object
  },
  data() {
    return {
      isFold: false,
      localQueryList: this.queryList
    };
  },
  methods: {},
  render() {
    console.log({ ...this.col });
    const searList = (
      <section>
        {this.localQueryList.map(item => (
          <a-col {...{ props: { ...this.col } }}>
            <a-form-item label={item.label}>
              <a-input placeholder={item.placeholder} v-model={item.model}></a-input>
            </a-form-item>
          </a-col>
        ))}
      </section>
    );
    return (
      <a-form>
        {searList}
        <a-col {...{ props: { ...this.col } }}>{this.isFold ? '折叠' : '展开'}</a-col>
      </a-form>
    );
  }
};
