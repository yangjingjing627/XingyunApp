import { GET_ORDER_CONFIRM_STATUS } from '../mutation.types'
const state = {
  // 确认订单信息
  orderInfo: {
    payType: '',
    remark: '',
    dateValue: '',
    couponList: '',
    couponMoney: '',
    userCouponId: '',
    goodsIds: '',
    sellerId: ''
  }
}

const mutations = {
  [GET_ORDER_CONFIRM_STATUS] (state, value) {
    state.orderInfo = value
  }
}

export default {
  state,
  mutations
}
