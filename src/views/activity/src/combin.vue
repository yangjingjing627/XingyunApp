<template>
  <div class="combin-master">
    <bq-header title="优惠套餐组合" :is-left="true">
      <bq-button slot="left" @click="closeOpen">
        关闭
      </bq-button>
      <bq-button slot="right" @click="goCart">
        <i class="bq-icon-cart-black"></i>
        <cart-count></cart-count>
      </bq-button>
    </bq-header>
    <bq-content>
      <bq-good-content
        v-if="combinGoods.length"
        infinite-scroll-disabled="false"
        infinite-scroll-distance="50"
        infinite-scroll-immediate-check = false>
        <bq-good-item
          class="home-goods-item"
          v-for="good in combinGoods"
          :key="good.sku"
          type="combinPage"
          :good="good">
        </bq-good-item>
      </bq-good-content>
      <div class="other">
      </div>
      <bq-good-content
        v-if="otherGoods.length"
        infinite-scroll-disabled="false"
        infinite-scroll-distance="50"
        infinite-scroll-immediate-check = false>
        <bq-good-item
          class="home-goods-item"
          v-for="good in otherGoods"
          :key="good.sku"
          type="combinPage"
          :good="good">
        </bq-good-item>
      </bq-good-content>
    </bq-content>
    <bq-footer>
      <div class="combin-footer">
        <span>共{{ tatal }}种商品</span>
        <span>比原价单独购买最少优惠 <i>{{ discount }}</i> 元</span>
        <a @click="addAll">一键订购</a>
      </div>
    </bq-footer>
  </div>
</template>
<script>
import GoodService from '@/services/goods.service'
import CartCount from '@/components/modify/cart.count.js'
import OrderCartService from '@/services/order.cart.service'

export default {
  name: 'combin',
  mixins: [ CartCount ],
  data() {
    return {
      combinGoods: [],
      otherGoods: [],
      discount: 0,
      href: '',
      activityId: '',
      groupId: ''
    }
  },
  props: {
    sku: {},
    sellerId: {}
  },
  computed: {
    tatal() {
      return this.combinGoods.length + this.otherGoods.length
    }
  },
  mounted () {
    // 兼容安卓返回按钮 虚拟url
    this.href = window.location.href
    // console.log(this.href)
    window.history.pushState(null, null, this.href)
    window.addEventListener('popstate', this.combinListenBack, false)
    this.GoodService = new GoodService()
    this.OrderCartService = new OrderCartService()
    this.init()
  },
  methods: {
    async getCartCount () {
      let {cartCount} = await this.OrderCartService.getCartCount()
      window.store.commit('GET_CART_COUNT', cartCount)
    },
    goCart() {
      // detail.closeAll()
      // this.close()
      // window.router.push('/cart')
      window.location.href = '/cart'
    },
    close () {
      this.$emit('close', this.combinListenBack)
    },
    combinListenBack () {
      this.close()
    },
    closeOpen () {
      window.history.go(-1)
      // this.close()
    },
    async init () {
      let params = {
        sellerId: this.sellerId,
        spu: this.sku
      }
      this.combinGoods = []
      this.otherGoods = []
      let res = await this.GoodService.combinPackages(params)
      this.discount = res.discountsTotalPrice
      this.activityId = res.activityId
      this.groupId = res.groupId
      res.storeList.forEach(item => {
        this.synCount({goodsId: item.goodsId, count: item.cartCount}, 'combinPage')
        if (item.activityType !== 50) {
          return
        }
        let rule = this.$bqUtils.jsonParse(item.activityRule)
        let changePrice = rule.changePrice ? rule.changePrice : 0
        // 1 是降价 2 涨价 0 不变价
        if (rule.changeType === 1) {
          let price = this.$bqUtils.moneyFixed(item.price - changePrice)
          item.price = price > 0 ? price : 0
        } else {
          let price = this.$bqUtils.moneyFixed(item.price + changePrice)
          item.price = price > 0 ? price : 0
        }
      })
      res.choiceList.forEach(item => {
        item.storeList.forEach(good => {
          this.synCount({goodsId: good.goodsId, count: good.cartCount}, 'combinPage')
          if (good.activityType !== 50) {
            return
          }
          let rule = this.$bqUtils.jsonParse(good.activityRule)
          let changePrice = rule.changePrice ? rule.changePrice : 0
          // 1 是降价 2 涨价 0 不变价
          if (rule.changeType === 1) {
            let price = this.$bqUtils.moneyFixed(good.price - changePrice)
            good.price = price > 0 ? price : 0
          } else {
            let price = this.$bqUtils.moneyFixed(good.price + changePrice)
            good.price = price > 0 ? price : 0
          }
        })
      })
      this.combinGoods.push(res)
      this.otherGoods = res.choiceList
    },
    async addAll () {
      let params = {
        activityId: this.activityId,
        groupId: this.groupId
      }
      try {
        await this.GoodService.combinPackagesAdd(params)
        this.$toast('订购成功')
      } catch (e) {
        console.log(e)
      } finally {
        this.init()
        this.getCartCount()
      }
    }
  },
  beforeDestroy() {
    this.$ding.close()
  }
}
</script>
<style lang="scss">

@import 'scss/variables.scss';
@import 'scss/mixin.scss';
.combin-master{
  width: 100%;
  height: 100%;
  background: $bg-color;
  .bq-header {
    height: 45px;
    .mint-header-button.is-right {
      button.mint-button {
        width: 80px;
        text-align: right;
        .mint-button-text{
          padding-right: 15px;
        }
        .badge{
          position: absolute;
          top: 5px;
          right: 0px;
        }
      }
    }
  }
  .bq-content{
    bottom: 52px;
  }
  .other{
    width: 100%;
    height: 36px;
    line-height: 36px;
    position: relative;
    color: #505050;
    &:before{
      content: "组合优惠必选商品";
      @include font-dpr(14px);
      position: absolute;
      height: 20px;
      line-height: 20px;
      top: 4px;
      width: 130px;
      left: 50%;
      margin-left: -65px;
      background: $bg-color;
      z-index: 5;
      text-align: center;
    }
    &:after{
      content: "";
      position: absolute;
      top: 14px;
      height: 1px;
      width: 220px;
      left: 50%;
      margin-left: -110px;
      background: #505050;
    }
  }
  .combin-footer{
    width: 100%;
    padding: 6px 120px 0px 15px;
    box-sizing: border-box;
    height: 52px;
    border-top: 1px solid #d8d8d8;
    position: relative;
    span{
      display: block;
      @include font-dpr(13px);
      line-height: 19px;
      color: #666;
      i{
        color: #FF4E13;
      }
    }
    a{
      position: absolute;
      width: 120px;
      // height: 50px;
      display: block;
      background: $primary;
      @include font-dpr(16px);
      color: #505050;
      bottom:0;
      right: 0;
      top: 0;
      z-index: 9;
      line-height: 50px;
      text-align: center;
    }
  }
}
</style>
