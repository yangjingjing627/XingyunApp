<template>
  <div class="good-detail">
    <bq-header title="商品详情" v-if="type === 'page'">
      <bq-button slot="right" @click="$router.push('/cart')">
        <i class="bq-icon-cart-black" :class="[{'is-cart': cartCount>0}]"></i>
        <cart-count></cart-count>
      </bq-button>
    </bq-header>
    <bq-header title="商品详情" v-else :is-left="true">
      <bq-button slot="left" @click="closeOpen">
        关闭
      </bq-button>
      <bq-button slot="right" @click="goCart">
        <i class="bq-icon-cart-black" :class="[{'is-cart': cartCount>0}]"></i>
        <cart-count></cart-count>
      </bq-button>
    </bq-header>
    <bq-content has-footer>
      <div class="good-detail__header">
        <!-- <img v-lazy="good.image" > -->
        <div class="number">
          {{ bannerNumber }}/{{ good.imageList.length }}
        </div>
        <bq-swipe :showIndicators="false" :auto="0" class="detail-banner" @change="changeBanner">
          <bq-swipe-item v-for="(item,index) in good.imageList" :key="'banner'+index">
            <a>
              <img class="banner-bg" :src="item || 'http://ogd5wcvme.bkt.clouddn.com/no-img.png'" >
            </a>
            <!-- {{ changeBanner(index)}} -->
          </bq-swipe-item>
        </bq-swipe>
      </div>
      <div class="good-detail__desc">
        <h5>
          <yc-mkt-label v-if="ycActivity.activityType === 20" type="chuxiao" size="max"></yc-mkt-label>
          <yc-mkt-label v-if="ycActivity.activityType === 50 && ycActivity.changeType === 1" type="zuhe"></yc-mkt-label>
          <yc-mkt-label v-if="ycActivity.activityType === 60 && ycActivity.changeType === 1" type="zhijiang"></yc-mkt-label>
          {{ good.goodsName }}
        </h5>
        <p>
          <span class="price money">
            ¥ <strong>{{ good.price.toFixed(2) }}</strong>
            <i class="qi" v-if="good.storeList.length - 1 > 0">起</i>
          </span>
          <span v-if="good.suggestedRetailPrice && good.suggestedRetailPrice > good.price" class="suggest-price">建议零售价:&nbsp;<i class="">¥&nbsp;{{ good.suggestedRetailPrice.toFixed(2) }}</i></span>
        </p>
      </div>
      <div class="good-detail__info">
        <p>商品条码：{{ good.sku }}</p>
        <p>规格：{{ good.specName1 || '无' }}</p>
        <p>单位：{{ good.specName2|| '无' }}</p>
        <p>品牌：{{ good.brand || '无'}}</p>
      </div>
      <section class="good-detail__content">
        <div class="good-detail__content__header">
          商品图文详情
        </div>
        <div v-if="good.description"  v-html="good.description" class="good-detail__content__desc"></div>
        <div v-if="!good.description" class="no-desc">暂无商品详情<br><br><br></div>
      </section>
    </bq-content>
    <bq-footer ref="footer">
      <seller :seller="good.storeList[0] || {}" :sku="good.sku" type="goodsDetail"></seller>
      <bq-collapse v-if="good.storeList.length - 1 > 0" >
        <bq-collapse-content>
          <seller v-for="(seller, index) in storeList" :key="seller.sellerId" :seller="seller" :sku="good.sku" type="goodsDetail"></seller>
        </bq-collapse-content>
        <bq-collapse-header>此商品还有<span class="price money">{{ good.storeList.length - 1 }}个</span>卖家在供货</bq-collapse-header>
      </bq-collapse>
    </bq-footer>
  </div>
</template>
<script>
import GoodService from '@/services/goods.service'
import OrderCartService from '@/services/order.cart.service'
import modifyCart from '@/components/modify/modify.cart'
import Seller from './common/seller.vue'
import MktMixin from '@/mixins/mkt.mixin'

export default {
  name: 'detail',
  mixins: [ MktMixin ],
  data() {
    return {
      good: {
        price: 0,
        suggestedRetailPrice: 0,
        storeList: [],
        imageList: []
      },
      href: '',
      bannerNumber: 1
    }
  },
  props: {
    sku: {},
    sellerId: {},
    type: {
      type: String,
      default: 'page'
    }
  },
  async created() {
    // 兼容安卓返回按钮 虚拟url
    this.href = window.location.href
    window.history.pushState(null, null, window.location.href)
    window.addEventListener('popstate', this.listenBack, false)
    this.GoodService = new GoodService()
    this.OrderCartService = new OrderCartService()
    let params = {sku: this.sku}
    if (this.sellerId) {
      params.sellerId = this.sellerId
    }
    try {
      let res = await this.GoodService.getDetail(params, {isAutoMsg: false})
      this.good = res
      if (res.imageList && res.imageList.length > 0) {
        this.good.imageList = res.imageList
      } else {
        this.good.imageList = ['http://ogd5wcvme.bkt.clouddn.com/no-img.png']
      }
      this.getActivityRule(this.good.storeList)
    } catch (error) {
      // 如果是商品不存在单独处理 弹窗关闭 连接返回
      // let {code} = error
      await this.$messagebox.alert('商品害羞了，不敢与您见面，请稍后再试！')
      if (this.type === 'modal') {
        // this.$emit('close')
        this.close()
        return
      }
      this.$router.go(-1)
      return

    }
    let {cartCount} = await this.OrderCartService.getCartCount()
    this.cartCount = cartCount
  },
  computed: {
    cartCount() {
      return window.store.state.cart.cartCount
    },
    storeList() {
      return this.good.storeList.filter((item, index) => index !== 0)
    }
  },
  methods: {
    goCart() {
      this.close()
      window.router.push('/cart')
      // this.$emit('close')
    },
    listenBack () {
      // window.history.pushState(null, null, this.href)
      if (window.store.state.combin.pageStatus) {
        return
      }
      this.close()
    },
    close () {
      this.$emit('close', this.listenBack)
    },
    closeOpen () {
      window.history.go(-1)
    },
    changeBanner (index) {
      this.bannerNumber = index + 1
    }
  },
  components: {
    modifyCart,
    seller: Seller
  },
  beforeDestroy() {
    this.$ding.close()
  }
}
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  .good-detail {
    width: 100%;
    height: 100%;
    background-color: #fff;
    .bq-header {
      height: 45px;
      .mint-header-button.is-right {
        button.mint-button {
          width: 80px;
          text-align: right;
          .is-cart {
            margin-right: 18px;
          }
        }
      }
    }
    .mint-button-text {
      position: relative;
      @include font-dpr(14px);
      .badge {
        position: absolute;
        right: 0;
        top: -5px;
      }
    }
    .bq-content {
      &[has-footer] {
        .scroller {
          padding-bottom: 100px;
        }
      }
    }
    &__header {
      width: 100%;
      height: 302px;
      @include border-bottom($border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      .detail-banner{
        width: 288px;
        margin: 0 auto;
      }
      .number{
        position: absolute;
        bottom: 6px;
        z-index: 10;
        min-width: 40px;
        height: 22px;
        line-height: 22px;
        @include font-dpr(14px);
        color: #fff;
        background: rgba(0,0,0,0.25);
        border-radius: 25px;
        text-align: center;
        right: 20px;
      }
      img {
        width: 288px;
        height: 288px;
      }
    }

    &__desc {
      padding: 12px 12px 10px 12px;
      @include border-bottom($border-color);
      h5 {
        max-height: 44px;
        @include font-dpr(16px);
        color: $font-color;
        letter-spacing: -0.39px;
        line-height: 22px;
        @include ext-overflow(2);
      }
      p {
        height: 30px;
        line-height: 30px;
        @include font-dpr(13px);
        color: #666;
        .price {
          strong {
            @include font-dpr(20px);
            letter-spacing: -0.48px;
          }
        }
        .suggest-price {
          padding-left: 30px;
        }
      }
    }

    &__info {
      padding: 15px 12px;
      p {
        min-height: 20px;
        line-height: 20px;
        @include font-dpr(13px);
        color: #999999;
        letter-spacing: -0.31px;
        .specname {
          display: inline-block;
          padding-left: 20px;
        }
        word-break: break-all;
      }

    }

    &__content {
      &__header {
        background: #FBF9F1;
        width: 100%;
        height: 35px;
        line-height: 35px;
        @include font-dpr(15px);
        color: $font-color;
        padding-left: 12px;
        position: relative;
      }
      &__desc {
        img {
          margin:0 auto;
          width: 100%;
          height: 100%;
        }
      }
      .no-desc {
        padding: 12px;
      }
    }

    .bq-footer {
      // min-height: 58px;
      height: auto;
      z-index: 2500;
      border-top: 1px solid $light-border-color;
      .bq-callapse-header {
        height: 40px;
      }
    }
    .good-detail-footer {
      padding: 12px 15px;
      // height: 34px;
      background-color: #fff;
      position: relative;
      @include border-bottom(#d8d8d8);
      // display: flex;
      &_desc {
        // flex: 1;
        p {
          @include font-dpr(12px);
          color: $font-color;
          .order-unit {
            padding-left: 48px;
          }
        }
        .buyname {
          @include text-overflow-1;
          color: #333;
          @include font-dpr(14px);
          padding-right: 100px;
        }
        .maizeng {
          margin-left: -7px;
          color: #FF4E13;
          @include font-dpr(12px)
        }
      }
      &_btn {
        // display: flex;
        .modify {
          bottom: 10px;
        }
      }
    }
    .money {
      color: $price;
      font-weight: 600;
      i{
        @include font-dpr(16px);
      }
      i.qi{
        font-weight: 500;
      }
    }
    .order-unit{
      color: #666;
      @include font-dpr(12px);
    }
    .o-price {
      padding-left: 5px;
      @include font-dpr(12px); /*no*/
      color: #999999;
      text-decoration: line-through;
    }
  }
</style>
