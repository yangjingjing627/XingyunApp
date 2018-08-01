<template>
  <li class="yc-cart-item">
    <!-- 店铺信息提示  -->
    <div class="store-top">
      <store :item="item" :isDel="isDel" @storeCheckedChange="$emit('storeCheckedChange')" v-if="index !== nowIndex"></store>
    </div>
    <!-- <store :item="item" :isDel="isDel" @storeCheckedChange="$emit('storeCheckedChange')"></store> -->
    <!-- 不足起送价提示  -->
    <tip :isBg="true" v-show="item.totalPrice < item.minDeliverAmount" @choudan="onChoudan">
      还差{{$bqUtils.moneyFixed((item.minDeliverAmount-item.totalPrice))}}元起送
    </tip>

    <!-- 按活动 展示商品  -->
    <bq-card v-for="(activity, index) in item.activityList" :key="'activity' + index">
      <!-- 营销提示  -->
      <tip @choudan="onChoudan"
        v-if="activity.activityType === 10 && activity.manjianDesc"
        :text="activity.manjianDesc.indexOf('已优惠') !== -1 && activity.manjianDesc.indexOf('再买') === -1 ? '再逛逛' : '去凑单'">
        {{ activity.manjianDesc }}
      </tip>
      <good-item v-for="(good, goodIndex) in activity.goodsList"
        :key="good.goodsId"
        :isCombin="activity.isCombin"
        :isCombinLength="activity.isCombinLength"
        :type="activity.activityType"
        :activityRule="good.discountRule"
        :isDel="isDel"
        :sellerId="item.sellerId"
        @countChange="onCountChange(activity, goodIndex, good, index)"
        @goodDelete="onGoodDel(activity, goodIndex, good.goodsId, index)"
        @onCheckedChange="$emit('goodCheckedChange', item)"
        :good="good">
      </good-item>
    </bq-card>
    <!-- 结算  -->
    <div class="yc-cart-item-footer">
      <p>
        <span>合计：<span class="count-price">¥{{$bqUtils.moneyFixed(item.totalPrice)}}</span></span>
        <span class="count">共{{item.total}}件</span>
      </p>
      <p class="youhui" v-if="item.discountedTotalPrice">
        <span>总额：¥{{ $bqUtils.moneyFixed(item.totalPrice + item.discountedTotalPrice) }}</span>
        <span>优惠：
          ¥{{ $bqUtils.moneyFixed(item.discountedTotalPrice) }}
        </span>
      </p>
      <bq-button class="btn-del" type="primary" :disabled="item.totalPrice < item.minDeliverAmount || item.total<=0" @click="onSettlement(item)">
        结算
      </bq-button>
    </div>
  </li>
</template>

<script>
  import Store from './cart.item.srore.vue'
  import Tip from './tip.vue'
  import GoodItem from './good/good.item.vue'
  import CartService from '@/services/cart.service'
  import {getTotalPrice} from './cart.helper'
  export default {
    name: 'cart-item',

    props: {
      item: {
        type: Object,
        default() {
          return {}
        }
      },
      // 是否删除
      isDel: Boolean,
      nowIndex: Number,
      index: Number
    },

    created() {
      this.CartService = new CartService()
      getTotalPrice.call(this, this.item)
    },

    methods: {

      /**
       * count 变更触发
       * @param {any} activity 活动数据
       * @param {Number} index 当前商品的下标
       * @param {Number} goodsId 当前商品的goodsId
       * @param {Number} activityIndex 当前活动的活动下标
       * @param {Number} count 当前活动的活动id
       */
      countChange(activity, index, goodsId, activityIndex, count) {
        // 更新购物车数量
        window.store.dispatch('getCartCount')
        let goods = activity.goodsList
        if (count === 0) {
          // 删除该个商品
          goods.splice(index, 1)
        }
        let activityList = this.item.activityList
        // 如果该活动没有商品 移除 该个活动
        if (goods.length === 0) {
          activityList.splice(activityIndex, 1)
        }

        // 如果该活动下 没有活动 移除该店铺
        if (activityList.length === 0) {
          // 在cart 页面去删除
          this.$emit('deleteStore')
          return
        }
        // 重新计算总价
        getTotalPrice.call(this, this.item)
      },

      /**
       * 删除单个商品
       * @param {any} activity 活动数据
       * @param {Number} index 当前商品的下标
       * @param {Number} goodsId 当前商品的goodsId
       * @param {Number} activityIndex 当前活动的活动id
       */
      async onGoodDel(activity, index, goodsId, activityIndex) {
        await this.CartService.addCartGoods(goodsId, 0)
        this.countChange(activity, index, goodsId, activityIndex, 0)
      },

      /**
       * 购物车数量更新
       */
      onCountChange(activity, goodIndex, good, activityIndex) {
        this.countChange(activity, goodIndex, good.goodsId, activityIndex, good.count)
      },

      // 去凑单
      onChoudan() {
        let item = this.item
        if (item.storeStatus !== 1) {
          this.$router.push(`/category/seller/${item.sellerId}`)
        }
      },

      // 去结算
      async onSettlement(item) {
        let goods = []
        item.activityList.forEach(activity => {
          activity.goodsList.forEach(good => {
            if (good.isChecked && !good.noChecked) {
              goods.push(good.goodsId)
            }
          })
        })
        let sellerId = item.sellerId
        try {
          await this.CartService.sellerIdBefore({goodsIds: goods.join(','), sellerId: sellerId})
          this.$router.push({name: 'orderConfirm', query: {goodId: goods.join(','), sellerId: sellerId}})
        } catch (e) {
          if (e.data) {
            if (e.data.diffStatus === 1 || e.data.diffStatus === 3) {
              this.$messagebox.confirm(e.message, '温馨提示', {
                confirmButtonClass: 'bq-msg-confirm-ok',
                confirmButtonText: '继续结算',
                cancelButtonClass: 'bq-msg-confirm-cancel',
                cancelButtonText: '取消'
              }).then(() => {
                let validGoods = e.data.validGoods
                this.CartService.sellerIdBefore({goodsIds: validGoods, sellerId: sellerId})
                this.$router.push({name: 'orderConfirm', query: {goodId: validGoods, sellerId: sellerId}})
              })
            } else if (e.data.diffStatus === 4) {
              await this.$messagebox.alert(e.message, '', {confirmButtonText: '重新选购'})
              this.$router.push('/home')
            }
          } else {
            await this.$messagebox.alert(e.message)
          }
        }
      }
    },

    components: {
      Store,
      Tip,
      GoodItem
    }
  }
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  .yc-cart-item {
    background-color: #fff;
    margin-bottom: 10px;
    border-bottom: 1px solid $border-color;
    .stay-top{
      &.top{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 6;
        background: #fff;
      }
    }
    &-footer {
      height: 55px;
      position: relative;
      padding-left: 15px;
      p {
        display: flex;
        padding: 10px 82px 0 0;
        color: $font-color;
        @include font-dpr(14px);
        line-height: 16px;
        span {
          width: 50%;
        }
        .count {
          @include font-dpr(12px);
          color: #666666;
          margin-top: 3px;
          flex: 1;
          display: flex;
        }
        .count-price {
          color: $danger;
        }
        // 营销优惠价格
        &.youhui {
          padding-top: 3px;
          span {
            @include font-dpr(12px);
            color: #333333;
          }
        }
      }
      > button {
        width: 107px;
      }
    }
  }
</style>
