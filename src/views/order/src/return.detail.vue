<template>
  <bq-page class="return-detail">
    <bq-header title="退货单详情">
    </bq-header>
    <bq-content>
      <bq-card>
        <bq-card-content class="bq-f-size-14">
          <p>退货状态：{{ info.status_str }}</p>
          <p>退货单号：{{ info.returnOrderCode }}</p>
          <p>退货时间：{{ info.returnTime }}</p>
          <p><span>退货申请数量：{{ info.returnNum }}</span><span class="returnPrice">退货金额：￥{{ $bqUtils.moneyFixed(info.returnPrice) }}</span> </p>
        </bq-card-content>
      </bq-card>
      <bq-card>
        <bq-card-header title="商品明细"></bq-card-header>
        <bq-card-item padding :icon="true" @click.native="showReturnInfo">
          <span slot="right" class="bq-f-size-12">共<b>{{ info.goodsList.length }}</b>种,总数{{info.goodsCount}}</span>
          <item-img :getGoodImg= "info.goodsList"></item-img>
        </bq-card-item>
      </bq-card>
      <bq-card>
        <bq-card-header title="备注信息"></bq-card-header>
        <bq-card-content>
          <p class="bq-f-size-14 remark">{{ info.remark }}</p>
        </bq-card-content>
      </bq-card>
      <bq-card v-if="info.status === 3">
        <bq-card-header title="退货失败原因"></bq-card-header>
        <bq-card-content>
          <p class="bq-f-size-14 remark">{{ info.reason }}</p>
        </bq-card-content>
      </bq-card>
    </bq-content>
    <bq-card class="footer" v-if="info.status === 0">
      <bq-card-footer>
        <bq-button class="btn" type="primary" @click="submit"><i>取消退货</i></bq-button>
      </bq-card-footer>
    </bq-card>
    <return-info v-model="showInfo" :info="info"></return-info>
  </bq-page>
</template>
<script>
import OrderService from '@/services/order.service'
export default {
  data() {
    return {
      showInfo: false,
      info: {
        goodsList: []
      }
    }
  },
  mounted () {
    this.OrderService = new OrderService()
    this.getReturnDetail()
  },
  methods: {
    showReturnInfo() {
      this.showInfo = true
    },
    async getReturnDetail() {
      let params = {
        returnOrderId: this.$route.params.orderId
      }
      let res = await this.OrderService.getReturnDetail(params)
      this.info = res
      if (this.info.status === 0) {
        this.info.status_str = '退货待审核'
      } else if (this.info.status === 1) {
        this.info.status_str = '待收货确认'
      } else if (this.info.status === 2) {
        this.info.status_str = '退货成功'
      } else if (this.info.status === 3) {
        this.info.status_str = '退货失败'
      }
    },
    submit() {
      this.$messagebox.confirm('你确定要取消退货吗？', '', {
        confirmButtonClass: 'bq-msg-confirm-ok',
        confirmButtonText: '确定',
        cancelButtonClass: 'bq-msg-confirm-cancel',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          returnOrderId: this.$route.params.orderId
        }
        this.OrderService.ReturnCancle(params).then(() => {
          this.info.status = 3
          this.$messagebox.alert('订单已取消')
        })
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'scss/variables';
@import 'scss/mixin';
.return-detail {
  .bq-card:after {
    border-left: none;
    border-right: none;
  }
  .bq-card-item[padding] {
     padding: 0;
   }
  .bq-card:first-child {
    &:after {
      border-top: none;
    }
  }
  .bq-card {
    margin-bottom: 11px;
    .returnPrice {
      margin-left: 30px;
    }
    .remark {
      word-wrap: break-word;
    }
  }
  .footer {
    width: 100%;
    margin: 0;
    position: absolute;
    left: 0px;
    bottom: 0px;
    z-index: 10;
    .bq-card:after {
      border: none;
    }
    .mint-button--primary {
      i {
        @include font-dpr(16px);
      }
    }
    .btn {
      width: 140px;
      height: 52px;
    }
    .bq-card-footer {
      padding-right: 0;
    }
  }
  .footer:after {
    border-top: none;
  }
}
</style>
