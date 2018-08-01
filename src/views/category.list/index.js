const categoryList = resolve => require(['./src/category.list'], resolve)
export default function(router) {

  /**
  * 分类名称列表页面
  */
  router.push({
    path: '/category/list/:cate1',
    name: 'categoryList',
    component: categoryList,
    meta: {
      isApp: true
    }
  })
  router.push({
    path: '/category/list/:cate1/:cate2',
    name: 'categoryList',
    component: categoryList,
    meta: {
      isApp: true
    }
  })
}
