<!-- 组合购买提示语 -->
<template>
  <div class="yc-combin-text" :class="{'lijian': isLijian, 'disabled': disabled}">
    <span :class="{'li-jian': isLijian}">
      {{text}}
    </span>
    <i v-if="isLijian" @click.stop="openCombin()">立即选购</i>
  </div>
</template>
<script>
  import combin from '@/views/activity/src/combin.js'
  export default {
    name: 'yc-combin-text',
    data() {
      return {
      }
    },
    props: {
      type: {
        type: String,
        default: 'goodsList'
      },
      isCombin: Boolean,
      isCombinLength: Boolean,
      seller: {
        type: Object,
        default: {
          activityRule: {},
          originalPrice: {},
          sellerId: {},
          sku: {}
        }
      },
      sellerId: {}
    },
    computed: {
      activityRule () {
        return this.$bqUtils.jsonParse(this.seller.activityRule)
      },
      text() {
        let activityRule = this.activityRule
        let text = ''
        if (this.isLijian) {
          let nowPrice = this.seller.originalPrice - activityRule.changePrice > 0 ? this.seller.originalPrice - activityRule.changePrice : 0
          nowPrice = this.$bqUtils.moneyFixed(nowPrice)
          text = '与其他组合商品一起购买可享优惠价 ￥' + nowPrice
        }
        if (this.isZhang) {
          if (activityRule.minCount) {
            text = '需购买 ' + activityRule.minCount * this.seller.orderUnit + ' 件以上才可以享受优惠价'
          }
          if (activityRule.minCount && activityRule.maxCount) {
            text += '；'
          }
          if (activityRule.maxCount) {
            text += '限购 ' + activityRule.maxCount * this.seller.orderUnit + ' 件，超出部分将按原价计算'
          }
          if (!activityRule.minCount && !activityRule.maxCount) {
            text = '不限购'
          }
        }
        if (this.isNoZhang) {
          if (activityRule.minCount) {
            text = '需购买 ' + activityRule.minCount * this.seller.orderUnit + ' 件以上才可以享受此组合优惠'
          } else {
            text = '不限购'
          }
        }
        return text
      },
      isLijian () {
        // 是否有立即选购的按钮 判断条件是 是否降价了 降价会显示
        return this.activityRule.changeType === 1 && this.type !== 'combinPage' && !this.isCombin
      },
      isZhang () {
        // 降价的 组合立减
        return this.activityRule.changeType === 1 && (this.type === 'combinPage' || (this.type === 'cartDetail' && this.isCombin))
      },
      isNoZhang () {
        // 涨价的 或者不变价 组合必选 组合必选 不限购，卖家设置限购也不生效
        console.log(this.isCombinLength)
        return this.activityRule.changeType !== 1 && (this.type === 'combinPage' || (this.type === 'cartDetail' && this.isCombinLength))
      },
      disabled () {
        return this.activityRule.changeType !== 1 && (this.type === 'goodsList' || this.type === 'goodsDetail')
      }
    },
    methods: {
      openCombin () {
        // 打开 组合页面 移除数据同步的数据
        window.store.commit('COMBIN_PAGE_STATUS', true)
        window.store.commit('MODIFY_CART_COUNT', {})
        this.$ding.close()
        let sellerId = this.seller.sellerId || this.sellerId
        let sku = this.seller.spu || this.seller.sku
        combin({sellerId: sellerId, sku: sku})
      }
    }
  }
</script>
<style lang="scss">
@import 'scss/mixin.scss';
  .yc-cart-good__desc, .goods-list{
    .yc-combin-text{
      box-sizing: border-box;
      margin: 10px 0 5px 0;
      &.lijian{
        height: 40px;/*no*/
      }
      span{
        &.li-jian{
          margin-right: 0;
        }
      }
      i{
        right: 5px;
      }
    }
  }
  .goods-list{
    .yc-combin-text{
      margin: 10px 0 15px 0;
    }
  }
  .yc-combin-text {
    width: 100%;
    line-height: 17px;/*no*/
    @include font-dpr(12px);
    margin: 10px 0 20px 0;
    position: relative;
    box-sizing: border-box;
    // &.lijian{
    //   padding-right: 60px;
    // }
    &.disabled{
      display: none;
    }
    &.ding-combin{
      margin: 15px 0 5px 0;
    }
    span{
      background: #FFEDE2;
      color: #666;
      &.li-jian{
        margin-right: 60px;
      }
    }
    i{
      position: absolute;
      display: inline-block;
      bottom: 0px;
      color: #FF4E13;
      text-decoration: underline;
      right: 0;
      z-index: 88;
    }
  }
  .bq-android {
    .yc-mkt-discount {
      line-height: 17px;/*no*/
    }
  }
</style>
