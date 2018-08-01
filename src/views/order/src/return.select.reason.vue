<template>
  <bq-page class="returnreason-info">
    <bq-header title="确认退货商品">
    </bq-header>
    <bq-content>
      <bq-card class="remark-box">
        <bq-card-header class="areatext-header" title="备注信息">
          <span class="remark-tip">（不允许输入表情符号和特殊字符）</span>
        </bq-card-header>
        <bq-card-input class="areatext" padding type="textarea" :maxlength="maxRemarkLength" v-model="remark">
        </bq-card-input>
        <span class="remark-count" :class="{full: remark.length == maxRemarkLength}">{{remark.length}}/{{maxRemarkLength}}</span>
      </bq-card>
      <bq-card v-for="item,index in info" :key="item.sku" v-if="item.sku">
        <bq-card-header title="退货商品" v-if="index === '0'"></bq-card-header>
        <bq-card-content padding>
          <div class="img">
            <yc-mkt-discount class="zeng-discount" v-if="item.marketingType ===40 && item.isGifts">赠品</yc-mkt-discount>
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
            <p><span class="spec">规格：{{ item.spec || '无' }}</span><span class="text">单位：{{ item.unit || '无' }}</span></p>
            <p>单价：
              <i>￥{{ $bqUtils.moneyFixed(item.price) }}</i>
              <yc-origin-price :goodsInfo="item">
                ￥{{ $bqUtils.moneyFixed(item.originalPrice)}}
              </yc-origin-price>
            </p>
          </div>
          <div class="count1">
            <span>实收数量：{{ item.receiveCount }}</span>
            <span>退货数量：{{ item.setquantity }}</span>
            <span>金额小计：<i class="money">￥{{ $bqUtils.moneyFixed(item.setquantity*item.price) }}</i></span>
          </div>
          <div class="date">
            <div>生产日期：{{ item.productTime }}</div>
            <div class="keep1">保质期：{{ item.safeTime }}{{ item.keepTypeName }}</div>
          </div>
        </bq-card-content>
      </bq-card>
    </bq-content>
    <bq-card class="footer">
      <bq-card-footer>
        <div class="all-count">
          <div>
            <p class="p1">总数量：{{ info.total }}</p>
            <p>总金额：<i class="money">￥{{ $bqUtils.moneyFixed(info.amount) }}</i></p>
          </div>
        </div>
        <bq-button class="btn" type="primary" @click="submit"><i>提交</i></bq-button>
      </bq-card-footer>
    </bq-card>
  </bq-page>
</template>
<script>
import OrderService from '@/services/order.service'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      remark: '',
      maxRemarkLength: 100
    }
  },
  computed: {
    ...mapState({
      info: state => state.returnorder.orderInfo
    })
  },
  mounted () {
    this.OrderService = new OrderService()
    if (!this.info.total) {
      this.$router.go(-1)
    }
  },
  methods: {
    async submit() {
      if (this.remark.replace(/(^\s*)|(\s*$)/g, '') === '') {
        this.$messagebox.alert('请填写备注信息!')
        return
      }
      let goodsList = []
      for (let i in this.info) {
        if (this.info[i].goodsId) {
          goodsList.push({
            goodsId: this.info[i].goodsId,
            returnNum: this.info[i].setquantity,
            productTime: this.info[i].productTime,
            safeTime: parseInt(this.info[i].safeTime),
            safeType: this.info[i].keepType
          })
        }
      }
      let params = {
        orderId: this.$route.params.orderId,
        remark: this.remark,
        goodsList: JSON.stringify(goodsList)
      }
      await this.OrderService.postReturnSubmit(params)
      this.$store.commit('GET_RETURN_ORDERLIST', [])
      this.onConfirmZDY()
    },
    onConfirmZDY() {
      this.$messagebox.confirm('恭喜你退货单提交成功', '', {
        confirmButtonClass: 'bq-msg-confirm-ok',
        confirmButtonText: '查看订货单',
        cancelButtonClass: 'bq-msg-confirm-cancel',
        cancelButtonText: '查看退货单'
      }).then(() => {
        this.$router.push('/order')
      }).catch(() => {
        // 跳转退货单列表 type = 100
        this.$router.push({name: 'order', params: {type: '100'}})
      })
    }
  },
  beforeDestroy () {
    this.$store.commit('GET_RETURN_ORDERINFO', {})
  }
}
</script>
<style lang="scss" scoped>
@import 'scss/variables';
@import 'scss/mixin';
.returnreason-info {
  .bq-card:after {
    border-left: none;
    border-right: none;
  }
  .bq-card:first-child {
    &:after {
      border-top: none;
    }
  }
  .bq-card:first-child {
    margin-bottom: 10px;
  }
  .bq-card {
    margin-bottom: 11px;
  }
  .bq-card:last-child {
    margin-bottom: 52px;
  }
  .areatext {
    &:after {
      content: none;
    }
  }
  .areatext-header:first-child{
    .remark-tip{
      color: #666;
      @include font-dpr(12px);
    }
    &:after {
      border-bottom: none;
    }
  }
  .bq-card-header:before {
    content: '';
    width: 5px;
    height: 15px;
    background: $danger;
    float: left;
    margin: 9px 5px 0 0;
  }
  .bq-card:first-child{
    padding-bottom: 2px;
  }
  .areatext{
    padding: 0px 19px;
    height: 127px;
    @include font-dpr(14px);
    border: 1px solid $light-border-color;
    margin-bottom: 10px;
  }
  .bq-card-content {
    .img {
      float: left;
      width: 60px;
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
      margin-left: 75px;
      p{
        overflow: hidden;
      }
      .text, .spec{
        display: inline-block;
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
  .footer {
    width: 100%;
    margin: 0;
    position: absolute;
    left: 0px;
    bottom: -52px;
    z-index: 10;
    .bq-card:after {
      border: none;
    }
    .mint-button--primary {
      i {
        @include font-dpr(16px);
      }
    }
    .all-count {
      height: 52px;
      position: absolute;
      left: 15px;
      display: flex;
	    align-items: center;
      @include font-dpr(14px);
    }
    .btn {
      width: 140px;
      height: 52px;
      line-height: 52px;
    }
    .bq-card-footer {
      padding-right: 0;
    }
  }
  .footer:after {
    border-top: none;
  }
  .money {
    color: $danger;
  }
  .bq-card {
    &.remark-box {
      padding-bottom: 20px;
      .bq-input-wrapper:after {
        background: none;
      }
    }
  }
  .remark-count {
    float: right;
    margin-right: 15px;
    @include font-dpr(14px);
    &.full {
      color: #FF4E13;
    }
  }
}
</style>
