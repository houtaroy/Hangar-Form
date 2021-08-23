const user = {
  namespaced: true,
  state: {
    info: {
      name: '张三'
    }
  },
  mutations: {},
  getters: {
    info: state => {
      return state.info;
    }
  },
  actions: {
    // 登录
  }
};

export default user;
