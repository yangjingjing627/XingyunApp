const My = resolve => require(['./src/my.vue'], resolve)
const Buyer = resolve => require(['./src/buyer.vue'], resolve)
const Buyersetinfo = resolve => require(['./src/buyer.set.vue'], resolve)
const Passwordset = resolve => require(['./src/paypassword/passwordset.vue'], resolve)
const Getcode = resolve => require(['./src/paypassword/getcode.vue'], resolve)
const Setpwd = resolve => require(['./src/paypassword/setpassword.vue'], resolve)
const Set = resolve => require(['./src/set.vue'], resolve)

const Wallet = resolve => require(['./src/wallet/wallet.vue'], resolve)
const Recharge = resolve => require(['./src/wallet/recharge.vue'], resolve)
const myWalletPaymentDetial = resolve => require(['./src/wallet/payment.detail.vue'], resolve)
const myWalletDetial = resolve => require(['./src/wallet/detail.vue'], resolve)
const myWalletRule = resolve => require(['./src/wallet/rule.vue'], resolve)

const Coupon = resolve => require(['./src/coupon/coupon.vue'], resolve)
const CouponExplain = resolve => require(['./src/coupon/coupon.explain.vue'], resolve)
const CouponCenter = resolve => require(['./src/coupon/coupon.center.vue'], resolve)
const CouponDisabled = resolve => require(['./src/coupon/coupon.disabled.vue'], resolve)
const resetPassCode = resolve => require(['./src/resetpassword/getcode.vue'], resolve)
const resetSetPass = resolve => require(['./src/resetpassword/set.password.vue'], resolve)

const WithdrawGo = resolve => require(['./src/withdraw/go.withdraw.vue'], resolve)
const WithdrawDetail = resolve => require(['./src/withdraw/withdraw.detail.vue'], resolve)
const WithdrawRecord = resolve => require(['./src/withdraw/withdraw.record.vue'], resolve)

export default function (routerchild, router) {
  // 我的页面
  routerchild.push({
    path: '/me',
    name: 'me',
    component: My,
    meta: {
      isApp: true
    }
  })
  // 买家信息
  router.push({
    path: '/me/buyer',
    name: 'buyer',
    component: Buyer
  })
  // 买家信息设置
  router.push({
    path: '/me/buyer/setinfo',
    component: Buyersetinfo
  })
  // 支付密码管理
  router.push({
    path: '/me/passwordset',
    component: Passwordset
  })
  // 设置支付密码 - 发送验证码
  router.push({
    path: '/me/passwordset/getcode/:stu2',
    component: Getcode
  })
  // 设置支付密码 - 设置密码
  router.push({
    path: '/me/passwordset/setpwd/:stu2',
    component: Setpwd
  })
  // 设置
  router.push({
    path: '/me/set',
    name: 'set',
    component: Set
  })
  // 我的钱包
  router.push({
    path: '/me/wallet',
    name: 'wallet',
    component: Wallet
  })
  // 充值
  router.push({
    path: '/me/wallet/recharge',
    name: 'recharge',
    component: Recharge
  })
  // 收支细节
  router.push({
    path: '/me/wallet/paymentdetial',
    name: 'myWalletPaymentDetial',
    component: myWalletPaymentDetial
  })
  // 交易详情
  router.push({
    path: '/me/wallet/detial/:id',
    name: 'myWalletDetial',
    component: myWalletDetial
  })
  // 用户协议
  router.push({
    path: '/me/wallet/rule',
    name: 'myWalletRule',
    component: myWalletRule
  })
  // 我的优惠券
  router.push({
    path: '/me/coupon',
    name: 'coupon',
    component: Coupon
  })
  // 优惠券说明
  router.push({
    path: '/me/coupon/explain',
    name: 'couponExplain',
    component: CouponExplain
  })
  // 优惠券中心
  router.push({
    path: '/me/coupon/center',
    name: 'couponCenter',
    component: CouponCenter
  })
  // 不可选优惠券
  router.push({
    path: '/me/coupon/disabled',
    name: 'couponDisabled',
    component: CouponDisabled
  })
  // 指定活动优惠券中心
  router.push({
    path: '/me/coupon/center/:activityId',
    name: 'couponCenterId',
    component: CouponCenter
  })
  // 登录密码重置
  router.push({
    path: '/me/resetpassword/getcode',
    component: resetPassCode
  })
  // 设置登录密码
  router.push({
    path: '/me/resetpassword/set',
    component: resetSetPass
  })
  // 我要提现页面
  router.push({
    path: '/me/withdraw/go',
    name: 'WithdrawGo',
    component: WithdrawGo
  })
  // 我要提现详情页面
  router.push({
    path: '/me/withdraw/detail/:id',
    name: 'WithdrawDetail',
    component: WithdrawDetail
  })
  // 我要提现记录页面
  router.push({
    path: '/me/withdraw/record',
    name: 'WithdrawRecord',
    component: WithdrawRecord
  })
}
