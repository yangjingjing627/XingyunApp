
/**
 *  营销统一处理
 */
export default {
  data() {
    return {
      ycActivity: {
        chuxiao: undefined,
        manjian: '',
        activityType: 0,
        changeType: 0
      }
    }
  },
  methods: {

    /**
     *
     * 获取营销活动规则
     * @param {any} storeList 店铺id
     * @returns 返回活动规则列表
     */
    getActivityRule(storeList) {
      let rules = storeList.filter(store => store.activityId !== '').map(store => {
        return { activityType: store.activityType, activityRule: store.activityRule }
      })
      if (!rules[0]) {
        return
      }
      // 多个卖家 取第一个
      let activityType = rules[0].activityType
      let activityRule = rules[0].activityRule
      this.ycActivity.activityType = activityType
      // 满减处理
      if (activityType === 10) {
        this.ycActivity.manjian = JSON.parse(activityRule).join('；')
      }

      // 促销处理
      if (activityType === 20) {
        // 如果是 促销时 取最小促销
        let oldActivetyRule = this.ycActivity.chuxiao
        if (oldActivetyRule === undefined || (parseFloat(oldActivetyRule) > parseFloat(activityRule))) {
          this.ycActivity.chuxiao = activityRule
        }
      }
      // 组合处理 直降处理
      if (activityType === 50 || activityType === 60) {
        // 区分是组合立减还是组合直降  changeType= 0 不变 1 降价 2 加价
        activityRule = this.$bqUtils.jsonParse(activityRule)
        this.ycActivity.changeType = activityRule.changeType
      }
      // rules.forEach(rule => {
      // })
      return rules
    }

  }
}
