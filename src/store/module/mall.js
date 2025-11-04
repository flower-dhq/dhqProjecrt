export default {
  namespaced: true,
  state: {
    // 用于下订单页面存放收获地址数据
    orderAddress: null,
    // 记录是否从首页通过页面按钮跳转只其他页面
    homeJumpOtherPage: false,
    // 开具发票页面存的发票数据
    invoicesInfo: null,
  },
  getters: {},
  mutations: {
    /**
     * @param {Object} payload 收货地址参数
     * @description 注意，凡是跳转入"/pay-order"下订单页面的前一个页面都需要传入null置空
     */
    updateOrderAddress(state, payload) {
      state.orderAddress = payload;
    },
    updateHomeJumpOtherPage(state, payload) {
      state.homeJumpOtherPage = payload;
    },
    /**
     * @param {Object} payload 开具发票参数
     * @description
     */
    updateInvoicesInfo(state, payload) {
      state.invoicesInfo = payload;
    },
  },
  actions: {},
};
