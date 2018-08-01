<template>
  <bq-page class="bq-order-confirm">
   <bq-header title="确认订货单" class="bq-nobottom-border"></bq-header>
   <bq-content has-footer>
      <bq-card class="card-store">
        <bq-card-content padding>
          <span>{{ goodinfo.storeName }}</span>
          <span>{{ goodinfo.storePhone }}</span>
          <p>{{ goodinfo.storeAddress }}</p>
        </bq-card-content>
      </bq-card>
      <bq-card margin-top>
        <bq-card-header title="进货列表"></bq-card-header>
          <bq-card-item padding :icon="true" @click.native="goImgList">
            <span slot="right" class="bq-f-size-12">共<b>{{goodinfo.goodsKindNum }}</b>种，总数{{goodinfo.goodsTotalNum}}</span>
              <item-img :getGoodImg= "goodinfo.goodsList"></item-img>
          </bq-card-item>
      </bq-card>
      <bq-card margin-top>
        <bq-card-header title="送达时间"></bq-card-header>
        <bq-card-item class="bq-top" :icon="true" @click="timeSelect">
          <bq-button  size="large" @click="timeSelect"><span>({{ $bqUtils.dateFormat(dateValue, 'yyyy年MM月dd日 ') }})</span></bq-button>
        </bq-card-item>
      </bq-card>
      <bq-card margin-top>
        <bq-card-header title="备注信息"></bq-card-header>
        <bq-card-input  padding type="textarea" class="ipt-textarea" :maxlength="textMaxLength" v-model="remark"></bq-card-input>
        <!-- <span class="remark-count" :class="{full: remark.length === textMaxLength}">{{remark.length}}/{{textMaxLength}}</span> -->
      </bq-card>
      <bq-card margin-top>
        <bq-card-item padding no-margin :icon="payTypes.length > 1">
          支付方式
          <span v-if="payTypes.length == 1" slot="right">{{ payTypeName }}</span>
          <span v-if="payTypes.length > 1" slot="right" class="btn" @click="choosePayWay()">{{ payTypeName }}</span>
        </bq-card-item>
      </bq-card>
      <bq-card>
        <bq-card-item padding no-margin :icon="true" @click.native="goSelectCoupon()">
          使用优惠券
          <span slot="right" class="coupon-info bq-f-size-12">
            <i v-if="goodinfo.couponMoney">已选择1张，抵扣{{ goodinfo.couponMoney }}元</i>
            <i v-if="this.couponId == -1 && goodinfo.couponList">{{ goodinfo.couponList.availableCouponList.length }}张</i>
            <i v-if="!goodinfo.couponMoney && this.couponId != -1">暂无可用优惠券</i>
          </span>
        </bq-card-item>
      </bq-card>
      <bq-card margin-top>
        <bq-card-header title="金额明细"></bq-card-header>
        <bq-card-content padding>
          <p>商品总价格：<span><i>¥</i>{{ $bqUtils.moneyFixed(goodinfo.totalPrice) }}</span></p>
          <p v-if="goodinfo.carriageMoney">配送费用：<span><i>+ ¥</i>{{ $bqUtils.moneyFixed(goodinfo.carriageMoney) }}</span>
            <a @click="lookFareDetail()" class="d-price bq-f-size-12 fare-detail">查看运费明细</a>
          </p>
          <p v-if="goodinfo.couponMoney">优惠券：<span><i>- ¥</i>{{ $bqUtils.moneyFixed(goodinfo.couponMoney) }}</span></p>
          <p v-if="goodinfo.fullCutMoney">满减优惠：<span class="d-price"><i>¥</i>{{ $bqUtils.moneyFixed(goodinfo.fullCutMoney) }}</span></p>
          <p v-if="goodinfo.discountMoney">促销优惠：<span class="d-price"><i>¥</i>{{ $bqUtils.moneyFixed(goodinfo.discountMoney) }}</span></p>
          <p v-if="goodinfo.fullCountMoney">满件优惠：<span class="d-price"><i>¥</i>{{ $bqUtils.moneyFixed(goodinfo.fullCountMoney) }}</span></p>
          <p v-if="goodinfo.groupCountMoney">组合优惠：<span class="d-price"><i>¥</i>{{ $bqUtils.moneyFixed(goodinfo.groupCountMoney) }}</span></p>
          <p v-if="goodinfo.singleCountMoney">直降优惠：<span class="d-price"><i>¥</i>{{ $bqUtils.moneyFixed(goodinfo.singleCountMoney) }}</span></p>
        </bq-card-content>
      </bq-card>
    </bq-content>
    <footer class="bq-order-footer" align="right">
      <span class="should-pay bq-f-size-14">应付款：<span class="d-price bq-f-size-20"><i class="bq-f-size-14">¥</i>{{ $bqUtils.moneyFixed(goodinfo.shouldPayPrice) }}</span></span>
      <bq-button class="bq-footer-button" @click.native="submit()">提交订单</bq-button>
    </footer>
    <bq-datetime-picker
      ref="datePicker"
      type="date"
      v-model="pickerValue"
      :startDate="startDate"
      :endDate ="endDate"
      @confirm="onConfirm">
    </bq-datetime-picker>
    <order-confirm-list :getGoodImg="goodinfo.goodsList" v-model="isProductList"></order-confirm-list>
    <fare-detail :getFareDetail="carriageInfo" v-model="isFareDetail"></fare-detail>
    <bq-popup v-model="popup_name" position="bottom" closeOnClickModal="true" popup-transition="popup-fade">
      <div class="popup-content">
        <ul>
          <li v-if="getName(item)" v-for="item,index in payTypes" :key="index" :id="item" @click="selectKeep(item)">{{ getName(item) }}</li>
        </ul>
      </div>
    </bq-popup>
  </bq-page>
</template>
<script>
import OrderConfirmService from '../order.confirm.service'
import { mapState } from 'vuex'
import { Popup } from 'mint-ui'

export default {
  data() {
    return {
      payTypes: [],
      goodinfo: {
        payTypes: [],
        goodsList: []
      },
      selected: '',
      remark: '',
      pickerValue: '2017-07-22',
      startDate: new Date(Date.now() + 86400000),
      endDate: new Date(Date.now() + 7 * 86400000),
      dateValue: '',
      shouldPayPrice: '',
      isProductList: false,
      textMaxLength: 100,
      popup_name: false,
      payTypeName: '',
      getInfoTag: true,
      isFareDetail: false,
      carriageInfo: {},
      couponId: ''
    }
  },
  computed: {
    ...mapState({
      orderInfo: state => state.confirmorder.orderInfo
    })
  },
  mounted() {
    this.goodId = this.$route.query.goodId
    this.sellerId = this.$route.query.sellerId
    if (this.orderInfo.userCouponId) {
      this.couponId = this.orderInfo.userCouponId
    }
    if (this.orderInfo.payType) {
      this.selected = this.orderInfo.payType
    }
    this.OrderConfirmService = new OrderConfirmService()
    this.getOrderInfo()
    this.pickerValue = this.$bqUtils.dateFormat(new Date(Date.now() + 86400000), 'yyyy-MM-dd')
    this.dateValue = this.pickerValue
    if (this.orderInfo.dateValue) {
      this.pickerValue = this.orderInfo.dateValue
      this.dateValue = this.orderInfo.dateValue
    }
    if (this.orderInfo.remark) {
      this.remark = this.orderInfo.remark
    }
  },
  methods: {
    lookFareDetail() {
      this.isFareDetail = true
    },
    goSelectCoupon() {
      this.getInfoTag = false
      let info = {
        payType: this.selected,
        goodsIds: this.goodId,
        sellerId: this.sellerId,
        dateValue: this.dateValue,
        remark: this.remark,
        userCouponId: this.goodinfo.userCouponId,
        couponList: this.goodinfo.couponList
      }
      this.$store.commit('GET_ORDER_CONFIRM_STATUS', info)
      this.$router.push('/order/select/coupon')
    },
    choosePayWay() {
      this.popup_name = !this.popup_name
    },
    selectKeep (item) {
      this.popup_name = false
      this.selected = item
      this.payTypeName = this.getName(item)
      this.getOrderInfo()
    },
    onConfirm() {
      this.dateValue = this.pickerValue
    },
    getName (index) {
      if (index === 3) {
        return '余额支付'
      } else if (index === 4) {
        return '货到付款'
      }
    },
    goImgList () {
      this.isProductList = true
    },
    getOrderInfo() {
      let self = this
      let params = {
        goodsIds: this.goodId,
        sellerId: this.sellerId
      }
      if (this.selected) {
        params.payType = this.selected
      }
      if (this.couponId) {
        params.userCouponId = this.couponId
      }
      self.OrderConfirmService.getOrderConfirm(params).then(res => {
        self.getCarriageDetail()
        self.goodinfo = res
        self.shouldPayPrice = this.goodinfo.shouldPayPrice
        self.payTypes = this.goodinfo.payTypes
        self.selected = this.goodinfo.payType
        self.payTypeName = self.getName(this.goodinfo.payType)
      })
    },
    // 获取运费明细
    async getCarriageDetail() {
      let params = {
        goodsIds: this.goodId,
        sellerId: this.sellerId
      }
      let res = await this.OrderConfirmService.getCarriageDetail(params)
      if (!res) {
        return
      }
      this.carriageInfo = res
    },
    async submit () {
      if (this.remark.length > 100) {
        this.$toast('备注信息不能大于100字')
        return
      }
      let picker = this.$bqUtils.dateFormat(this.pickerValue, 'yyyy-MM-dd')
      if (!picker) {
        this.$toast('选择送货时间')
        return
      }
      let params = {
        goodsIds: this.goodId,
        sellerId: this.sellerId,
        sendTime: picker,
        payType: this.selected,
        payPrice: this.shouldPayPrice,
        remark: this.remark,
        orderChannel: 3,
        fullCutPrice: this.goodinfo.fullCutPrice,
        discountPrice: this.goodinfo.discountPrice,
        fullCountMoney: this.goodinfo.fullCountMoney,
        isOriginalPrice: 0
      }
      if (this.goodinfo.couponMoney) {
        params.couponMoney = this.goodinfo.couponMoney
      }
      if (this.goodinfo.userCouponId) {
        params.userCouponId = this.goodinfo.userCouponId
      }
      try {
        await this.getPayWay(params)
      } catch (e) {
        if (e.data) {
          let diffStatus = e.data.diffStatus
          let validGoods = e.data.validGoods
          // 针对京东商品差价数据
          if (diffStatus === 1 || diffStatus === 2 || diffStatus === 3) {
            this.$messagebox.confirm(e.message, '', {
              confirmButtonClass: 'bq-msg-confirm-ok',
              confirmButtonText: '继续提交',
              cancelButtonClass: 'bq-msg-confirm-cancel',
              cancelButtonText: '取消'
            }).then(() => {
              let params = {
                goodsIds: validGoods, // 此处返回的id是后台返回的是可以处理的（后台返回的数据是去掉有差异之后的数据）
                sellerId: this.sellerId,
                sendTime: picker,
                payType: this.selected,
                payPrice: this.shouldPayPrice,
                remark: this.remark,
                receiveChangePrice: 1,
                orderChannel: 3
              }
              try {
                this.getPayWay(params)
              } catch (e) {
                this.$messagebox.alert(e.message)
              }
            })
          } else if (diffStatus === 4) {
            this.$messagebox.alert(e.message, '', {
              confirmButtonText: '重新选购'
            }).then(() => {
              this.$router.push('/home')
            })
          }
        } else {
          this.$messagebox.alert(e.message)
        }
      }
    },
    async getPayWay(params) {
      let res = await this.OrderConfirmService.submitOrder(params)
      if (this.selected === 3) {
        // 余额支付
        let url = '/order/pays/' + res.orderId + '/3'
        this.$router.replace(url)
      } else {
        // 货到付款
        this.$router.replace('/order/pay/success/' + res.orderCode + '/' + res.orderId)
      }
    },
    timeSelect() {
      this.$refs.datePicker.open()
    }
  },
  beforeDestroy() {
    this.$messagebox.close()
    if (this.getInfoTag) {
      this.$store.commit('GET_ORDER_CONFIRM_STATUS', {})
    }
  },
  components: {
    bqPopup: Popup
  }
}
</script>
<style lang="scss">
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
.bq-order-confirm{
  p{
    @include font-dpr(14px);
  }
  .bq-notop-border{
    border-bottom: 1px solid #fff;
  }
  .mint-button-text{
    @include font-dpr(14px);
  }
  .bq-top {
    height: 44px;
  }
  .bq-card-item__info{
    flex: 4;
    @include font-dpr(14px);
    color: $font-color;
  }
  .mint-button--default{
    text-align: left;
    border: none;
  }
  img{
    width: 70px;
    height: 60px;
  }
  .bq-order-footer{
    border-bottom: 0;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: $card-footer-height;
    border: 1px solid $light-border-color;
    z-index: 2;
    background: #fff;
    .bq-footer-button{
      width: 140px;
      text-align: center;
      cursor: pointer;
      height: $card-footer-height;
      background: $primary;
    }
  }
  .bq-card-item__right {
    -webkit-flex: none;
    flex: none;
  }
  .mint-tabbar{
    position: static;
    border: 1px solid #fff;
    height: 30px;
    border-bottom: 0;
  }
  .mint-tabbar .mint-tab-item{
    display: inline-block;
    width: 120px;
    border: 1px solid $primary;
    margin: 0 10px;
    padding:8px 0;
    flex:none;
  }
  .mint-tabbar > .mint-tab-item.is-selected .mint-tab-item-label{
    position: static;
  }
  .mint-tabbar > .mint-tab-item.is-selected .mint-tab-item-label:after{
    background-color: inherit;
  }
  .mint-tabbar > .mint-tab-item.is-selected{
    background:$primary;
    border-radius: 1px;
    color: inherit;
    @include font-dpr(14px);
    .mint-tab-item-label{
      color: $font-color;
    }
  }
  .btn-box {
    .mint-tabbar {
      align-items: center;
      justify-content: initial;
    }
  }
  .card-store {
    &:after {
      border-top: none;
    }
    span{
      @include font-dpr(14px);
      margin-right: 40px;
    }
    span:nth-child(2) {
      margin-right: 0
    }
    p {
      margin-top: 4px;
    }
  }
  .bq-card[margin-top] {
    margin-top: 10px;
  }
  .item-imglist {
    // width: 68px;
    height: 58px;
    margin-left: 0;
  }
  .remark-count {
    float: right;
    margin-right: 15px;
    @include font-dpr(14px);
    &.full {
      color: #FF4E13;
    }
  }
  .ipt-textarea {
    &:after {
      content: none;
    }
  }
  .should-pay {
    @include font-dpr(14px);
    margin-left: 15px;
    line-height: 50px;
    float: left;
  }
  .coupon-info {
    color: $coupon-color;
  }
  .popup-content {
    width: 375px;
    color: #505050;
    text-align: center;
    &::-webkit-scrollbar {
        display: none;
    }
    li{
      height: 45px;
      line-height: 45px;
      padding-left: 20px;
      border-bottom: 0.5px solid #ccc;
    }
    li:hover{
      background: $primary;
    }
  }
  .fare-detail {
    position: relative;
    z-index: 10000;
    margin-left: 20px;
  }
}
</style>
