import NProgress from 'nprogress'
import { NoAfterRouteIsLoading } from '@/config/global.config'
import Vue from 'vue'

NProgress.configure({showSpinner: false}) // 取消loading 转圈

/**
 * @export
 * @param {any} router 路由
 * @param {any} store vuex store
 */
export default function LoadingConfig(router, store) {
  router.beforeEach(async(to, from, next) => {
    let { name, matched, fullPath, path } = to
    if (to.hash) {
      return
    }
    if (!Vue.device.isWechat && name !== 'AuthWarn' && bq.isProduction) {
      next({
        path: '/auth/warn'
      })
      return
    }
    if (matched.some(record => record.meta.requiresAuth)) {
      // 如果没有openid 则重定向到 授权
      // if (!Vue.cookie.get('openid') && Vue.device.isWechat) {
      //   window.location.replace(`${API_HOST}/wechat/to/oauth/snsapiUserinfo`)
      //   return
      // }
      // 用户登录处理 判断当前登录状态 如果未登录 直接去登录页面
      let isLoggedIn = !Vue.cookie.get('uid') || !Vue.cookie.get('token')
      if (isLoggedIn) {
        next({
          path: '/login',
          query: { redirect: fullPath }
        })
        return
      }
    }
    let arrNameAndroid = ['category', 'orderDiffinfoup', 'StoreUpload', 'returnselect', 'categorySeller']
    // 处理 安卓设备 调用微信js-sdk permission denied 的情况
    if (Vue.device.isAndroid && arrNameAndroid.indexOf(name) !== -1 && from.name !== null) {
      // 使用 window 跳转
      window.location.href = fullPath
      return
    }
    NProgress.start()
    // 线上访问地址
    // let baseUrl = bq.isProduction ? 'http://m.yuncai.bqmart.cn' : 'http://test.illidan.bqmart.cn'
    // 调用微信签名
    store.dispatch('initWx', `${window.location.origin}${fullPath}`)
    // loading 处理
    if (!store.state.loading.isLastLoading[name]) {
      store.commit('UPDATE_LOADING', { isLoading: true })
    }
    if (/^http/.test(path)) {
      let url = path.split('http')[1]
      window.location.href = `http${url}`
    } else {
      next()
    }
  })

  router.afterEach((to) => {
    let { name } = to
    if (NoAfterRouteIsLoading.indexOf(name) === -1) {
      store.commit('UPDATE_LOADING', { isLoading: false })
    }
  })
}
