import Vue from 'vue'
import Router from 'vue-router'
import AuthRouter from '@/utils/auth.router'
import App from '@/views/app.vue'
import demoRouter from '@/views/demo'
import orderConfirmRouter from '@/views/orders'
import cartRouter from '@/views/cart'
import homeRouter from '@/views/home'
import myRouter from '@/views/my'
import loginRouter from '@/views/login'
import orderSearch from '@/views/order.search'
import SearchNew from '@/views/search.new'
import goodsRouter from '@/views/goods'
import categoryRouter from '@/views/category'
import categoryListRouter from '@/views/category.list'
import orderRouter from '@/views/order'
import sellerRouter from '@/views/seller'
import templateRouter from '@/views/template'
Vue.use(Router)

let routes = []

// 根路由
let rootRoutr = {
  path: '/',
  component: App,
  children: [],
  meta: {
    requiresAuth: false
  }
}

// 重定向路由
let redirectRoute = {
  path: '*',
  redirect: '/'
}

demoRouter(routes)
orderConfirmRouter(routes)
cartRouter(rootRoutr.children)
homeRouter(rootRoutr.children, routes)
myRouter(rootRoutr.children, routes)
loginRouter(routes)
orderSearch(routes)
SearchNew(routes)
goodsRouter(routes)
categoryRouter(rootRoutr.children)
orderRouter(rootRoutr.children, routes)
sellerRouter(routes)
templateRouter(routes)
categoryListRouter(rootRoutr.children)

let authRouter = new AuthRouter()
let authRouters = authRouter.init(routes.concat([rootRoutr, redirectRoute]))

// 暂时不做路由区分
let mode = 'history'
export default new Router({
  mode: mode,
  routes: authRouters
})
