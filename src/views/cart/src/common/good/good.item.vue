<template>
  <!-- 单个购物车商品  -->
  <div>
    <bq-item-sliding class="yc-cart-good">
      <bq-card-item padding no-border>
        <div class="yc-cart-good__content">
          <!-- 买赠的连线 -->
          <!-- <i v-if="type === 40" class="check-item-link"></i> -->
          <bq-checkbox type="radio"
            :disabled="good.noChecked && !isDel"
            @change.native="onChange(good)"
            v-model="good.isChecked">
          </bq-checkbox>
          <div class="yc-cart-good__desc">
            <div class="img">
              <yc-activity-icon
                v-if="ycActivity.activityType"
                type="cartDetail"
                :ycActivity="ycActivity"
              ></yc-activity-icon>
              <yc-mkt-discount v-if="type === 20" >{{ rule }}折</yc-mkt-discount>
              <img v-lazy="good.goodsImage">
            </div>
            <div class="desc">
              <h2 class="bq-f-size-15">
                <yc-mkt-label v-if="type === 10" type="manjian" size="max">
                </yc-mkt-label>
                {{ good.goodsName }}
              </h2>
              <p class="bq-f-size-13" v-if="good.propertyName && good.propertyName !== '无'">
                {{ good.propertyName + '：' + good.propertyValue }}
              </p>
              <yc-combin-text
              type="cartDetail"
              :isCombin="isCombin"
              :isCombinLength="isCombinLength"
              v-if="good.activityType === 50"
              :sellerId="sellerId"
              :seller="good">
              </yc-combin-text>
              <yc-zhijiang-text
              type="cartDetail"
              v-if="good.activityType === 60"
              :sellerId="sellerId"
              :seller="good">
              </yc-zhijiang-text>
              <p class="bq-f-size-13" v-if="good.originalCount === 0">
                单价：
                <span class="price" v-if="type === 50 || type === 60">{{ $bqUtils.moneyFixed(good.comPrice) || $bqUtils.moneyFixed(good.price) }}</span>
                <span class="price" v-if="type !== 50 && type !== 60">{{ $bqUtils.moneyFixed(good.price) }}</span>
                <yc-origin-price :goodsInfo="good">
                  {{ $bqUtils.moneyFixed(good.originalPrice)}}
                </yc-origin-price>
                <!-- <span class="origin-price">{{ $bqUtils.moneyFixed(good.originalPrice) }}</span> -->
              </p>
              <!-- 组合显示逻辑 -->
              <p class="bq-f-size-13" v-if="(type === 50 || type === 60) && good.originalCount > 0">
                优惠价：<span class="price">{{ $bqUtils.moneyFixed(good.comPrice) ||  $bqUtils.moneyFixed(good.price)}}</span>
                <span class="number" > x{{ good.count - good.originalCount }}</span>
              </p>
              <p class="bq-f-size-13" v-if="(type === 50 || type === 60) && good.originalCount > 0">
                原价：<span>{{ $bqUtils.moneyFixed(good.originalPrice) }}</span>
                <span class="number" > x{{ good.originalCount }}</span>
              </p>
              <!-- 促销显示逻辑 -->
              <p class="bq-f-size-13" v-if="type === 20 && good.originalCount > 0">
                促销价：<span class="price">{{ $bqUtils.moneyFixed(good.price) }}</span>
                <span class="number" > x{{ good.count - good.originalCount }}</span>
              </p>
              <p class="bq-f-size-13" v-if="type === 20 && good.originalCount > 0">
                原价：<span>{{ $bqUtils.moneyFixed(good.originalPrice) }}</span>
                <span class="number" > x{{ good.originalCount }}</span>
              </p>
              <p class="bq-f-size-13">订货倍数：{{ good.orderUnit }}</p>
            </div>
          </div>
        </div>
        <div class="yc-cart-good__bottom">
          <div class="warns bq-f-size-12" v-if="good.goodsMark || type !== 40 || !good.discountRule">
            <p><i class="red">{{ good.goodsMark }}</i></p>
          </div>
          <div class="warns bq-f-size-12" v-if="!good.goodsMark && type === 40 && good.discountRule">
            <p><i class="red">[买{{ activityRuleList(good.discountRule).buy }}赠{{ activityRuleList(good.discountRule).send }}] </i>
              赠送{{ activityRuleList(good.discountRule).goodsName }}</p>
          </div>
          <modify-cart :cartData="good" type="cart" @modifyCartEnd = "modifyCartEnd"></modify-cart>
        </div>
        <!-- 自动补货  -->
        <div class="yc-cart-good__isauto" v-if="good.isAuto === 1" >
          <u>自动补货</u>我的当前剩余库存数：<span>{{good.buyerStoreStock}}</span>
        </div>
        <!-- 处理满件  -->
        <p class="tip" v-if="type === 30">
          {{ good.activityTips }}
        </p>
      </bq-card-item>
      <bq-item-options>
        <bq-button class="btn-del" @click="$emit('goodDelete')">
          删除
        </bq-button>
      </bq-item-options>
    </bq-item-sliding>
  </div>
</template>
<script>
  import modifyCart from '@/components/modify/modify.cart.vue'
  export default {
    props: {
      good: {
        type: Object,
        default() {
          return {}
        }
      },
      type: {},
      // rule: {},
      isDel: Boolean,
      isCombin: Boolean,
      isCombinLength: Boolean,
      sellerId: {}
    },
    computed: {
      rule () {
        if (this.good.activityType === 20) {
          return this.good.discountRule
        }
      },
      ycActivity() {
        let changeType = 0
        if (this.good.activityType === 50 || this.good.activityType === 60) {
          let crule = this.$bqUtils.jsonParse(this.good.activityRule)
          changeType = crule.changeType
        }
        return {activityType: this.good.activityType, chuxiao: this.rule, changeType: changeType}
      },
      combinLength() {
        if (this.combinGoods) {
          return this.combinGoods.length
        } else {
          return 0
        }
      }
    },
    mounted () {
    },
    methods: {
      activityRuleList(discountRule) {
        let buyGifts = JSON.parse(discountRule)
        return buyGifts
      },
      modifyCartEnd(params) {
        this.good.count = params.count
        // 处理满件逻辑
        if (params.activityType === 30) {
          this.good.activityTips = params.activityTips
          this.good.price = params.price
          // 优惠金额
          this.good.tipsAmount = params.tipsAmount
        }
        // 处理组合逻辑
        this.$emit('countChange')
      },
      onChange(good) {
        this.$emit('onCheckedChange', good)
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
  .yc-cart-good {
    .bq-card-item {
      &[padding] {
        padding: 10px 0 15px 0;
      }
      &__right {
        display: none;
      }
    }
    &__content {
      display: flex;
      .check-item-box {
        display: inline-block;
        background-color: #fff;
        padding-bottom: 30px;
        position: relative;
        z-index: 2;
        left: 1px;
      }
      .check-item {
        width: 12px;
        height: 12px;
        float: left;
        background: url('../../../../../assets/img/coupon/zengping.png') no-repeat;
        background-size: 100%;
      }
      .check-item.no-check {
        background: url('../../../../../assets/img/coupon/no-choose.png') no-repeat;
        background-size: 100%;
      }
      .check-item-link {
        display: block;
        width: 1px;
        height: 135px;
        background: #666;
        position: absolute;
        left: 7px;
        top: 20px;
        z-index: 0;
      }
      .zeng-discount {
        font-size: 10px;
        padding: 0px 5px;
        height: 20px;
        line-height: 20px;
        -webkit-text-size-adjust:none;
        -webkit-transform:scale(0.8);
        -webkit-transform-origin:0 0;
        -o-transform:scale(1);
        background-color: #FF8113;
      }
    }
  }
  .yc-cart-good {
    position: relative;
    display: block;
    width: 100%;
    z-index: 5;
    overflow: visible;
  }
  //  商品显示部分
  .yc-cart-good__desc {
    flex: 1;
    margin-left: 10px;
    width: 100%;
    min-height: 60px;
    display: flex;
    .img {
      position: relative;
      width: 60px;
      height: 60px;
      border: 0.026667rem solid #D8D8D8;
      .yc-mkt-discount {
        position: absolute;
        left: 0;
        top: 0;
      }
      img {
        width: 60px;
        height: 60px;
      }
    }
    .desc {
      flex: 1;
      margin-left: 10px;
      h2 {
        color: #333333;
        @include ext-overflow(2);
        line-height: 20px;
        font-weight: 600;
        margin-bottom: 10px;
      }
      p {
        color: #666666;
      }
      span.price {
        color: #FF7700;
        @include font-dpr(13px);
      }
      span.price-num {
        padding-left: 60px;
      }
      .origin-price {
        color: #999999;
        text-decoration: line-through;
        @include font-dpr(11px);
      }
      .number {
        padding-left: 10px;
        color: #999999;
        @include font-dpr(12px);
      }
    }
  }

  // 添加购物车 和别的提示
  .yc-cart-good__bottom {
    display: flex;
    .warns {
      flex: 1;
      padding-left: 25px;
      p {
        max-width: 220px;
        @include text-overflow-1;
        height: 26px;
        line-height: 26px;
        color: #000;
        .red {
          color: $price;
        }
      }
    }
    .modify {
      position: static;
      margin-right: 5px;
    }
  }

  // 自动补货
  .yc-cart-good__isauto {
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

  // 满减提示
  .tip {
    margin-top: 10px;
    text-align: right;
    color: #FF4E13;
    @include font-dpr(12px);
  }
</style>
