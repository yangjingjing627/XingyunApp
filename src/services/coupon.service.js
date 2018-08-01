import { get, post } from 'http'
import {CancelToken} from 'axios'
export default class CouponService {
  constructor() {
    this.cancelOrderList = null
  }
/**
 * 获取我的优惠券列表
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.useType 可用类型,0:不可用优惠券,1:可用优惠券 [必须]
 * @param {any} params.next 判断是否可以请求下一页 [必须]
 * @param {any} params.pageSize 每页显示条数 [必须]
 * @returns
 * @memberof CouponService
 */
  couponList(params = {}) {
    return get('buyer/coupon/list', params, {
      isLoading: false,
      cancelToken: new CancelToken(c => {
        this.cancelOrderList = c
      })
    })
  }

/**
 * 判断卖家是否关闭
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.sellerId 卖家id [必须]
 * @returns
 * @memberof CouponService
 */
  couponValidSeller(params = {}) {
    return get('buyer/coupon/valid/seller', params)
  }

/**
 * 领券中心
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.activityId 活动id [不]
 * @param {any} params.next 判断是否可以请求下一页 [必须]
 * @param {any} params.pageSize 每页显示条数 [必须]
 * @returns
 * @memberof CouponService
 */
  couponCenter(params = {}) {
    return get('buyer/coupon/list/receive/center', params, {
      isLoading: false,
      cancelToken: new CancelToken(c => {
        this.cancelOrderList = c
      })
    })
  }

/**
 * 获取领券
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.couponId 优惠券id [必须]
 * @param {any} params.activityId 活动id [不]
 * @param {any} params.applyClient 终端
 * @returns
 * @memberof CouponService
 */
  receiveCoupon(params = {}) {
    return post('buyer/coupon/receive', params)
  }

/**
 * 新用户注册领取礼包提示接口
 * @param {any} params.uid 买家ID [必须]
 * @returns
 * @memberof CouponService
 */
  orderAddCoupon(params = {}) {
    return post('buyer/coupon/list/register', params)
  }
}
