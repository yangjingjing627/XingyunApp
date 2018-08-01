import { get, post } from 'http'
import {CancelToken} from 'axios'
export default class OrderService {
  constructor() {
    this.cancelOrderList = null
  }
  /**
   * 获取普通订单列表
   * @param {any} params.type 订单类型
   * @param {any} params.type 查询参数(订货单号/商品条码/商品名称)
   * @param {any} params.startTime 查询参数(开始时间)
   * @param {any} params.endTime 查询参数(结束时间)
   * @param {any} params.page 页码
   * @param {any} params.page 每页个数
   * @returns
   * @memberof OrderService
   */
  getOrderList (params) {
    if (this.cancelOrderList) {
      this.cancelOrderList()
      this.cancelOrderList = null
    }
    return get('buyer/order/list', params, {
      isLoading: false,
      cancelToken: new CancelToken(c => {
        this.cancelOrderList = c
      })
    })
  }

/**
 * 选择退货商品
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.orderId 订单号 [必须]
 * @returns
 * @memberof OrderService
 */
  getReturnBefore(params = {}) {
    return get('buyer/order/return/before', params, {isLoading: false})
  }

/**
 * 退货商品提交
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.orderId 订单号 [必须]
 * @param {any} params.remark 备注信息 [必须]
 * @param {any} params.goodsList 退货的详情 传一个json格式的字符串数组 [必须]
 * @returns
 * @memberof OrderService
 */
  postReturnSubmit(params = {}) {
    return post('buyer/order/return/submit', params)
  }

/**
 * 退货单详情
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.returnOrderId 退货单号 [必须]
 * @returns
 * @memberof OrderService
 */
  getReturnDetail(params = {}) {
    return get('buyer/order/return/detail', params)
  }

/**
 * 退货单详情
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.returnOrderId 退货单号 [必须]
 * @returns
 * @memberof OrderService
 */
  ReturnCancle(params = {}) {
    return post('buyer/order/return/cancle', params)
  }

/**
 * 订单详情页
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.orderId 订单号 [必须]
 * @param {any} params.returnOrderId 退货单号 [必须]
 * @returns
 * @memberof OrderService
 */
  getOrderDetail(params = {}) {
    return get('buyer/order/detail', params)
  }

/**
 * 确认收货
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.orderId 订单号 [必须]
 * @param {any} params.goodsList 传一个json格式的字符串数组 [必须]
 * @returns
 * @memberof OrderService
 */
  postOrderConfirm(params = {}) {
    return post('buyer/order/confirm', params, {isLoading: false})
  }

/**
 * 确认收货提交
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.orderId 订单号 [必须]
 * @param {any} params.goodsList 传一个json格式的字符串数组 [必须]
 * @returns
 * @memberof OrderService
 */
  orderConfirmSubmit(params = {}) {
    return post('buyer/order/confirm/submit', params)
  }

/**
 * 确认收货提交没有异常跳转
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.redisKey 订单号 [必须]
 * @param {any} params.type 3 [必须]
 * @returns
 * @memberof OrderService
 */
  operationProgressGet(params = {}) {
    return get('operation/progress/get', params)
  }

/**
 * 从redis中取差异商品数据
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.orderId 订单号 [必须]
 * @returns
 * @memberof OrderService
 */
  getCheckDiffList(params = {}) {
    return get('buyer/order/get/check/diff/list', params)
  }

/**
 * 退货单列表页
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.type 退货单类型(1:全部,2:退货待审核,3:待收货确认,4:退货成功,5:退货失败;不传也是全部) [不是必须]
 * @param {any} params.parameter 查询参数(订货单号/商品条码/商品名称) [不是必须]
 * @param {any} params.startTime 查询参数(开始时间) [不是必须]
 * @param {any} params.endTime 查询参数(结束时间) [不是必须]
 * @param {any} params.page 页码 [必须]
 * @param {any} params.pageSize 每页个数 [必须]
 * @returns
 * @memberof OrderService
 */
  getReturnList (params) {
    if (this.cancelOrderList) {
      this.cancelOrderList()
      this.cancelOrderList = null
    }
    return get('buyer/order/return/list', params, {
      isLoading: false,
      cancelToken: new CancelToken(c => {
        this.cancelOrderList = c
      })
    })
  }
  /**
   * 取消订单功能
   * @param {String} orderId 订单ID
   * @returns
   * @memberof OrderService
   */
  orderCancle (orderId) {
    return post('buyer/order/cancle', {orderId: orderId})
  }
  /**
   * 退款订单取消接口
   * @param {String} returnOrderId 退货单ID
   * @returns
   * @memberof OrderService
   */
  returnCancle (returnOrderId) {
    return post('buyer/order/return/cancle', {returnOrderId: returnOrderId})
  }

  /**
   * 查询差异接口
   * @param {orderId} 订单ID [必须]
   * @param {uid} 买家ID [必须]
   * @param {salt} 签名 [必须]
   * @returns
   * @memberof OrderService
   */
  getDiffInfo ({orderId}) {
    return get('buyer/order/diff', {orderId})
  }

  /**
   * 我的收支明细查询差异接口
   * @param {orderId} 订单ID [必须]
   * @param {uid} 买家ID [必须]
   * @param {salt} 签名 [必须]
   * @returns
   * @memberof OrderService
   */
  getTransInfo ({orderId}) {
    return get('buyer/transaction/detail/diff', {orderCode: orderId})
  }
}
