import { get, post } from 'http'
export default class MyService {
/**
 * 获取我的页面的信息
 * @param {any} params.uid 买家ID [必须]
 * @returns
 * @memberof MyService
 */
  getMyInfo(params = {}) {
    return get('buyer/my/info', params, {isLoading: false})
  }

/**
 * 买家信息修改接口
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.storeName 店铺名称 [必须]
 * @param {any} params.storePhone 店铺电话 [必须]
 * @param {any} params.owerName 商户姓名 [必须]
 * @param {any} params.address 店铺地址 [必须]
 * @returns
 * @memberof MyService
 */
  getBuyerInfo(params = {}) {
    return post('buyer/my/info/modify', params)
  }

/**
 * 获取手机号
 * @param {any} params.uid 买家ID [必须]
 * @returns
 * @memberof MyService
 */
  getSendCodePhone(params = {}) {
    return get('util/sendCode/phone', params)
  }

/**
 * 获取验证码
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.source 来源 1.设置密码 2.重置密码 [必须]
 * @param {any} params.phone 手机号 [必须]
 * @param {any} params.type 类型：1代表手机 2代表邮箱 [必须]
 * @returns
 * @memberof MyService
 */
  sendCodeReset(params = {}) {
    return post('buyer/my/wallet/pay/password/sendCode/set', params)
  }

 /**
 * 验证码的验证
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.code 验证码 [必须]
 * @param {any} params.phone 手机号 [必须]
 * @param {any} params.type 类型：1代表手机 2代表邮箱 [必须]
 * @returns
 * @memberof MyService
 */
  checkCodeSet(params = {}) {
    return post('buyer/my/wallet/pay/password/checkCode', params)
  }

  /**
  * 设置支付密码
  * @param {any} params.uid 买家ID [必须]
  * @param {any} params.payPassword 支付密码 [必须]
  * @param {any} params.repayPassword 确认支付密码 [不必须]
  * @returns
  * @memberof MyService
  */
  passwordSet(params = {}) {
    return post('buyer/my/wallet/pay/password/set', params)
  }

  /**
  * 我的钱包接口
  * @param {any} params.uid 买家ID [必须]
  * @returns
  * @memberof MyService
  */
  getWalletInfo () {
    return get('buyer/my/wallet')
  }

  /**
  * 充值信息查询页面
  * @param {any} params.uid 买家ID [必须]
  * @returns
  * @memberof MyService
  */
  getRechargeInfo() {
    return get('buyer/recharge/index')
  }

  /**
  * 充值接口---微信支付 废弃
  * @param {any} params.uid 买家ID [必须]
  * @param {any} params.price 充值金额 [必须]
  * @param {any} params.payType 支付类型：1微信；2支付宝；3余额 [必须]
  * @returns
  * @memberof MyService
  */
  payBalance(params) {
    return post('buyer/recharge/balance', params)
  }

  /**
  * 充值接口--新 聚合支付 掌柜云
  * @param {any} params.uid 买家ID [必须]
  * @param {any} params.price 充值金额 [必须]
  * @param {any} params.payType 支付类型：1微信；2支付宝；3余额 [必须]
  * @param {any} params.openId 用户微信唯一标识
  * @param {any} params.device 设备：phone 是 移动端 pc 是pc端 wechat_sub 微信端
  * @param {any} params.frontUrl 前端回调地址
  * @returns
  * @memberof MyService
  */
  payBalanceNew(params) {
    return post('buyer/zhangGui/recharge/balance', params)
  }

  /**
  * 收支明细列表页
  * @param {any} uid 买家ID [必须]
  * @param {any} page 页数 [必须]
  * @param {any} pageSize 页数大小 [必须]
  * @returns
  * @memberof MyService
  */
  getTransactionList({page = 1, pageSize = 10}) {
    return get('buyer/transaction/list', {page, pageSize})
  }

  /**
  * 交易详情
  * @param {any} uid 买家ID [必须]
  * @param {any} transactionId 交易ID [必须]
  * @returns
  * @memberof MyService
  */
  getTransactionDetail({transactionId}) {
    return get('buyer/transaction/detail', {transactionId})
  }

  /**
  * 查询买家设置
  * @param {any} uid 买家ID [必须]
  * @returns
  * @memberof MyService
  */
  getConfigSet () {
    return get('buyer/automatic/replenishment/conf/get')
  }

  /**
  * 自动补货买家接口设置
  * @param {any} uid 买家ID [必须]
  * @param {any} confCode automatic_replenishment_conf [必须]
  * @param {any} onOff 开关(0开1关) [必须]
  * @returns
  * @memberof MyService
  */
  setConfigSet (params) {
    return get('buyer/automatic/replenishment/conf/set', params)
  }
  /**
  * 获取提现金额
  * @param {any} uid 买家ID [必须]
  * @returns
  * @memberof MyService
  */
  getMoneyInfo (params) {
    return get('', params)
  }
  /**
  * 提现获取验证码
  * @param {any} uid 买家ID [必须]
  * @returns
  * @memberof MyService
  */
  getWithDrawCode (params) {
    return post('buyer/withdraw/send/message', params)
  }
  /**
  * 提现获取验证码后确定
  * @param {any} uid 买家ID [必须]
  * @returns
  * @memberof MyService
  */
  getWithDrawSure (params) {
    return post('buyer/withdraw/commit', params)
  }

  /**
  * 提现记录
  * @param {any} uid 买家ID [必须]
  * @returns
  * @memberof MyService
  */
  getWithDrawRecord (params) {
    return get('buyer/withdraw/records', params)
  }
  /**
  * 提现记录详情
  * @param {any} uid 买家ID [必须]
  * @param {any} params.recordId 记录id
  * @returns
  * @memberof MyService
  */
  getWithDrawDetail (params) {
    return get('buyer/withdraw/records/detail', params)
  }
}
