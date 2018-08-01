<template>
  <bq-modal class="return-detail-info" v-model="currentVal" title="商品明细">
    <div class="title bq-f-size-14">
      <span>总数量：{{ info.returnNum }}</span>
      <span>总金额：￥{{ $bqUtils.moneyFixed(info.returnPrice) }}</span>
    </div>
    <ul>
      <li v-for="item,index in info.goodsList" :key="item.sku" v-if="item.sku">
        <div class="img">
          <yc-mkt-discount v-if="item.isGifts" class="zeng-discount">赠品</yc-mkt-discount>
          <!-- <yc-mkt-discount v-if="item.marketingType === 20">{{ item.marketingRule }}折</yc-mkt-discount> -->
          <yc-activity-icon
            :rule="item.marketingRule"
            type="orderGoodsList"
            :activityType="item.marketingType"
          ></yc-activity-icon>
          <img v-lazy="item.goodsImage">
        </div>
        <div class="info">
          <p>条码：{{ item.sku }}</p>
          <p>{{ item.goodsName }}</p>
          <p v-if="item.propertyName && item.propertyName !== '无'">
            {{ item.propertyName + '：' + item.propertyValue }}
          </p>
          <p><span>规格：{{ item.spec || '无' }}</span><span class="text">单位：{{ item.unit || '无' }}</span></p>
          <p>单价：￥{{ $bqUtils.moneyFixed(item.price) }}
            <yc-origin-price :goodsInfo="item">
              ￥{{ $bqUtils.moneyFixed(item.originalPrice)}}
            </yc-origin-price>
          </p>
        </div>
        <div class="count1">
          <span>实收数量：{{ item.actualReceiveNum }}</span>
          <span>可退数量：{{ item.returnNum }}</span>
          <span v-if="item.status === 2">卖家实收数量：{{ item.returnCheckNum }}</span>
          <span>金额小计：<i class="money">￥{{ $bqUtils.moneyFixed(item.totalPrice) }}</i></span>
        </div>
        <div class="date">
          <div>生产日期：{{ item.returnTime }}</div>
          <div class="keep1">保质期：{{ item.safeTime }}{{ item.keepType }}</div>
        </div>
      </li>
    </ul>
  </bq-modal>
</template>
<script>
export default {
  name: 'return-info',
  data() {
    return {
      currentVal: this.value || false
    }
  },
  props: {
    info: {},
    value: ''
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
<style lang="scss" scoped>
@import 'scss/variables';
@import 'scss/mixin';

.return-detail-info {
  .title {
    height: 40px;
    line-height: 40px;
    background: #FEF3CC;
    color: $danger;
    padding: 0 15px;
    border-top: 1px solid $light-border-color;
    border-bottom: 1px solid $light-border-color;
    span:last-child{
      float: right;
    }
  }
  li {
    background: #fff;
    padding: 10px 15px;
    border-top: 1px solid $light-border-color;
    border-bottom: 1px solid $light-border-color;
    margin-bottom: 11px;
    .img {
      float: left;
      width: 70px;
      height: 60px;
      text-align: center;
      border: 1px solid $light-border-color;
      position: relative;
      top: 0px;
      img {
        width: 100%;
        height: 100%;
      }
      .zeng-discount {
        left: 0px;
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
    .info {
      width: 70%;
      margin-left: 85px;
      .text {
        margin-left: 37px;
      }
    }
    .count1 {
      margin-top: 20px;
      span {
        @include font-dpr(14px);
        display: inline-block;
      }
      span:nth-child(1) {
        width: 30%;
      }
      span:nth-child(2) {
        width: 30%;
      }
    }
    .date {
      height: 30px;
      @include font-dpr(14px);
      color: #505050;
      line-height: 30px;
      margin-top: 12px;
      div {
        display: inline-block;
      }
      .keep1 {
        float: right;
      }
      .selectdate,.keepdate{
        width: 100px;
        height: 30px;
        border: 1px solid #666666;
        float: right;
      }
    }
  }
  li:first-child {
    border-top: none;
  }
  .money {
    color: $danger;
  }
}
</style>
