const categorySeller = resolve => require(['./src/category.seller'], resolve)
export default function(router) {

  /**
  * 卖家首页 分类列表页
  * id 卖家id
  */
  router.push({
    path: '/category/seller/:id',
    name: 'categorySeller',
    component: categorySeller
  })
}
