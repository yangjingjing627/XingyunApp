<template>
  <bq-page class="coupon-center">
    <bq-header title="领券中心">
    </bq-header>
    <bq-content>
      <ul v-infinite-scroll="loadMore"
          infinite-scroll-disabled="hasNext"
          infinite-scroll-distance="50"
          infinite-scroll-check-load="true">
        <li v-for="(item,index) in list" :key="'coupon'+index">
          <coupon-item :info="item" :tag="1"></coupon-item>
        </li>
        <div class="bq-f-loading" v-show="isReq">
          <bq-triple-bounce></bq-triple-bounce>
        </div>
      </ul>
      <div v-if="list.length <= 0 && !isReq" class="no-coupon">
        <img src="../../../../assets/img/coupon/no-coupon.png" alt="">
        <p class="bq-f-size-14">暂无优惠券</p>
      </div>
    </bq-content>
    <bq-footer>
      <div class="go-btn bq-f-size-16">
       <button @click="$router.push(`/me/coupon`)">我的优惠券</button>
     </div>
    </bq-footer>
  </bq-page>
</template>
<script>
import CouponService from '@/services/coupon.service.js'
export default {
  data() {
    return {
      list: [],
      hasNext: false,
      isReq: false,  // 是否处于加载状态
      pageSize: 10,
      next: 0
    }
  },
  mounted () {
    this.CouponService = new CouponService()
    this.loadMore()
  },
  methods: {
    // 获取列表数据
    async loadMore () {
      if (this.isReq || this.hasNext) {
        return
      }
      this.isReq = true
      let params = {}
      if (this.$route.params.activityId) {
        params.activityId = this.$route.params.activityId
      }
      params.next = this.next
      params.pageSize = this.pageSize
      let res = null
      res = await this.CouponService.couponCenter(params)
      res.list.forEach(item => {
        this.list.push(item)
      })
      if (!res.next) {
        this.hasNext = true
        this.isReq = false
        return
      }
      this.next = res.next
      this.hasNext = false
      this.isReq = false
    }
  }
}
</script>
<style lang="scss">
@import 'scss/mixin';
@import 'scss/variables';
  .coupon-center {
    ul {
      margin-top: 10px;
      margin-bottom: 70px;
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
  }
</style>
