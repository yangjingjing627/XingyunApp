// 用于 购物车数据同步
// 在详情页 组合页面 修改购物车数量，会影响 列表页 购物车页面的修改
export default {
  computed: {
    cartObject () {
      return window.store.state.cart.modifyCartCount
    },
    count () {
      if ((this.cartObject[this.cartData.goodsId] || this.cartObject[this.cartData.goodsId] === 0)) {
        return this.cartObject[this.cartData.goodsId]
      } else {
        return this.currentVal.cartCount || this.currentVal.count || 0
      }
    }
  },
  methods: {
    // 同步数据
    synCount(newCo, type) {
      let co = {
        ...this.cartObject
      }
      if (type === 'goodsDetail') {
        co[newCo.goodsId] = newCo.count
        window.store.commit('MODIFY_CART_COUNT', co)
      } else if (type === 'combinPage') {
        co[newCo.goodsId] = newCo.count
        window.store.commit('MODIFY_CART_COUNT', co)
      } else {
        delete co[newCo.goodsId]
        window.store.commit('MODIFY_CART_COUNT', co)
      }
    }
  }
}
