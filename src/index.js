'use strict'
import '@/lib/zepto'
import Vue from 'vue'
import bqUI from '~'
import plugin from 'plugins'
import store from './stores/index'
import router from '@/config/router.config'
import LoadingConfig from '@/config/loading.config'
import component from '@/components'
// import '@/config/sentry.config'
import '*/scss/index.scss'
import '@/scss/index.scss'

Vue.config.productionTip = bq.isDevelopment
window.router = router
// window.route = route
window.store = store
Vue.use(plugin)
Vue.use(bqUI)
Vue.use(component)

// router 处理
LoadingConfig(router, store)
new Vue({ router, store }).$mount('#app')

window.addEventListener('load', () => {
  document.querySelector('#bqDefaultLoading').style.display = 'none'
})
