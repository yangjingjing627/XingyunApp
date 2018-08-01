<template>
  <div class="seller">
    <p>
      <yc-mkt-label v-if="seller.activityType === 20" type="chuxiao">
      </yc-mkt-label>
      <span class="price">¥
        <i>{{ $bqUtils.moneyFixed(seller.price) }}</i>
      </span>
      <i v-if="seller.originalPrice > seller.price" class="o-price">¥{{ seller.originalPrice }}</i>
      订货倍数：{{ seller.orderUnit }}
    </p>
    <yc-subtitle-text :subtitle="seller.subtitle"></yc-subtitle-text>
    <p class="manjian" v-if="seller.activityType === 10">
      <yc-mkt-label type="manjian">
      </yc-mkt-label>
      <span>{{ JSON.parse(seller.activityRule).join('; ') }}</span>
    </p>
    <p v-if="seller.activityType === 40" class="manjian"><i class="maizeng"> {{ activityRuleList[0] }} </i>{{ activityRuleList[1] }}</p>
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
    <p @click="goSeller(seller.sellerId)" class="seller-name">卖家：{{ seller.sellerName }}</p>
    <div class="good-list-btn">
      <!-- isMultipleAttribute是否为多属性，1 是多属性 0 不是多属性，多属性时浮层调出属性列表，一个属性直接加减 -->
      <modify-cart v-if="seller.isMultipleAttribute===0 && seller.activityType !== 30"
      :cartData="seller" :type="type"></modify-cart>
      <yc-ding v-if="seller.isMultipleAttribute===1 || seller.activityType === 30" :type="type"
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
  methods: {
    goSeller (sellerId) {
      if (this.$route && this.$route.name === 'SearchNew') {
        this.$router.replace('/category/seller/' + sellerId)
      } else {
        this.$router.push('/category/seller/' + sellerId)
      }
    }
  },

  components: {
    modifyCart
  }
}
</script>
