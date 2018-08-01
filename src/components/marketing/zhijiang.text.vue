<!-- 组合购买提示语 -->
<template>
  <div class="yc-zhijiang-text" :class="{'jiang-icon': jiangIcon}" v-if="changeType">
    <span :class="{'cart-page': type === 'cartDetail'}">{{text}}</span>
  </div>
</template>
<script>
  export default {
    name: 'yc-zhijiang-text',
    data() {
      return {
      }
    },
    props: {
      type: {
        type: String,
        default: 'goodsList'
      },
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
        if (this.activityRule.changeType === 1) {
          let nowPrice = this.seller.originalPrice - activityRule.changePrice > 0 ? this.seller.originalPrice - activityRule.changePrice : 0
          nowPrice = this.$bqUtils.moneyFixed(nowPrice)
          if (activityRule.minCount) {
            text = '购买 ' + activityRule.minCount * this.seller.orderUnit + ' 件以上才可以享受优惠价: ' + nowPrice + '，'
          } else {
            text = '优惠价: ' + nowPrice + '，'
          }
          if (activityRule.maxCount) {
            text += '限购 ' + activityRule.maxCount * this.seller.orderUnit + ' 件，超出部分将按原价计算'
          } else {
            text += '不限购'
          }
        }
        return text
      },
      jiangIcon () {
        if (this.type === 'sellerList' || this.type === 'cartDetail') {
          return false
        } else {
          return true
        }
      },
      changeType () {
        return this.activityRule.changeType === 1
      }
    },
    methods: {
    }
  }
</script>
<style lang="scss">
@import 'scss/mixin.scss';
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
$iconImgUrl: '../../assets/img';
.yc-cart-good, .bq-ding-modal{
  .yc-zhijiang-text{
    margin: 5px 0 3px 0;
  }
}
  .yc-zhijiang-text {
    width: 100%;
    line-height: 18px;/*no*/
    @include font-dpr(12px);
    color: #666;
    margin: 5px 0 10px 0;
    position: relative;
    .cart-page{
      background: #FFEDE2;
    }
    &.jiang-icon{
      padding-left: 18px;
      box-sizing: border-box;
      &:after{
        content: "";
        // @include baseIcon('/components/mkt.label/jiang.png', 14px, 14px);
        background: url(#{$iconImgUrl}/components/mkt.label/jiang.png) no-repeat center;
        background-size: 14px;
        position: absolute;
        width: 14px;
        height: 14px;
        left: 0;
        top: 2px;
      }
    }
  }
</style>
