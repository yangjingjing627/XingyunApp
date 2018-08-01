const Home = resolve => require(['./src/home.new.vue'], resolve)
const StoreResgister = resolve => require(['./src/store.register.vue'], resolve)
const StoreModelResgister = resolve => require(['./src/store.model.register.vue'], resolve)
const StoreUpload = resolve => require(['./src/store.upload.vue'], resolve)
export default function (router, routes) { // routes表示底部tab
  router.push({
    path: '/',
    name: 'home',
    component: Home,
    alias: '/home',
    meta: {
      isApp: true
    }
  })
  // 店铺注册
  routes.push({
    path: '/store/register',
    name: 'StoreResgister',
    component: StoreResgister,
    meta: {
      requiresAuth: false
    }
  })
  // 店铺注册协议
  routes.push({
    path: '/store/model/register',
    name: 'StoreModelResgister',
    component: StoreModelResgister,
    meta: {
      requiresAuth: false
    }
  })
  // 店铺信息认证
  routes.push({
    path: '/store/upload/:phone',
    name: 'StoreUpload',
    component: StoreUpload,
    meta: {
      requiresAuth: false
    }
  })
}
