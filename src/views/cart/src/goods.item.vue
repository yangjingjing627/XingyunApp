<!-- 2.1版本废弃 -->
<template>
  <bq-item-sliding>
    <bq-card-item class="cart-goods-item">
      <div class="goods-itemmain">
        <bq-checkbox type="radio" :disabled="goodsItem.noChecked && !isDel" v-model="goodsItem.ischecked"></bq-checkbox>
        <img v-lazy="goodsItem.goodsImage">
        <p>
          <span class="main-title">{{goodsItem.goodsName}}</span>
          <span class="main-price">单价：<span class="main-pricenumber">{{$bqUtils.moneyFixed(goodsItem.price)}}</span></span>
          <span>订货倍数：{{goodsItem.orderUnit}}</span>
        </p>
      </div>
      <div class="goods-itemtrim">
        <span class="goods-itemtrim-warn">{{goodsItem.goodsMark}}</span>
        <modify-cart :cartData="goodsItem" type="cart" v-on:modifyCartEnd = "modifyCartEnd"></modify-cart>
      </div>
      <div class="goods-itemremind" v-if="goodsItem.isAuto === 1">
        <u>自动补货</u>我的当前剩余库存数：<span>{{goodsItem.buyerStoreStock}}</span>
      </div>
    </bq-card-item>
    <bq-item-options>
      <slot name="delbtn"></slot>
    </bq-item-options>
  </bq-item-sliding>
</template>
<script>
import modifyCart from '@/components/modify/modify.cart'
export default {
  data() {
    return {
      goodsItem: this.goodsitem
    }
  },
  props: {
    goodsitem: Object,
    isDel: Boolean
  },
  methods: {
    modifyCartEnd (count) {
      this.goodsItem.count = count
    }
  },
  watch: {
    'goodsItem.count'(val, oldval) {
      this.$emit('goodsItemCountChanage', {newval: val, oldval: oldval, goodsItem: this.goodsItem})
    },
    'goodsItem.ischecked'() {
      this.$emit('goodsItemSelChanage', this.goodsItem)
    }
  },
  components: {
    modifyCart
  }
}
</script>
<style lang="scss">
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
.cart-goods-item {
  margin-left: 0px;
  &:after {
    height: 0px;
  }
  .bq-card-item__info {
    flex: initial;
  }
}
.goods-itemmain {
  margin-top: 10px;
  height: 60px;
  display: flex;
  align-items: center;
  color: #666;
  @include font-dpr(14px);
  img {
    width: 68px;
    height: 58px;
    margin-left: 10px;
    margin-right: 10px;
    border: 1px solid $border-color
  }
  p {
    display: flex;
    flex-direction: column;
  }
  .main-title {
    @include font-dpr(15px);
    color: $font-color;
    width: 225px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .main-price {
    margin: 2px 0px;
  }
  .main-pricenumber {
    color: $danger;
  }
}
.goods-itemtrim {
  margin-top: 11px;
  padding-left: 31px;
  margin-bottom: 15px;
  height: 25px;
  @include font-dpr(12px);
  &-warn {
    color: #FF4E13;
    position: absolute;
  }
}
.goods-itemremind{
  height: 30px;
  background-color: #FFF9E3;
  color: #666;
  @include font-dpr(12px);
  margin: 0px -15px;
  padding-left: 35px;
  line-height: 30px;
  u {
    color: #FF4E13;
    margin-right: 14px;
  }
  span {
    color: $danger;
  }
}
</style>
