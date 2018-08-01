const category = resolve => require(['./src/category'], resolve)
export default function(router) {

  /**
  * 分类列表页面
  */
  router.push({
    path: '/category',
    name: 'category',
    component: category,
    meta: {
      isApp: true
    }
  })
}
