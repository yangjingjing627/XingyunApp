<template>
  <div class="yc-cart-item__store">
    <bq-checkbox type="radio" v-model="item.isChecked" :disabled="item.noChecked && !isDel" @change.native="onChange(item)">
    </bq-checkbox>
    <span class="store-name">
      {{item.storeName}}
      <b>（起送价{{$bqUtils.moneyFixed(item.minDeliverAmount)}}元）</b>
    </span>
    <span class="del" v-if="item.storeStatus === 1" @click="onDeleteSeller(item)">删除</span>
  </div>
</template>
<script>
  import {getTotalPrice} from './cart.helper'
  import CartService from '@/services/cart.service'
  export default {
    props: {
      item: {
        type: Object,
        default() {
          return {}
        }
      },
      isDel: Boolean
    },

    created() {
      this.CartService = new CartService()
    },

    methods: {

      // 删除单个卖家的商品
      async onDeleteSeller(item) {
        await this.$messagebox.confirm('是否删除该卖家所有商品？', '')
        let goods = []
        item.activityList.forEach(activity => {
          activity.goodsList.forEach(good => {
            goods.push(good.goodsId)
          })
        })
        let res = await this.CartService.removeGoods(goods.join(','))
        if (res === true) {
          this.$router.go(0)
        }
      },

      // 店铺选中 或者取消选中
      onChange(item) {
        item.activityList = item.activityList.map(activity => {
          activity.goodsList = activity.goodsList.map(good => {
            if (this.isDel) {
              good.isChecked = item.isChecked
            } else {
              if (!good.noChecked) {
                good.isChecked = item.isChecked
              }
            }
            return good
          })
          return activity
        })
        getTotalPrice.call(this, item)
        this.$emit('storeCheckedChange')
      }
    }
  }
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  .yc-cart-item__store {
    padding: 0 15px;
    display: flex;
    height: 34px;
    line-height: 34px;
    // border-bottom: 1px solid #D8D8D8;
    &.no-border {
      border-bottom: 0;
    }
    .bq-checkbox-wrapper {
      margin-right: 10px;
    }
    .store-name {
      flex: 1;
      color: #666666;
      @include font-dpr(14px);
      @include text-overflow-1;
      b {
        color: #2A2A2A;
        font-weight: normal;
        @include font-dpr(12px);
      }
    }
    .del {
      color: #FF8113;
    }
  }
</style>
