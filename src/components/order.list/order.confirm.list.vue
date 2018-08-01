<template >
  <bq-modal class="bq-order-confirm" v-model="currentVal" title="进货列表">
    <ul class="goodinfo">
      <li class="item" v-for="good in getGoodImg" :key="'good' + good.goodsId">
        <yc-mkt-discount v-if="good.isGifts" class="zeng-discount">赠品</yc-mkt-discount>
        <!-- <yc-mkt-discount v-if="good.marketingType === 20">{{ good.marketingRule }}折</yc-mkt-discount> -->
        <yc-activity-icon
          type="orderGoodsList"
          :rule="good.marketingRule"
          :activityType="good.marketingType"
        ></yc-activity-icon>
        <img v-lazy="good.goodsImage" />
        <div class="bq-goods-right">
          <span>{{ good.goodsName }}</span>
          <span v-if="good.propertyName !== '无'">
            {{ good.propertyName + '：' + good.propertyValue }}
          </span>
          <span class="spec">规格：{{ good.spec || '无' }}</span>
          <span>单价：￥{{ $bqUtils.moneyFixed(good.price) }}
            <yc-origin-price :goodsInfo="good">
              ￥{{ $bqUtils.moneyFixed(good.originalPrice)}}
            </yc-origin-price>
          </span>
          <span class="last">订货倍数：{{ good.orderUnit }}</span>
          <!-- <span class="gap">单位：{{good.unit || '无'}}</span> -->
          <span class="gap" v-if="title.name = '/order/imglist'">订货数量：{{ good.count }}</span>
          <span class="gap" v-else>订货数量：{{ good.returnNum }}</span>
        </div>
        <div class="goods-right">
          <span class="count" v-if="good.status == 4 || good.status== 5">
            实收数量: {{ good.receiveCount }}
          </span>
        </div>
      </li>
    </ul>
  </bq-modal>
</template>
<script>
export default {
  name: 'OrderConfirmList',
  data() {
    return {
      goodImglist: '',
      title: '',
      currentVal: this.value || false
    }
  },
  props: {
    getGoodImg: {
      type: Array,
      default: () => []
    },
    value: {}
  },
  watch: {
    value(val) {
      this.currentVal = val
    },
    currentVal(val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="scss">
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
.bq-order-confirm{
  position: relative;
  .bq-header{
    z-index: 0
  }
.bq-isShow{
  width:100%;
  height: 45px;
  // background: red;
  position: absolute;
  z-index: 100;
}
.goodinfo {
  .item {
    width: 100%;
    min-height: 75px;
    background: #fff;
    padding: 10px 15px 10px 10px;
    border-bottom: 1px solid $light-border-color;
    position: relative;
    box-sizing: border-box;
    .yc-mkt-discount {
      left: 10px;
      top: 10px;
    }
    .zeng-discount {
      left: 15px;
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
    img {
      // float: left;
      display: inline-block;
      position: absolute;
      top: 10px;
      left: 15px;
      width: 70px;
      height: 70px;
      border: 1px solid #d8d8d8
    }
    .bq-goods-right{
      // width: 74%;
      padding-left: 90px;
      @include font-dpr(14px);
      overflow: hidden;
      span:nth-child(1){
        overflow: hidden;
       text-overflow: ellipsis;
       display: -webkit-box;
       -webkit-line-clamp: 2;
       -webkit-box-orient: vertical;
      }
      span{
        display: block;
        line-height: 18px;
      }
      span.spec{
        @include text-overflow-1;
      }
      span.last{
        float: left;
      }
      span.gap{
      float: left;
      margin-left: 15px;
      }
    }

  }

    .goods-right{
      width: 30%;
      position: absolute;
      right: 0;
      bottom: 20px;
    }
  }
}
</style>
