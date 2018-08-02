const My = resolve => require(['./src/my.vue'], resolve)
const Buyer = resolve => require(['./src/buyer.vue'], resolve)

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
}
