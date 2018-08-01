const GoodDetail = resolve => require(['./src/detail.vue'], resolve)
export default function (router) {
  /**
   * 商品详情页
   * @param {String} sku 商品id
   */
  router.push({
    path: '/goods/detail/:sku',
    name: 'goodsDetail',
    component: GoodDetail
  })
}
