import { post, get } from 'http'
export default class OrderCartService {
  /**
   * 调整订购车商品数量接口
   * @param {any} params.goodsId 商品编号(Id)
   * @param {any} params.count 修改的商品的总数
   * @returns
   * @memberof OrderCartService
   */
  addCart (params) {
    return post('buyer/order/cart/add', params, {isLoading: false})
  }
  /**
   * 获取购物车数量接口
   * @param {any} params.sellerid 商店ID
   * @returns
   * @memberof OrderCartService
   */
  getCartCount (params) {
    return get('buyer/order/cart/count', params, {isLoading: false})
  }
}
