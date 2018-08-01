import { get, post } from 'http'
export default class TestService {
  getHome() {
    return get('buyer/order/cart/count', {uid: 11})
  }
  addCart() {
    return post('buyer/order/cart/add', {uid: 11, goodsId: 25487, count: 1})
  }

  getByTopicId(params) {
    return get('wechat/config/special/topic/detail', params)
  }

  getCate() {
    return get('buyer/goods/cate/goods/list', {
      page: 1,
      pageSize: 10,
      cateId1: 677,
      client: 10
    })
  }
}
