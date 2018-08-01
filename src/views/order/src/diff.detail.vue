<template>
  <bq-page class="diff-detail">
    <bq-header title="订单差异详情">
    </bq-header>
    <bq-content>
    <div class="diff-card-item" :hasContent="diff.goodsList&&diff.goodsList.length==0">
      <p class="item-header">差异总数量: {{diff.diffTotalCount}}<span>差异总金额: ￥{{diff.diffTotalMoney}}</span></p>
      <h2>差异商品明细</h2>
      <div class="item-content" v-for="item in diff.goodsList">
        <yc-mkt-discount v-if="item.marketingType===40 && item.isGifts" class="zeng-discount">赠品</yc-mkt-discount>
        <!-- <yc-mkt-discount v-if="item.marketingType === 20">{{ item.marketingRule }}折</yc-mkt-discount> -->
        <yc-activity-icon
          :rule="item.marketingRule"
          type="orderGoodsList"
          :activityType="item.marketingType"
        ></yc-activity-icon>
        <img v-lazy="item.goodsImage" >
        <p>条码：{{item.sku}}</p>
        <p>品名：{{item.goodsName}}</p>
        <p v-if="item.propertyName && item.propertyName !== '无'">
          {{ item.propertyName + '：' + item.propertyValue }}
        </p>
        <p class="spec-unit">
          <span class="spec">规格：{{item.goodsSpec||'无'}}</span>
          <span class="text">单位：{{item.goodsSellUnit||'无'}}</span>
          <span class="clear"></span>
        </p>
        <p>单价：￥{{item.price}}
          <yc-origin-price :goodsInfo="item">
            ￥{{ $bqUtils.moneyFixed(item.originalPrice)}}
          </yc-origin-price>
        </p>
        <div class="count-wrap">
          <div>订货数量：{{item.goodsNum}}</div>
          <div>实收数量：{{item.checkNum}}</div>
          <div>差异数量：{{item.diffNum}}</div>
          <div>差异金额小计：{{item.diffMoney}}</div>
          <div v-if="item.diffDesc&&item.diffDesc.length>0" class="content-footer">差异处理结果：<span>{{item.diffDesc}}</span></div>
        </div>
      </div>
    </div>
    <div class="diff-card-item diff-disc">
      <h2>差异商品凭证-文本描述</h2>
      <div class="item-content">
        <p>{{diff.voucherDes ||'暂无描述'}}</p>
      </div>
    </div>
    <div class="diff-card-item diff-disc" >
      <h2>差异商品凭证－图片证明</h2>
      <div class="item-content" v-if="diff.voucherPicDir">
      <img v-if="diff.voucherPicDir.imgUrl1" v-lazy="diff.voucherPicDir.imgUrl1"/>
      <img v-if="diff.voucherPicDir.imgUrl2" v-lazy="diff.voucherPicDir.imgUrl2"/>
      <img v-if="diff.voucherPicDir.imgUrl3" v-lazy="diff.voucherPicDir.imgUrl3"/>
      </div>
    </div>
    </bq-content>
  </bq-page>
</template>
<script>
import OrderService from '@/services/order.service'
export default {
  data() {
    return {
      diff: {}
    }
  },
  created() {
    this.OrderService = new OrderService()
  },
  mounted() {
    let orderId = this.$route.params.orderId
    this.getDiffInfo(orderId)
  },
  methods: {
    // 查看差异详情
    async getDiffInfo(orderId) {
      let tp = this.$route.params.ty
      if (tp === 'order') {
        this.diff = await this.OrderService.getDiffInfo({orderId})
      } else {
        this.diff = await this.OrderService.getTransInfo({orderId})
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'scss/mixin';
@import 'scss/variables';
.diff-detail {
  background: $bg-color;
  .diff-card-item{
    margin-bottom: 11px;
    background: #fff;
    @include border-zero-5($border-color);
    &:nth-of-type(1) {
      &:after {
        border-top: 0;
      }
    }
    &[hasContent='true'] {
      padding-bottom: 11px;
      h2 {
        margin-bottom: 0;
      }
    }
    .item-header {
      color: $danger;
      background: #fef3cc;
      span {
        float: right;
      }
    }
    .content-footer {
      color: #666;
      background: #fff9e3;
      width: 100%;
      margin: 15px -15px 0;
      span {
        color: $price;
      }
    }
    .item-header, .content-footer {
      @include font-dpr(14px);
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      @include border-zero-5($border-color);
      &:after {
        border-top: none;
        border-left: none;
        border-right: none;
      }
    }
  }
  h2 {
    @include font-dpr(14px);
    line-height: 14px;
    color: $font-color;
    margin: 10px auto 11px 15px;
    padding-left: 5px;
    border-left: 5px solid $danger;
  }
  .item-content {
    padding: 10px 15px 0;
    width: 100%;
    @include border-zero-5($border-color);
    position: relative;
    .yc-mkt-discount{
      left: 15px;
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
    &:after {
      border-bottom: none;
      border-left: none;
      border-right: none;
    }
    img {
      width: 70px;
      height: 60px;
      position: absolute;
      top: 10px;
      left: 15px;
    }
    p {
      @include font-dpr(12px);
      line-height: 19px;
      color: $font-color;
      margin-top: -4px;
      padding-left: 85px;
      &:nth-of-type(3), &:nth-of-type(4) {
        color: #666;
      }
      &.spec-unit{
        overflow: hidden;
        .text, .spec{
          display: block;
          float: left;
        }
        .text {
          margin-left: 20px;
        }
        .spec{
          max-width: 150px;
          @include text-overflow-1;
        }
      }
    }
    div {
      display: inline-block;
      width: 48%;
      color: $font-color;
      @include font-dpr(12px);
      line-height: 21px;
    }
    .count-wrap {
      display: block;
      width: calc(100% - 30px);
      margin-top: 5px;
    }
  }
  .diff-disc {
    padding: 1px 0;
    .item-content {
      margin: 0;
      padding: 0 15px;
      box-sizing: border-box;
    }
    p {
      margin: 0;
      padding: 10px 0;
      line-height: 18px;
    }
    img {
      width: 70px;
      height: 70px;
      float: none;
      margin: 15px 10px;
      &:first-child {
        margin-left: 5px;
      }
    }
  }
}
</style>
