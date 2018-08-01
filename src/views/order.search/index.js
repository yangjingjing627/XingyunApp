import OrderSearch from './src/index.vue'
const orderSearchResult = resolve => require(['./src/result.vue'], resolve)
export default function(router) {
  // 订单查询页
  router.push({
    path: '/order/search',
    name: 'OrderSearch',
    component: OrderSearch
  })
  // 订单查询结果页
  router.push({
    path: '/order/search/result/:isOrder',
    name: 'orderSearchResult',
    component: orderSearchResult
  })
}
