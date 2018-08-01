<template>
  <bq-page class="select-coupon">
    <bq-header title="选择优惠券">
    </bq-header>
    <bq-tabs v-model="selected" class="coupon-tabs">
      <bq-tab id="1">
        可用的优惠券
      </bq-tab>
      <bq-tab id="2">
        不可用的优惠券
      </bq-tab>
    </bq-tabs>
    <bq-content class="content-style">
      <bq-tab-content v-model="selected" class="tab-content-box">
        <bq-tab-content-item id="1">
          <ul v-if="orderInfo.couponList">
            <li v-for="(item,index) in orderInfo.couponList.availableCouponList" :key="'coupon'+index">
              <i class="choose-tag" :class="{active: userCouponId == item.userCouponId}" @click="selectCoupon(item.userCouponId)"></i>
              <coupon-item :info="item" :tag="2"></coupon-item>
            </li>
          </ul>
          <div v-if="orderInfo.couponList && orderInfo.couponList.availableCouponList && orderInfo.couponList.availableCouponList.length <= 0" class="no-coupon">
            <img src="../../../../assets/img/coupon/no-coupon.png" alt="">
            <p class="bq-f-size-14">暂无可用优惠券</p>
          </div>
        </bq-tab-content-item>
        <bq-tab-content-item id="2">
          <ul v-if="orderInfo.couponList">
            <li v-for="(item,index) in orderInfo.couponList.unavailableCouponList" :key="'disabledCoupon'+index">
              <disabled-coupon-item :info="item"></disabled-coupon-item>
            </li>
          </ul>
          <p class="info-tip" v-if="orderInfo.couponList && orderInfo.couponList.unavailableCouponList && orderInfo.couponList.unavailableCouponList.length > 20">此处仅显示20张不可用优惠券，更多不可用优惠券</p>
          <p class="info-tip" v-if="orderInfo.couponList && orderInfo.couponList.unavailableCouponList && orderInfo.couponList.unavailableCouponList.length > 20">请到“我的>优惠券”页面中查看</p>
          <div v-if="orderInfo.couponList && orderInfo.couponList.unavailableCouponList && orderInfo.couponList.unavailableCouponList.length <= 0" class="no-coupon">
            <img src="../../../../assets/img/coupon/no-coupon.png" alt="">
            <p class="bq-f-size-14">暂无不可用优惠券</p>
          </div>
        </bq-tab-content-item>
      </bq-tab-content>
    </bq-content>
    <div class="go-btn bq-f-size-16" v-if="selected == 1">
      <button @click="sureSelect">确定</button>
    </div>
  </bq-page>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      selected: '1',
      userCouponId: ''
    }
  },
  computed: {
    ...mapState({
      orderInfo: state => state.confirmorder.orderInfo
    })
  },
  mounted () {
    if (!this.orderInfo.couponList) {
      window.history.back()
    } else {
      this.userCouponId = this.orderInfo.userCouponId
    }
  },
  methods: {
    selectCoupon(userCouponId) {
      if (this.userCouponId === userCouponId) {
        this.userCouponId = -1
      } else {
        this.userCouponId = userCouponId
      }
    },
    sureSelect() {
      let info = this.$bqUtils.copy(this.orderInfo)
      if (this.orderInfo.couponList.availableCouponList.length < 1) {
        info.userCouponId = ''
      } else {
        info.userCouponId = this.userCouponId
      }
      this.$store.commit('GET_ORDER_CONFIRM_STATUS', info)
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss">
@import 'scss/mixin';
@import 'scss/variables';
  .select-coupon {
    .bq-card:after {
      border-top: none;
      border-left: none;
      border-right: none;
    }
    .coupon-tabs {
      position: absolute;
      top: 45px;
      z-index: 100;
    }
    ul {
      margin-top: 53px;
      li {
        position: relative;
        .choose-tag {
          display: block;
          width: 16px;
          height: 16px;
          background: url(../../../../assets/img/coupon/no-choose.png) no-repeat;
          background-size: 100%;
          position: absolute;
          top: 7px;
          right: 24px;
          z-index: 10;
        }
        .choose-tag.active {
          background: url(../../../../assets/img/coupon/choose.png) no-repeat;
          background-size: 100%;
        }
      }
    }
    .info-tip {
      text-align: center;
      font-size: 15px;
      margin: 0 14px;
    }
    .no-coupon {
      margin-top: 105px;
      text-align: center;
      img {
        width: 130px;
        height: 130px;
        display: inline-block;
      }
      p {
        color: #666;
        margin-top: 20px;
        margin-bottom: 20px;
      }
    }
    .go-btn {
      width: 100%;
      text-align: center;
      position: absolute;
      z-index: 100;
      bottom: 0px;
      background: $bg-color;
      padding: 10px;
      button {
        width: 160px;
        height: 40px;
        line-height: 40px;
        color: #505050;
        background: #FFD520;
        border-radius: 2px;
      }
    }
    .content-style {
      margin-bottom: 60px;
    }
  }
</style>
