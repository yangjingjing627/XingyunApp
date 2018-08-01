export default {
  methods: {
    /**
     * 调起支付
     * @param {any} [params.timestamp]
     * @param {any} [params.nonceStr]
     * @param {any} [params.package]
     * @param {any} [params.signType]
     * @param {any} [params.paySign]
     */
    chooseWXPay(params = {}) { // 原来的微信支付方式
      if (!this.$device.isWechat) {
        this.$messagebox.alert('请在微信下打开！')
        return
      }
      let self = this
      wx.ready(() => {
        wx.chooseWXPay({
          timestamp: params.timeStamp,
          nonceStr: params.nonceStr,
          package: params.packages,
          signType: params.signType,
          paySign: params.paySign,
          success(_res) {
            self.$messagebox.alert('支付成功')
          },
          fail(res) {
            bqLog.captureMessage('微信支付出错', {level: 'info', logger: 'weixin.error', extra: res})
          }
        })
      })
    },
    /**
     * 调起支付 兼容掌柜云支付
     * @param {any} [params.appId]
     * @param {any} [params.timestamp]
     * @param {any} [params.nonceStr]
     * @param {any} [params.package]
     * @param {any} [params.signType]
     * @param {any} [params.paySign]
     */
    getBrandWCPayRequest (params = {}) {  // 新的调取微信支付的方式传参
      if (!this.$device.isWechat) {
        this.$messagebox.alert('请在微信下打开！')
        return
      }
      let self = this
      wx.ready(() => {
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
          appId: params.appId,
          timeStamp: params.timeStamp,
          nonceStr: params.nonceStr,
          package: params.packages,
          signType: params.signType,
          paySign: params.paySign
        },
        function success(_res) {
          if (_res.err_msg === 'get_brand_wcpay_request:ok') {
            self.$messagebox.alert('支付成功')
          }
        },
        function fail(_res) {
          if (_res.err_msg === 'get_brand_wcpay_request:fail') {
            bqLog.captureMessage('微信支付出错', {level: 'info', logger: 'weixin.error', extra: _res})
          }
        })
      })
    }
  }
}
