const Order = resolve => require(['./order.vue'], resolve)
const ReturnSelect = resolve => require(['./src/returnselect.vue'], resolve)
const ReturnSelectReason = resolve => require(['./src/return.select.reason.vue'], resolve)
const SureRecieve = resolve => require(['./src/sure.recievegood.vue'], resolve)
const Diffinfoup = resolve => require(['./src/diffinfoup.vue'], resolve)
const ReturnDetail = resolve => require(['./src/return.detail.vue'], resolve)
const DiffDetail = resolve => require(['./src/diff.detail.vue'], resolve)
const OrderDetail = resolve => require(['./src/order.detail.vue'], resolve)
export default function (router, mainRouter) {
  /**
   * 订单首页
   */
  router.push({
    path: '/order',
    name: 'order',
    component: Order,
    meta: {
      isApp: true
    }
  })
  // 选择退货商品 - 第一步
  mainRouter.push({
    path: '/order/returnselect/:orderId',
    name: 'returnselect',
    component: ReturnSelect
  })
  // 选择退货商品 - 提交
  mainRouter.push({
    path: '/order/returnselect/reason/:orderId',
    component: ReturnSelectReason
  })
  // 确认收货
  mainRouter.push({
    path: '/order/confirm/:orderId',
    component: SureRecieve
  })
  // 差异凭证上传
  mainRouter.push({
    path: '/order/diffinfoup/:orderId',
    name: 'orderDiffinfoup',
    component: Diffinfoup
  })
  // 退货单详情
  mainRouter.push({
    path: '/order/returndetail/:orderId',
    component: ReturnDetail
  })
  // 订货单详情
  mainRouter.push({
    path: '/order/detail/:orderId',
    name: 'orderDetail',
    component: OrderDetail
  })
  // 差异查看
  mainRouter.push({
    path: '/order/diffdetail/:orderId/:ty',
    name: 'orderDiffDetail',
    component: DiffDetail
  })
}
