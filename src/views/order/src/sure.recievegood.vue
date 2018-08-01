<template>
  <bq-page class="sure-info">
    <bq-header title="确认收货"></bq-header>
    <bq-content>
      <bq-card>
        <bq-card-header class="title" title="重要说明：请根据你实际收到的货物数量填写实收数量！"></bq-card-header>
        <bq-card-content class="header-content">
          <p>订单编号：{{ info.orderCode }}</p>
          <p>下单时间：{{ info.addTime_str }}</p>
        </bq-card-content>
      </bq-card>
      <bq-card v-for="item in info.goodsList" :key="item.sku">
        <bq-card-content padding>
          <div class="good-item">
            <div class="img">
              <!-- <yc-mkt-discount v-if="item.marketingType ===20">{{ item.marketingRule }}折</yc-mkt-discount> -->
              <yc-mkt-discount class="zeng-discount" v-if="item.marketingType ===40 && item.isGifts">赠品</yc-mkt-discount>
              <yc-activity-icon
                :rule="item.marketingRule"
                type="orderGoodsList"
                :activityType="item.marketingType"
              ></yc-activity-icon>
              <bq-card-item v-if="item.show" no-padding class="sel-good">
                <bq-checkbox v-model="item.checked"></bq-checkbox>
              </bq-card-item>
              <img v-lazy="item.goodsImage">
            </div>
            <div class="info">
              <p>商品条码：{{ item.sku }}</p>
              <p>{{ item.goodsName }}</p>
              <p v-if="item.propertyName && item.propertyName !== '无'">
                {{ item.propertyName + '：' + item.propertyValue }}
              </p>
              <p><span class="spec">规格：{{ item.spec || '无' }}</span><span class="text">单位：{{ item.unit || '无' }}</span></p>
            </div>
            <p>单价：￥{{ item.price }}
              <yc-origin-price :goodsInfo="item">
                ￥{{ $bqUtils.moneyFixed(item.originalPrice)}}
              </yc-origin-price>
            </p>
            <div class="count">
              <span>订货数量：{{ item.count }}</span>
              <div><span class="return">实收数量：</span><modify-order :goodsData="item" v-on:modifyOrderEnd = "modifyOrderEnd"></modify-order></div>
            </div>
          </div>
          <p>卖家发货数量：{{ item.sendCount }}</p>
        </bq-card-content>
      </bq-card>
    </bq-content>
    <div class="footer">
      <bq-button size="large" type="primary" @click="sure">确认收货</bq-button>
    </div>
  </bq-page>
</template>
<script>
import OrderService from '@/services/order.service'
import modifyOrder from '@/components/modify/modify.order'

export default {
  data() {
    return {
      val: '',
      info: {},
      time: ''
    }
  },
  mounted () {
    this.OrderService = new OrderService()
    this.getReturnBefore()
  },
  methods: {
    modifyOrderEnd (count) {
      for (let item of this.info.goodsList) {
        if (item.goodsId === count.goodsId) {
          item.goodsNum = count.count
        }
      }
    },
    async getReturnBefore() {
      let params = {
        orderId: this.$route.params.orderId
      }
      let res = await this.OrderService.getOrderDetail(params)
      this.info = res
      let date = new Date(this.info.addTime * 1000)
      let str1 = this.$bqUtils.date2str(date)
      let str2 = this.$bqUtils.time2str(date)
      this.info.addTime_str = str1 + ' ' + str2
      for (let i = 0; i < this.info.goodsList.length; i++) {
        this.info.goodsList[i].dis_substract = true
        this.info.goodsList[i].goodsNum = this.info.goodsList[i].sendCount
      }
    },
    async sure() {
      let goodsList = []
      for (let item of this.info.goodsList) {
        goodsList.push({
          goodsId: item.goodsId,
          goodsNum: item.goodsNum
        })
      }
      let params = {
        orderId: this.$route.params.orderId,
        goodsList: JSON.stringify(goodsList)
      }
      let res = await this.OrderService.postOrderConfirm(params)
      if (res) {
        if (res.goodsList.length > 0) {
          window.location.href = '/order/diffinfoup/' + this.$route.params.orderId
          // this.$router.push('/order/diffinfoup/' + this.$route.params.orderId)
        }
      } else {
        let self = this
        this.time = setInterval(function() {
          self.getStus()
        }, 1000)
      }
    },
    async getStus() {
      let params = {
        redisKey: this.$route.params.orderId,
        type: 3
      }
      try {
        let res = await this.OrderService.operationProgressGet(params)
        if (res.status !== 1) {
          clearInterval(this.time)
          if (res.status === 0) {
            this.$messagebox.alert('恭喜你确认收货成功！订货商品已按照实收数量同步到销售端，为不影响您的正常销售请您到销售端确认商品的零售价和上下架状态是否正确！', {
              confirmButtonText: '继续订货'
            }).then(() => {
              this.$router.push('/category')
            })
          } else {
            this.$messagebox.alert(res.msg)
          }
        }
      } catch (e) {
        clearInterval(this.time)
        this.$messagebox.alert(e.message)
      }
    }
  },
  components: {
    modifyOrder
  }
}
</script>
<style lang="scss" scoped>
@import 'scss/variables';
@import 'scss/mixin';

.sure-info {
  position: relative;
  .bq-card:after {
    border-left: none;
    border-right: none;
  }
  .bq-card {
    margin-bottom: 11px;
  }
  .bq-card:last-child {
    margin-bottom: 52px;
  }
  .bq-card:first-child {
    &:after {
      border-top: none;
    }
    .title {
      height: 40px;
      line-height: 40px;
      background: #FEF3CC;
      font-size: 14px;
      color: $danger;
    }
    .header-content {
      @include font-dpr(14px);
    }
  }
  .bq-card-content {
    position: relative;
    z-index: 3;
    .good-item {
      .img {
        float: left;
        width: 60px;
        height: 60px;
        text-align: center;
        border: 1px solid $light-border-color;
        position: relative;
        top: 0px;
        .sel-good {
          margin: 0;
          padding: 0;
          position: absolute;
          top: -5px;
          left: 0px;
          z-index: 5;
          &:after {
            margin: 0;
            padding: 0;
            background: none;
          }

        }
        img {
          width: 100%;
          height: 100%;
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
      .info {
        width: 70%;
        margin-left: 75px;
        p{
          margin-bottom: 5px;
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
      .count {
        height: 28px;
        line-height: 28px;
        div {
          float: right;
          position: relative;
          .return {
            margin-right: 20px;
          }
        }
      }
      .money {
        color: $danger;
      }
    }
  }
  .footer {
    .mint-button--primary {
      @include font-dpr(16px);
      height: 52px;
    }
    width: 100%;
    position: absolute;
    bottom: 0px;
    z-index: 10;
  }
}
</style>
