<template>
  <div class="coupon-modify">
    <div class="coupon-item disabled-coupon">
      <div class="content">
        <p class="info bq-f-size-14">
          {{ info.couponName }}
        </p>
        <p class="rule bq-f-size-12">
          <!-- <span class="tag"><i>现金券</i></span> -->
          <!-- <span class="tag"><i :class="{'tag2': index === 2}">满减券</i></span>
          <span class="tag"><i :class="{'tag3': index > 2}">折扣券</i></span> -->
          <!-- <span>无使用门槛</span> -->
          <span class="tag" v-if="info.couponType === 10"><i>{{info.couponTypeDesc}}</i></span>
          <span class="tag" v-if="info.couponType === 20"><i>{{info.couponTypeDesc}}</i></span>
          <span class="tag" v-if="info.couponType === 30"><i>{{info.couponTypeDesc}}</i></span>
          <span v-if="info.amountLimit ===0">无使用门槛</span>
          <span v-if="info.amountLimit !==0">满{{ info.amountLimit }}元可用</span>
          <p class="rule-time time-show">{{ info.validPeriodStart }}-{{ info.validPeriodEnd }}</p>
        </p>
        <div class="operation">
          <span class="money1 bq-f-size-14">￥<i class="get-Money">{{ info.faceValue }}</i></span>
          <!-- <span class="money1 bq-f-size-14"><span class="bq-f-size-36">9.5</span>折</span> -->
          <p v-if="info.couponStatus == 20" class="usered bq-f-size-12">已使用</p>
          <p v-if="info.couponStatus == 30" class="usered bq-f-size-12">已过期</p>
          <p v-if="info.couponStatus == 10" class="usered bq-f-size-12">未使用</p>
          <p v-if="info.couponStatus == 40" class="usered bq-f-size-12">已失效</p>
        </div>
      </div>
      <div class="dot">
        <i class="left"></i>
        <i class="right"></i>
      </div>
      <div class="footer">
        <p class="rule-time">
          <span class="seller-style">卖家优惠券：{{ info.sellerName }}</span>
          <a v-if="info.couponStatus != 20" :class="{active: showDetail}" @click="lookDetail">查看详情</a>
          <a v-if="info.couponStatus == 20" class="look-order" @click="lookOrder(info.orderId)">查看订单</a>
        </p>
        <ul v-if="showDetail" class="foot-ul">
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
export default {
  name: 'disabled-coupon-item',
  data() {
    return {
      index: 1,
      showDetail: false,
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
        {type: 2, name: '仅限部分分类下商品使'},
        {type: 3, name: '仅限部分商品使用'}
      ],
      payTypeList: [
        {type: 1, name: '所有支付方式'},
        {type: 2, name: '仅限在线支付'}
      ]
    }
  },
  props: {
    info: {}
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
    lookOrder(orderId) {
      this.$router.push('/order/detail/' + orderId)
      this.$store.commit('GET_ORDER_CONFIRM_STATUS', {})
    }
  }
}
</script>
<style lang="scss" scoped>
@import './coupon.scss';
.disabled-coupon {
  .content {
    .info {
      opacity: 0.3;
    }
    .rule {
      opacity: 0.3;
    }
    .operation {
      .money1 {
        padding-top: 8px;
        display: block;
        color: #ccc;
        .get-Money {
          font-size: 30px;
        }
      }
    }
  }
  .time-show {
    opacity: 0.3;
  }
  .footer {
    span {
      opacity: 0.3;
    }
  }
}
</style>
