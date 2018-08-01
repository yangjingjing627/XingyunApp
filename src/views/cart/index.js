// const Cart = resolve => require(['./src/cart.vue'], resolve)
const Cart = resolve => require(['./src/cart.mkt.vue'], resolve)

export default function (router) {
  /**
   * 订购车商品列表页
   */
  router.push({
    path: '/cart',
    name: 'cart',
    component: Cart,
    meta: {
      isApp: true
    }
  })

}
