<!-- 弹出订货弹框 -->
<template>
  <bq-popup :style="modalStyle" v-model="currentVal" position="bottom" ref="ding">
    <div class="bq-ding-modal" id="dingModal">
      <header class="bq-ding-modal__header">
        <div class="ding-close" @click="closeDing()">
        </div>
        <div class="bq-ding-modal__goods-img">
          <div class="img">
            <yc-activity-icon
              v-if="goods.activityType"
              :ycActivity="ycActivity"
              :type="type"
            ></yc-activity-icon>
            <!-- <yc-mkt-discount v-if="goods.activityType === 20">{{ goods.activityRule }}折</yc-mkt-discount> -->
            <img v-lazy="goods.goodsImage">
          </div>
        </div>
        <div class="bq-ding-modal__goods">
          <h2>{{ goods.goodsName }}</h2>
          <p class="attr">{{ goods.spec || '无' }}/{{ goods.unit || '无' }}</p>
        </div>
        <p class="tip-manjian" v-if="goods.activityType === 10">
          <yc-mkt-label type="manjian"></yc-mkt-label> {{ JSON.parse(goods.activityRule).join('; ')}}
        </p>
      </header>
      <section class="bq-ding-modal__content">
        <ul>
          <li v-for="good in goods.properties" :key="good.goodsId">
            <div class="good-attr-item">
              <div class="good-attr-item__desc">
                <h5 v-if="good.propertyName && good.propertyName !== '无'">{{ good.propertyName + '：' + good.propertyValue }}</h5>
                <yc-subtitle-text :subtitle="good.subtitle"></yc-subtitle-text>
                <div v-if="good.activityType === 40"><i class="maizeng"> {{ changeActivityRule0(good) }} </i>{{ changeActivityRule1(good) }}</div>
                <p>
                  <yc-mkt-label type="chuxiao" v-if="good.activityType === 20"></yc-mkt-label>
                  <span class="price"><i>¥</i>{{good.price}}
                    <yc-origin-price :goodsInfo="good">
                      ￥{{ $bqUtils.moneyFixed(good.originalPrice)}}
                    </yc-origin-price>
                  </span>
                  <!-- <span class="o-price" v-if="good.activityType === 20">{{ good.originalPrice}}</span> -->
                  <span class="bei">订货倍数：{{ good.orderUnit }}</span>
                </p>
              </div>
              <div class="buhuo" v-if="!good.stock || (good.orderUnit > good.stock)">
                补货中
              </div>
              <modify-cart v-if="good.stock && (good.orderUnit <= good.stock)" type="ding" @modifyCartEnd="params => { onModifyCartEnd(params, good) }" :cartData="good"></modify-cart>
            </div>
            <yc-combin-text
            class="ding-combin"
            :type="type"
            v-if="good.activityType === 50"
            :seller="good">
            </yc-combin-text>
            <yc-zhijiang-text
            :type="type"
            v-if="good.activityType === 60"
            :seller="good">
            </yc-zhijiang-text>
            <p v-if="good.activityType === 30" class="tip"> {{ good.activityTips }}</p>
          </li>
        </ul>
      </section>
    </div>
  </bq-popup>
</template>
<script>
// import { Popup } from 'mint-ui'
import Popup from '~/popup.middle'
// import bqPopup from './bq.popup'
import modifyCart from '@/components/modify/modify.cart'
import GoodsService from '@/services/goods.service'
export default {
  data() {
    return {
      currentVal: false,
      sku: '',
      sellerId: '',
      type: '',
      goods: {},
      defaultImg: 'http://static.js.bqmart.cn/static/img/l.gif',
      ycActivity: {}
    }
  },

  created() {
    this.GoodsService = new GoodsService()
  },

  computed: {
    modalStyle() {
      return {
        width: `${lib.flexible.px2rem(window.screen.width)}rem`
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$messagebox.close()
      this.init()
    })
  },

  methods: {
    changeActivityRule0(item) {
      let buyGifts = item.activityRule.split(']')
      buyGifts[0] = buyGifts[0] + ']'
      return buyGifts[0]
    },
    changeActivityRule1(item) {
      let buyGifts = item.activityRule.split(']')
      return buyGifts[1]
    },
    async init() {
      let params = {
        sku: this.sku,
        sellerId: this.sellerId
      }
      let res = await this.GoodsService.getPropertyList(params)
      this.goods = res
      this.ycActivity = {
        activityType: this.goods.activityType
      }
      if (this.goods.activityType === 20) {
        this.ycActivity.chuxiao = this.goods.activityRule
      }

      if (this.goods.activityType === 50 || this.goods.activityType === 60) {
        this.ycActivity.activityRule = this.$bqUtils.jsonParse(this.goods.activityRule)
        this.ycActivity.changeType = this.ycActivity.activityRule.changeType
        if (this.type !== 'combinPage') {
          return
        }
        this.goods.properties.forEach(item => {
          if (item.activityType === 50) {
            let rule = this.$bqUtils.jsonParse(item.activityRule)
            let changePrice = rule.changePrice ? rule.changePrice : 0
            // 1 是降价 2 涨价 0 不变价
            if (rule.changeType === 1) {
              let price = this.$bqUtils.moneyFixed(item.price - changePrice)
              item.price = price > 0 ? price : 0
            } else {
              let price = this.$bqUtils.moneyFixed(item.price + changePrice)
              item.price = price > 0 ? price : 0
            }
          }
        })
      }
      if (this.goods.properties.length <= 2) {
        window.document.getElementById('dingModal').ontouchmove = () => { return false }
      } else {
        window.document.getElementById('dingModal').ontouchmove = () => {}
      }
    },

    onModifyCartEnd(params, good) {
      // 如果是满减对满减进行处理 其他活动不变
      if (params.activityType === 30) {
        this.$set(good, 'price', params.price)
        this.$set(good, 'activityType', params.activityType)
        this.$set(good, 'activityTips', params.activityTips)
      }
    },
    closeDing () {
      this.$ding.close()
    }
  },

  components: {
    bqPopup: Popup,
    modifyCart
  }
}
</script>

<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  $iconImgUrl: '../../../assets/img';

  .bq-ding-modal {
    width: 100%;
    background-color: #ffffff;
    // overflow: hidden;
    &__header {
      padding: 10px 15px 8px 115px;
      position: relative;
      z-index: 2;
      min-height: 67px;
      .ding-close{
        width: 35px;
        height: 35px;
        position: absolute;
        top: -30px;
        right: 15px;
        background: url(#{$iconImgUrl}/icon/ding-close.png) no-repeat center;
        background-size: 35px;
      }
      @include border-zero-5(#D8D8D8) {
        z-index: 1;
        border-width: 0;
        border-bottom-width: 1px;
      };
    }
    // 商品主题
    &__goods-img {
      position: absolute;
      left: 15px;
      top: -20px;
      // bottom: 10px;
      width: 90px;
      height: 90px;
      // border: 1px solid #D8D8D8;
      .img {
        width: 90px;
        height: 90px;
        border-radius: 2px;
        background-color: #ffffff;
        // overflow: hidden;
        @include border-zero-5(#D8D8D8) {
          border-radius: 4px;
          width: 179px;
          height: 179px;
          // border-bottom: 0;
          // z-index: -1;
        };
        img {
          width: 100%;
          height: 100%;
          z-index: 3;
          border-radius: 2px;
        }
      }
    }

    // 商品描述
    &__goods {
      h2 {
        color: #333333;
        line-height: 20px;
        @include ext-overflow(2);
        @include font-dpr(14px);
      }
      p {
        &.attr {
          margin-top: 6px;
          color: #888888;
          @include font-dpr(12px);
        }

        // 满减
        &.tip-manjian {
          color: #666666;
          @include font-dpr(11px);
        }

      }
    }

    // 商品属性列表
    &__content {
      height: 250px;
      max-height: 250px;
      overflow-x: hidden;
      overflow-y: auto;
      margin-bottom: 5px;
      ul {
        li {
          padding: 12px 15px 9px 14px;
          z-index: 3;
          &:last-child {
            margin-bottom: 5px;
          }
          @include border-zero-5(#D8D8D8) {
            border-width: 0;
            border-bottom-width: 1px;
            z-index: 1;
          };
          // 单个属性列表
          .good-attr-item {
            display: flex;
            align-items: flex-end;
            .buhuo{
              text-align: right;
              color: #666;
              @include font-dpr(12px);
              line-height: 24px;
            }
            &__desc {
              flex: 1;
              h5 {
                color: #333333;
                @include font-dpr(12px);
              }
              p {
                min-height: 28px;
                // display: flex;
                // align-items: center;
                .price {
                  color: $price;
                  @include font-dpr(18px);
                  font-weight: 600;
                  i {
                    @include font-dpr(12px);
                  }
                }
                //原价
                .o-price {
                  padding-top: 4px;
                  padding-left: 5px;
                  color: #999999;
                  text-decoration: line-through;
                  @include font-dpr(12px);
                }

                // 订货倍数
                .bei {
                  padding-left: 20px;
                  color: #888888;
                  @include font-dpr(12px);
                  display: inline-block;
                  word-break:keep-all;
                  white-space:nowrap;
                }
              }
              .maizeng {
                margin-left: -7px;
                color: #FF4E13;
                @include font-dpr(12px)
              }
            }
            .modify {
              position: static;
              z-index: 5;
            }
          }

          // 友好提示
          .tip {
            padding-top: 6px;
            text-align: right;
            color: #FF4E13;
            @include font-dpr(11px);
          }
        }
      }
    }

  }
</style>
