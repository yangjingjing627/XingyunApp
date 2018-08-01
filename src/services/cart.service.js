import { get, post } from 'http'
export default class CartService {
  /**
   *
   * 获取订购车商品列表信息
   * @returns
   * @memberof CartService
   */
  getCartList () {
    return get('buyer/order/cart/get', {}, {isLoading: false})
  }
  /**
   * 调整订购车商品数量接口
   * @param {any} goodsId 商品编号(Id)
   * @param {any} count 修改的商品的总数
   * @returns
   * @memberof CartService
   */
  addCartGoods (goodsId, count) {
    return post('buyer/order/cart/add', {goodsId: goodsId, count: count})
  }
  /**
   * 批量删除商品接口
   * @param {Array} goodsIds 被删除的商品Id以逗号分隔(IdArray)
   * @returns
   * @memberof CartService
   */
  removeGoods (goodsIds) {
    return post('buyer/order/cart/remove/goods', {goodsIds: goodsIds})
  }
  /**
   *
   * 订购车结算检查
   * @param {any} params.goodsIds 商品列表 [必须]
   * @param {any} params.sellerId 商店ID [必须]
   * @param {any} params.client 微信：10 PC：20 APP：30（数字类型）
   * @returns
   * @memberof CartService
   */
  sellerIdBefore(params) {
    params.client = 10
    return post('buyer/order/before', params, {isAutoMsg: false})
  }

  /**
   *
   * 获取购物车数据 营销版本
   * @returns
   * @memberof CartService
   */
  getCartByMkt() {
    return get('buyer/order/cart/query', {}, {isLoading: false})
  }
}
