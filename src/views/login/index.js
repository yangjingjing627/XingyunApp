import Login from './src/index.vue'
const PhoneValidata = resolve => require(['./src/phone.validate.vue'], resolve)
const SetPassword = resolve => require(['./src/set.password.vue'], resolve)
const SetSuccess = resolve => require(['./src/set.success.vue'], resolve)
const HsyAuth = resolve => require(['./src/auth/auth.login.vue'], resolve)
const HsyAuthNew = resolve => require(['./src/auth/auth.login.new.vue'], resolve)
const AuthRegister = resolve => require(['./src/auth/auth.register.vue'], resolve)
const AuthSuccess = resolve => require(['./src/auth/auth.success.vue'], resolve)
const AuthWarn = resolve => require(['./src/auth/auth.warn.vue'], resolve)
const WX = resolve => require(['./src/wx.vue'], resolve)
export default function(router) {
  // 登录页
  router.push({
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresAuth: false
    }
  })
  // 手机/密码 验证页
  router.push({
    path: '/login/phone/validata',
    component: PhoneValidata,
    meta: {
      requiresAuth: false
    }
  })
  // 设置新密码页
  router.push({
    path: '/login/set/password',
    name: 'setPassword',
    component: SetPassword,
    meta: {
      requiresAuth: false
    }
  })
  // 密码重置成功页
  router.push({
    path: '/login/set/success',
    name: 'setSuccess',
    component: SetSuccess,
    meta: {
      requiresAuth: false
    }
  })
  // 旧版好升益授权登录
  router.push({
    path: '/hsy/auth/old/:hsyStoreId',
    name: 'HsyAuth',
    component: HsyAuth,
    meta: {
      requiresAuth: false
    }
  })
  // 新版好升益授权登录
  router.push({
    path: '/hsy/auth/:hsyStoreId',
    name: 'HsyAuthNew',
    component: HsyAuthNew,
    meta: {
      requiresAuth: false
    }
  })
  // 好升益授权注册
  router.push({
    path: '/auth/register',
    name: 'AuthRegister',
    component: AuthRegister,
    meta: {
      requiresAuth: false
    }
  })
  // 好升益授权成功
  router.push({
    path: '/auth/success',
    name: 'AuthSuccess',
    component: AuthSuccess,
    meta: {
      requiresAuth: false
    }
  })
  // 扫一扫拦截微信页面
  router.push({
    path: '/auth/warn',
    name: 'AuthWarn',
    component: AuthWarn,
    meta: {
      requiresAuth: false
    }
  })
  router.push({
    path: '/wx',
    name: 'WxOauth',
    component: WX,
    meta: {
      requiresAuth: false
    }
  })

}
