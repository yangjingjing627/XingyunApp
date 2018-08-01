const orderConfirm = resolve => require(['./src/order.confirm.vue'], resolve)
// const orderImgList = resolve => require(['./src/order.img.list.vue'], resolve)
const orderPay = resolve => require(['./src/order.pay.vue'], resolve)
const orderPaySuccess = resolve => require(['./src/order.success.vue'], resolve)
const orderIphonePwd = resolve => require(['./src/order.iphonecode.vue'], resolve)
const orderSelectCoupon = resolve => require(['./src/coupon/select.coupon.vue'], resolve)
export default function (router) {
  /**
   * query
   * @parmas {String} goodId
   * @parmas {String} sellId
   */
  router.push({
    path: '/order/confirm',
    name: 'orderConfirm',
    component: orderConfirm
  })
  // 确认支付页
  router.push({
    path: '/order/pays/:sellerId/:payflag',
    name: 'orderPay',
    component: orderPay
  })
  // 支付成功页
  router.push({
    path: '/order/pay/success/:orderCode/:orderid',
    name: 'orderPaySuccess',
    component: orderPaySuccess
  })
  // 短信支付页
  router.push({
    path: '/order/iphone/paypawd/:mobile/:orderCode/:orderId',
    name: 'orderIphonePwd',
    component: orderIphonePwd
  })
  // 选择优惠券
  router.push({
    path: '/order/select/coupon',
    name: 'orderSelectCoupon',
    component: orderSelectCoupon
  })
}
