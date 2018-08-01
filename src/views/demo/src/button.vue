<template>
  <bq-page class="demo-button">
    <bq-header title="button"></bq-header>
    <bq-content padding has-footer>
      <bq-button type="primary" size="large">large primary</bq-button>
      <br>
      <bq-button type="danger" size="large">danger default</bq-button>
      <br>
      <bq-button type="default" size="large">large default</bq-button>
      <br>
      <bq-button size="small" type="primary">small</bq-button>
      <bq-button size="small" type="danger">danger</bq-button>
      <bq-button size="normal" type="default">normal</bq-button>
      <bq-button size="normal" type="primary" @click="onMsg">on messagebox</bq-button>
      <bq-button size="normal" type="primary" @click="onConfirm">on messagebox confirm</bq-button>
      <bq-button size="normal" type="primary" @click="onConfirmZDY">on messagebox confirm 自定义</bq-button>
      <bq-button size="normal" type="primary" @click="onToast">on toast</bq-button>
      <bq-button size="normal" type="primary" @click="onActionsheet">on Actionsheet</bq-button>
      <bq-button size="normal" type="primary" @click="goPay()">去支付</bq-button>
    </bq-content>
    <bq-action-sheet
      cancelText=""
      :actions="actions"
      v-model="sheetVisible">
    </bq-action-sheet>
    <bq-footer>
      <bq-button type="primary" size="large">确认收货</bq-button>
    </bq-footer>
  </bq-page>
</template>
<script>
export default {
  data() {
    return {
      sheetVisible: false,
      actions: [{name: '全部'}, {name: '待付款'}, {name: '待收货'}, {name: '已完成'}, {name: '已关闭'}]
    }
  },
  methods: {
    goPay() {
      console.log(11)
    },
    onMsg() {
      this.$messagebox.alert('充值成功', '', {
        confirmButtonText: '重新选购'
      }).then(action => {
        console.log(action)
      })
    },
    onToast() {
      this.$toast({
        message: '恭喜您，提现成功!',
        duration: 200000
      })
    },
    onConfirm() {
      this.$messagebox.confirm('订货商品已按你确认的实收数量同步更新到倍全商户APP商品管理的可售库存中！', '操作提示').then(action => {
        console.log(action)
      })
    },
    onConfirmZDY() {
      this.$messagebox.confirm('订货商品已按你确认的实收数量同步更新到倍全商户APP商品管理的可售库存中！', '操作提示', {
        confirmButtonClass: 'bq-msg-confirm-ok',
        confirmButtonText: '查看商品',
        cancelButtonClass: 'bq-msg-confirm-cancel',
        cancelButtonText: '继续订货'
      }).then(action => {
        console.log(action)
      })
    },
    onActionsheet() {
      this.sheetVisible = true
    }
  }
}
</script>
