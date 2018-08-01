<template>
  <bq-page class="bq-pay-success">
  <bq-header title="订货成功"></bq-header>
   <bq-content>
     <div class="bq-success">
        <img :src="successSrc"/>
        <p>订单编号:{{ orderCode }}</p>
        <a :href="'/order'">查看订单</a>
      </div>
    <bq-button type="primary" size="large" class="bq-btn-login" @click.native="goOnBooK()">继续订货</bq-button>
    </bq-content>
    <user-gifts v-if="showGifts" :info="giftsInfo" :type="orderType" :tagShow="tagShow" @closeDialog="closeGiftsDialog" @Rotate="Rotate"></user-gifts>
  </bq-page>
</template>
<script>
import successSrc from 'assets/img/login/chengong.png'
import OrderConfirmService from '../order.confirm.service'
export default {
  data() {
    return {
      successSrc: successSrc,
      orderCode: this.$route.params.orderCode,
      order_id: this.$route.params.orderid,
      showGifts: false,
      orderType: 6,
      tagShow: {
        isRotate: false,
        couponShow: false,
        failShow: false
      },
      giftsInfo: {
        // couponList: [
        //   {
        //     couponType: 10,
        //     couponName: '123'
        //   },
        //   {
        //     couponType: 10,
        //     couponName: '123'
        //   }
        // ]
      }
    }
  },
  computed: {
  },
  mounted () {
    this.OrderConfirmService = new OrderConfirmService()
    // if (this.orderCode) {
    //   this.showGifts = true
    // }
    this.init()
    // console.log(this.order_id)
  },
  methods: {
    async init () {
      let params = {
        orderId: this.order_id
      }
      try {
        let res = await this.OrderConfirmService.isActivity(params)
        if (res.hasActivity === 1) {
          this.showGifts = true
        } else {
          this.showGifts = false
        }
      } catch (e) {
        this.$messagebox.alert(e.message)
      }
    },
    goOnBooK() {
      this.$router.push('/category')
    },
    closeGiftsDialog () {
      this.giftsInfo = {}
      this.showGifts = false
    },
    async Rotate () {
      let self = this
      let params = {
        orderId: self.order_id,
        client: 10
      }
      try {
        let res = await self.OrderConfirmService.openRedBag(params)
        self.giftsInfo = res
        if (this.giftsInfo.couponList.length > 0) {
          self.tagShow.isRotate = false
          self.tagShow.couponShow = true
        } else {
          self.tagShow.isRotate = false
          self.tagShow.failShow = true
          self.tagShow.couponShow = false
        }
      } catch (e) {
        self.tagShow.isRotate = false
        self.tagShow.failShow = true
        self.tagShow.couponShow = false
        // self.$messagebox.alert(e.message)
      }
    }
  }
}
</script>
<style lang="scss">
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
.bq-pay-success{
  box-sizing: border-box;
  padding: 0 20px;
  text-align: center;
  .bq-success{
    width: 100%;
    margin-bottom: 60px;
    margin: 0 auto;
   img{
      width: 102px;
      height: 102px;
      margin: 39px auto 29px;
      display: inline-block;
    }
    p{
      @include font-dpr(16px);
      color: $font-color;
      padding: 30px 0;
      padding-top: 0;
    }
    a{
      @include font-dpr(14px);
      color: #FF8113;
      border-bottom: 1px solid #FF8113;
    }
  }
  .bq-btn-login{
    display: inline-block;
    width: 90%;
    margin: 0 auto;
    margin-top: 8px;
    @include font-dpr(14px);
    color: $font-color;
  }
}
</style>
