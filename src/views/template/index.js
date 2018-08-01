export default function(router) {

 /**
  * 专题页
  * @param {Number} id 专题id
  */
  router.push({
    path: '/template/:topicId',
    name: 'template',
    component: () => import('./src/template')
  })
}
