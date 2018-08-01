<template>
  <div class="coupon-modify">
    <div class="coupon-item">
      <div class="content">
        <p class="info bq-f-size-14">
          {{ info.couponName }}
        </p>
        <p class="rule bq-f-size-12">
           <span class="tag" v-if="info.couponType === 10"><i>{{info.couponTypeDesc}}</i></span>
           <span class="tag" v-if="info.couponType === 20"><i>{{info.couponTypeDesc}}</i></span>
           <span class="tag" v-if="info.couponType === 30"><i>{{info.couponTypeDesc}}</i></span>
           <span v-if="info.amountLimit ===0">无使用门槛</span>
           <span v-if="info.amountLimit !==0">满{{ info.amountLimit }}元可用</span>
          <p v-if="tag == 0 || tag == 2" class="rule-time">{{ info.validPeriodStart }}-{{ info.validPeriodEnd }}</p>
          <p v-if="tag == 1" class="rule-time">{{ info.effectiveInfo }}</p>
        </p>
        <div class="operation" :class="{chooseCoupon: tag == 2}">
          <span v-if="info.faceValue" class="money bq-f-size-14">￥<i class="get-Money">{{ info.faceValue }}</i></span>
          <!-- <span v-if="info.faceValue" class="money bq-f-size-14"><i>￥</i><i class="get-Money">{{ getMoney(info.faceValue)[0] }}</i><i v-if="getMoney(info.faceValue)[1]" class="bq-f-size-36">.</i><i v-if="getMoney(info.faceValue)[1]">{{ getMoney(info.faceValue)[1] }}</i></span> -->
          <span v-if="!info.faceValue && tag == 1" class="money bq-f-size-14"><i class="ping-Money">拼手气</i></span>
          <!-- <span class="money bq-f-size-14"><span class="bq-f-size-36">9.5</span>折</span> -->
          <button v-if="tag == 0" class="btn" @click="userCoupon(info.sellerId)"><span>立即使用</span></button>
          <button v-if="tag == 1 && info.isReceive != 1" class="btn" @click="getCoupon(info.couponId, info.activityId, info.applyClient)"><span>立即领取</span></button>
          <button v-if="tag == 1 && info.isReceive == 1" class="btn got"><span>已领取</span></button>
        </div>
      </div>
      <div class="dot">
        <i class="left"></i>
        <i class="right"></i>
      </div>
      <div class="footer">
        <p class="rule-time">
          <span class="seller-style">卖家优惠券：{{ info.sellerName }}</span>
          <a :class="{active: showDetail}" @click="lookDetail">查看详情</a>
        </p>
        <ul class="foot-ul" v-if="showDetail">
          <li>• 适用卖家：{{ info.sellerName }}</li>
          <li>• 适用条件：不与其它优惠条件叠加</li>
          <li v-if="info.useTimesType">• 可用时段：{{ useTimesList[info.useTimesType-1].name }}</li>
          <li v-if="info.isWithActivity">• 其他活动叠加使用：{{ isWithActivityList[info.isWithActivity].name }}</li>
          <li v-if="info.applicableProductType">• 适用商品类型：{{ applicableProductTypeList[info.applicableProductType-1].name }}</li>
          <li v-if="info.applyClient">• 适用终端：{{ getApplyClient() }}</li>
          <li v-if="info.payType">• 适用支付方式：{{ payTypeList[info.payType-1].name }}</li>
          <li>• 优惠券说明：{{ info.description }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import CouponService from '@/services/coupon.service.js'

export default {
  name: 'coupon-item',
  data() {
    return {
      index: 1,
      showDetail: false,
      chooseCoupon: false,
      useTimesList: [
        {type: 1, name: '全部时段'},
        {type: 2, name: '固定时段'}
      ],
      isWithActivityList: [
        {type: 0, name: '不与任何活动叠加'},
        {type: 1, name: '可与任何活动叠加'}
      ],
      applicableProductTypeList: [
        {type: 1, name: '全部商品均适用'},
        {type: 2, name: '仅限部分分类下商品使用'},
        {type: 3, name: '仅限部分商品使用'}
      ],
      payTypeList: [
        {type: 1, name: '所有支付方式'},
        {type: 2, name: '仅限在线支付'}
      ]
    }
  },
  props: {
    info: {},
    tag: '' // 0:我的优惠券 1:领券中心 2:选择优惠券
  },
  mounted () {
    this.CouponService = new CouponService()
  },
  methods: {
    getApplyClient() {
      let applyClientName = ''
      switch (this.info.applyClient) {
        case 0:
          applyClientName = '全部客户端'
          break
        case 10:
          applyClientName = '仅限微信端'
          break
        case 20:
          applyClientName = '仅限pc端'
          break
        case 30:
          applyClientName = '仅限app'
          break
        default:
      }
      return applyClientName
    },
    lookDetail() {
      this.showDetail = !this.showDetail
    },
    async userCoupon(sellerId) {
      let params = {
        sellerId: sellerId
      }
      await this.CouponService.couponValidSeller(params)
      this.$router.push('/category/seller/' + sellerId)
    },
    async getCoupon(couponId, activityId, applyClient) {
      let params = {}
      params.couponId = couponId
      params.activityId = activityId
      params.applyClient = applyClient
      let res = await this.CouponService.receiveCoupon(params)
      this.$messagebox.alert('领取成功！')
      this.info.isReceive = 1
      this.info.faceValue = res.faceValue
    }
  }
}
</script>
<style lang="scss" scoped>
@import './coupon.scss';
</style>
