export default {
  methods: {
    /**
     *
     * 微信分享
     * @param {any} params 微信分享参数
     * @param {any} params.desc 描述
     * @param {any} params.title title
     * @param {any} params.link 连接
     * @param {any} params.imgUrl 图片
     * @param {Function} params.success 成功回调
     */
    wxShareInit(params) {
      wx.ready(() => {
        wx.onMenuShareAppMessage(params)
        wx.onMenuShareTimeline(params)
        wx.onMenuShareQQ(params)
      })
    }
  }
}
