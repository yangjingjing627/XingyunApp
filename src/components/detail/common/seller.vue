<template>
  <div class="good-detail-footer">
    <div class="good-detail-footer_desc">
      <p>
        <yc-mkt-label v-if="seller.activityType === 20" type="chuxiao">
        </yc-mkt-label>
        <span class="price money">
          ¥
          <i>{{ seller.price && seller.price.toFixed(2) }}</i>
        </span>
        <i v-if="seller.activityType === 20" class="o-price">¥{{ seller.originalPrice }}</i>
        <span class="order-unit">订货倍数：{{ seller.orderUnit }}</span>
      </p>
      <yc-subtitle-text :subtitle="seller.subtitle"></yc-subtitle-text>
      <p v-if="seller.activityType === 10">
        <yc-mkt-label type="manjian"></yc-mkt-label>{{ JSON.parse(seller.activityRule).join('; ') }}
      </p>
      <yc-combin-text
      :type="type"
      v-if="seller.activityType === 50"
      :seller="seller">
      </yc-combin-text>
      <yc-zhijiang-text
      :type="type"
      v-if="seller.activityType === 60"
      :seller="seller">
      </yc-zhijiang-text>
      <p class="bq-f-size-13 buyname">卖家：{{ seller.storeName }}</p>
      <p class="bq-f-size-12" v-if="seller.activityType === 40"><i class="maizeng"> {{ activityRuleList[0] }} </i>{{ activityRuleList[1] }}</p>
      <!-- <p class="bq-f-size-12" v-if="seller.buyGiftsRule"><i class="maizeng">［买2赠1］</i>赠乐事薯片</p> -->
    </div>
    <div class="good-detail-footer_btn">
      <modify-cart v-if="seller.isMultipleAttribute===0 && seller.activityType !== 30"
      :cartData="seller" type="goodsDetail"></modify-cart>
      <yc-ding v-if="seller.isMultipleAttribute===1 || seller.activityType === 30"
      :sku="sku" :sellerId="seller.sellerId" :propertyStocks="seller.propertyStocks"></yc-ding>
    </div>
  </div>
</template>
<script>
import modifyCart from '@/components/modify/modify.cart'
export default {
  props: {
    seller: {
      type: Object,
      default: () => {}
    },
    sku: String,
    type: {}
  },
  computed: {
    activityRuleList() {
      let buyGifts = this.seller.activityRule.split(']')
      buyGifts[0] = buyGifts[0] + ']'
      return buyGifts
    }
  },
  components: {
    modifyCart
  }
}
</script>
