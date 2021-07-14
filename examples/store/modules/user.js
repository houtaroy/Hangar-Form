const user = {
  namespaced: true,
  state: {
    name: 'test'
  },
  mutations: {},
  getters: {
    name: state => {
      return state.name;
    }
  },
  actions: {
    // 登录
  }
};

export default user;
