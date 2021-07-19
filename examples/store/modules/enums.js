const enums = {
  state: {
    map: {
      test: [
        {
          name: '枚举1',
          value: 1
        },
        {
          name: '枚举2',
          value: 2
        }
      ]
    }
  },
  getters: {
    enumMap: state => {
      return state.map;
    }
  }
};

export default enums;
