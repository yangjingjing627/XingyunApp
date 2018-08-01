import { get, post } from 'http'
export default class orderConfirmService {
  /**
   *
   * 获取ji购物车订单页数据
   * @param {any} params.uid 买家ID [必须]
   * @param {any} params.goodid 商品id [必须]
   * @param {any} params.client 微信：10 PC：20 APP：30（数字类型）
   * @returns
   * @memberof orderConfirmService
   */
  getOrderConfirm(params = {}) {
    params.client = 10
    return post('buyer/order/before', params)
  }
  /**
   *  提交订单
   * 获取ji购物车订单页数据
   * @param {any} params.uid 买家ID [必须]
   * @param {any} params.goodid 商品id [必须]
   * @returns
   * @memberof orderConfirmService
   */
  submitOrder(params = {}) {
    return post('buyer/order/add', params, {isAutoMsg: false})
  }
  /**
   *  获取确认支付页面
   * 获取ji购物车订单页数据
   * @param {any} params.uid 买家ID [必须]
   * @param {any} params.goodid 商品id [必须]
   * @returns
   * @memberof orderConfirmService
   */
  getSureOrder(params = {}) {
    return get('buyer/order/go/pay', params)
  }
  /**
   *  确认支付
   * 获取ji购物车订单页数据
   * @param {any} params.uid 买家ID [必须]
   * @param {any} params.goodid 商品id [必须]
   * @returns
   * @memberof orderConfirmService
   */
  SureOrder(params = {}) {
    return post('buyer/order/confirm/pay', params, {isAutoMsg: false})
  }
  /**
   *  短信获取验证码支付
   *
   * @param {any} params.mobile 手机号 [必须]
   * @param {any} params.orderCode 订单id [必须]
   * @returns
   * @memberof orderConfirmService
   */
  getPayCode(params = {}) {
    return post('sms/get/pay/code', params)
  }
  /**
   *  运费详情
   *
   * @param {any} params.uid 买家ID [必须]
   * @param {any} params.goodsIds 商品id,”,”号分割多个商品id [必须]
   * @param {any} params.sellerId 卖家id [必须]
   * @returns
   * @memberof orderConfirmService
   */
  getCarriageDetail(params = {}) {
    return get('buyer/carriage/detail', params)
  }
  /**
   *  下单支付成功页面,校验订单是否满足下单送优惠券活动
   *
   * @param {any} params.orderId 订单id [必须]
   * @returns
   * @memberof orderConfirmService
   */
  isActivity(params = {}) {
    return get('buyer/coupon/order/activity', params)
  }
  /**
   *  点击领取下单送红包
   *
   * @param {any} params.orderId 订单id [必须]
  * @param {any} params.client 下单渠道(所有平台0 微信平台10 PC20 APP30) [必须]
   * @returns
   * @memberof orderConfirmService
   */
  openRedBag(params = {}) {
    return post('buyer/coupon/list/order/received', params, {isAutoMsg: false})
  }
}
