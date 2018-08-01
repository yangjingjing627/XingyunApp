<template>
  <li class="bq-list-item">
    <div class="info" :class="{'yc-seller-info': sellerId}" @click="onDetail(good.sku)">
      <div class="img">
        <!-- <yc-mkt-discount v-if="chuxiao"></yc-mkt-discount> -->
        <yc-activity-icon
          v-if="ycActivity.activityType"
          :ycActivity="ycActivity"
          :type="type"
        ></yc-activity-icon>
        <img v-lazy="good.goodsImage || good.defaultImage" alt="">
        <i class="buhuo" v-if="goodEmpty(good)">补货中</i>
      </div>
      <div class="detail">
        <h3 class="h3">{{ good.goodsName }}</h3>
        <yc-subtitle-text :subtitle="good.storeList[0].subtitle" v-if="sellerId"></yc-subtitle-text>
        <h4 class="ellipsis">{{ good.spec || '无' }}/{{ good.unit || '无' }}
          <span class="sellunit" v-if="good.storeList.length > 0 && sellerId">订货倍数：{{ good.storeList[0].orderUnit }}</span>
        </h4>
        <yc-combin-text
        :type="type"
        v-if="good.storeList[0].activityType === 50 && sellerId"
        :seller="good.storeList[0]">
        </yc-combin-text>
        <yc-zhijiang-text
        type="sellerList"
        v-if="good.storeList[0].activityType === 60 && sellerId"
        :seller="good.storeList[0]">
        </yc-zhijiang-text>
        <p class="manjian" v-if="sellerId && manjian">
          <yc-mkt-label type="manjian"></yc-mkt-label>
          <span>{{ manjian }}</span>
        </p>
        <p class="manjian" v-if="sellerId && good.storeList.length > 0 && good.storeList[0].activityType == 40">
          <i class="maizeng"> {{ activityRuleList[0] }} </i>{{ activityRuleList[1] }}
        </p>
      </div>
    </div>
    <div class="seller-index" v-if="good.storeList.length > 0 && sellerId">
      <p>
        <!-- 订货价格： -->
        <i>¥{{$bqUtils.moneyFixed(good.storeList[0].price) }}</i>
        <i class="o-price" v-if="good.storeList[0].price < good.storeList[0].originalPrice">
          ¥{{$bqUtils.moneyFixed(good.storeList[0].originalPrice)}}
        </i>
      </p>
      <div class="good-list-btn">
        <!-- isMultipleAttribute是否为多属性，1 是多属性 0 不是多属性，多属性时浮层调出属性列表，一个属性直接加减 -->
        <modify-cart v-if="good.storeList[0].isMultipleAttribute===0 && good.storeList[0].activityType !== 30"
        :cartData="good.storeList[0]" :type="type" ></modify-cart>
        <yc-ding v-if="good.storeList[0].isMultipleAttribute===1 || good.storeList[0].activityType === 30"
        :sku="good.sku" :sellerId="good.storeList[0].sellerId" :type="type"
        :propertyStocks="good.storeList[0].propertyStocks"></yc-ding>
      </div>
    </div>
    <seller v-if="good.storeList.length > 0 && !sellerId" :sku="good.sku" :seller="good.storeList[0]" :type="type"></seller>
    <bq-collapse v-if="good.storeList.length - 1 > 0">
      <bq-collapse-content>
        <seller v-for="(seller, index) in good.storeList" v-if="index !== 0" :key="seller.sellerId" :sku="good.sku" :seller="seller">
        </seller>
      </bq-collapse-content>
      <bq-collapse-header >此商品还有<span class="price">{{ good.storeList.length - 1 }}个</span>卖家在供货</bq-collapse-header>
    </bq-collapse>
  </li>
</template>
<script>
  import modifyCart from '@/components/modify/modify.cart'
  import detail from '@/views/goods/src/detail.js'
  import MktMixin from '@/mixins/mkt.mixin'
  import Seller from './common/seller.vue'
  export default {
    name: 'bq-good-item',
    mixins: [ MktMixin ],
    data() {
      return {
        sellerId: null
      }
    },

    props: {
      good: {
        type: Object,
        default: {
          storeList: []
        }
      },
      type: {}
    },

    computed: {
      chuxiao() {
        return this.ycActivity.chuxiao
      },
      manjian() {
        return this.ycActivity.manjian
      },
      activityRuleList() {
        let buyGifts = this.good.storeList[0].activityRule.split(']')
        buyGifts[0] = buyGifts[0] + ']'
        return buyGifts
      }
    },

    mounted() {
      if (this.$route && this.$route.params) {
        this.sellerId = this.$route.params.id
      }
      // 兼容搜索页面 传值方式
      if (this.$route && this.$route.query && this.$route.query.sellerId) {
        this.sellerId = this.$route.query.sellerId
      }
      // 获取折扣
      this.getActivityRule(this.good.storeList)
    },
    beforeDestroy() {
      // detail.closeAll()
      this.$ding.close()
    },
    methods: {
      onDetail(_sku) {
        if (this.type === 'combinPage') {
          return
        }
        // 打开 详情页 移除数据同步的数据
        window.store.commit('MODIFY_CART_COUNT', {})
        detail({
          sku: _sku,
          sellerId: this.sellerId
        })
      },
      goodItemToTop(e) {
        this.$emit('goodItemToTop', e)
      },
      goodEmpty (good) {
        let empty = true
        good.storeList.forEach(item => {
          if (item.propertyStocks === 1) {
            empty = false
          }
        })
        return empty
      }
    },

    components: {
      modifyCart,
      seller: Seller
    }
  }
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  .bq-list-item {
    margin-bottom: 8px;
    border-bottom: 1px solid $light-border-color;
    .info{
      padding: 12px 15px 10px 110px;
      position: relative;
      background: #fff;
      min-height: 80px;
      border-bottom: 1px solid #f5f5f5;
      .img{
        @include border-zero-5();
        position: absolute;
        width: 80px;
        height: 80px;
        top: 12px;
        left: 15px;
        .yc-mkt-discount{
          top: 0;
          left: 0;
        }
        .buhuo{
          display: block;
          position: absolute;
          bottom: -1px;
          left: 0;
          right: -1px;
          @include font-dpr(12);
          text-align: center;
          background: rgba(0,0,0,.5);
          line-height: 20px;
          // width: 100%;
          color: #fff;
        }
        img{
          width: 100%;
          height: 100%;
        }
      }
      .detail{
        .h3{
          line-height: 21px;/*no*/
          @include font-dpr(15px);
          color: #333;;
          margin-bottom: 16px;
          @include ext-overflow(2);
          margin-top: 3px;
          font-weight: 600;
        }
        h4{
          line-height: 16px;/*no*/
          height: 16px;/*no*/
          @include font-dpr(14px);
          color: #666;
          // margin-bottom: 2px;
          // padding-top: 4px;
          @include text-overflow-1;
        }
        // h4:last-child{
        //   margin-bottom: 0;
        // }
        .ellipsis{
            display: inline-block;
            width: 100%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            margin-right: 0.3rem;
          }
      }
    }
    &.category-goods-item .info,
    .yc-seller-info {
      min-height: 60px;
      padding: 10px 10px 10px 80px;
      border-bottom: none;
      .img{
        width: 60px;
        height: 60px;
        left: 10px;
        top: 10px;
      }
      .detail{
        .h3{
          line-height: 19px;/*no*/
          @include font-dpr(14px);
          color: #333;
          margin-bottom: 12px;
          @include ext-overflow(2);
          margin-top: 0px;
        }
        h4{
          line-height: 14px;/*no*/
          height: 14px;/*no*/
          @include font-dpr(12px);
          color: #666;
          margin-bottom: 0px;
          @include text-overflow-1;
        }
        .manjian{
          margin-top: 0;
        }
      }
    }
    &.category-goods-item .info{
      border-bottom: 1px solid #f5f5f5;
    }
    .seller-index{
      padding: 8px 110px 8px 10px;
      background: #fff;
      position: relative;
      // border-top: 1px solid $light-border-color;
      height: 28px;
      p{
        line-height: 28px;
        @include font-dpr(14px);
        color: $font-color;
        i{
          color: $price;
          &.o-price{
            color: #999;
            @include font-dpr(12px);
            text-decoration: line-through;
          }
        }
      }
      .good-list-btn{
        .modify{
          bottom: 10px;
          right: 15px;
        }
      }
    }
    .seller{
      padding: 8px 10px 8px 10px;
      background: #fff;
      position: relative;
      border-bottom: 1px solid $light-border-color;
      .good-list-btn{
        .modify{
          bottom: 10px;
          right: 15px;
        }
      }
      &:last-child{
        border-bottom: 0;
      }
      .bq-collapse-content{
        padding: 0;
      }
      .good-list-btn{
        .modify{
          bottom: 10px;
          right: 15px;
        }
      }
      p{
        @include font-dpr(12px);
        color: #666;
        line-height: 20px;
        @include text-overflow-1();
        &.seller-name{
          @include font-dpr(14px);
          margin: 5px 0;
          color: #333;
          padding-right: 100px;
        }
        .price{
          margin-right: 10px;
          @include font-dpr(12px);
          color: $price;
          font-weight: 600;
          i{
            font-size: 16px;
            @include font-dpr(18px);
          }
        }
        .maizeng {
          margin-right: 0px;
          color: #FF4E13;
          @include font-dpr(12px)
        }
      }
    }
    &.category-goods-item .seller{
      p{
        @include font-dpr(12px);
        color: #666;
        line-height: 18px;
        @include text-overflow-1();
        &.seller-name{
          @include font-dpr(12px);
          margin: 3px 0;
          color: #333;
        }
        .price{
          margin-right: 10px;
          @include font-dpr(12px);
          color: #FF4E13;
          i{
            @include font-dpr(15px);
          }
        }
      }
    }
    .price {
      color: $danger;
    }
    .manjian {
      width: 100%;
      height: 21px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-top: 3px;
      color: #666;
      span{
        display: inline-block;
        height: 14px;/*no*/
        line-height: 14px;/*no*/
        vertical-align: bottom;
      }
      .maizeng {
        margin-right: 2px;
        color: #FF4E13;
        @include font-dpr(12px)
      }
    }
  }
  .sellunit {
    margin-left: 30px;
    @include font-dpr(12px);
    color: #666;
  }
  // .lastinfo {
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   white-space: nowrap;
  // }

  .bq-list-item .seller p i.o-price {
    font-size: 12px; /*no*/
    color: #999999;
    text-decoration: line-through;
  }
</style>
