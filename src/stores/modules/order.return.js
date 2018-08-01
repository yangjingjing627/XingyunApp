import { GET_RETURN_ORDERINFO, GET_RETURN_ORDERLIST } from '../mutation.types'
const state = {
  // 退货订单信息
  orderInfo: {},
  orderList: []
}

const mutations = {
  [GET_RETURN_ORDERINFO] (state, value) {
    state.orderInfo = value
  },
  [GET_RETURN_ORDERLIST] (state, value) {
    state.orderList = value
  }
}

export default {
  state,
  mutations
}
