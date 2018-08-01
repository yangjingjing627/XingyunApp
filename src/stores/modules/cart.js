import { GET_CART_COUNT, UPDATE_CART_COUNT, MODIFY_CART_COUNT } from '../mutation.types'
const state = {
  // 购物车
  cartCount: 0,
  // 同步购物车数量
  modifyCartCount: {}
}

const mutations = {
  [GET_CART_COUNT](state, value) {
    state.cartCount = value
  },
  [UPDATE_CART_COUNT](state, value) {
    state.cartCount = state.cartCount + value
  },
  [MODIFY_CART_COUNT](state, value) {
    state.modifyCartCount = value
  }
}

export default {
  state,
  mutations
}
