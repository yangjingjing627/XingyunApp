const SearchNew = resolve => require(['./src/search.new.vue'], resolve)
// export default function (router, routes) { // routes表示底部tab
export default function (router) {
  // router.push({
  //   path: '/',
  //   name: 'home',
  //   component: Home,
  //   alias: '/home',
  //   meta: {
  //     isApp: true
  //   }
  // })
  // 搜索页
  router.push({
    path: '/searchs/new',
    name: 'SearchNew',
    component: SearchNew
  })
}
