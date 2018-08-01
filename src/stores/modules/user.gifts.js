import { GET_NEW_USER_GIFTS } from '../mutation.types'
const state = {
  // 确认订单信息
  orderInfo: {
    info: {}
  }
}

const mutations = {
  [GET_NEW_USER_GIFTS] (state, value) {
    state.info = value
  }
}

export default {
  state,
  mutations
}
