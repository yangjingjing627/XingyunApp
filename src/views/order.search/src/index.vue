<template>
  <bq-page class="bq-page-order-search">
  <bq-header title="订单查询"></bq-header>
  <bq-content>
    <bq-tabs v-model="selected">
      <bq-tab id="1">
        订货查询
      </bq-tab>
      <bq-tab id="2">
        退货查询
      </bq-tab>
    </bq-tabs>
    <bq-tab-content v-model="selected" class="tab-content-box">
      <bq-tab-content-item id="1">
        <bq-card>
          <bq-card-input padding placeholder="请输入订货单号/商品条码/商品名称" v-model="orderData.parameter">
          </bq-card-input>
          <bq-card-item padding fixed placeholder="请选择">
            开始时间 <div class="status-text" @click="showDatePicker(0)" :class="{'init': orderData.startTime == ''}">{{dateFormat(orderData.startTime)}}</div>
          </bq-card-item>
          <bq-card-item padding fixed placeholder="请选择" >
            结束时间  <div class="status-text" @click="showDatePicker(1)" :class="{'init': orderData.endTime == ''}">{{dateFormat(orderData.endTime)}}</div>
          </bq-card-item>
          <bq-card-item padding fixed>
            订单状态  <div class="status-text" @click="showActionSheet(0)">{{orderActionText}}</div>
          </bq-card-item></bq-card>
      </bq-tab-content-item>
      <bq-tab-content-item id="2">
        <bq-card>
          <bq-card-input padding placeholder="请输入退货单号/商品条码/商品名称" v-model="returnData.parameter">
          </bq-card-input>
          <bq-card-item padding fixed>
            开始时间  <div class="status-text" @click="showDatePicker(0)" :class="{'init': returnData.startTime == ''}">{{dateFormat(returnData.startTime)}}</div>
          </bq-card-item>
          <bq-card-item padding fixed >
            结束时间  <div class="status-text" @click="showDatePicker(1)" :class="{'init': returnData.endTime == ''}">{{dateFormat(returnData.endTime)}}</div>
          </bq-card-item>
          <bq-card-item padding fixed >
            退单状态  <div class="status-text" @click="showActionSheet(1)">{{returnActionText}}</div>
          </bq-card-item></bq-card>
      </bq-tab-content-item>
    </bq-tab-content>
    <bq-button type="primary" size="large" class="bq-btn-search" @click="searchList" >开始查询</bq-button>
  </bq-content>
  <bq-datetime-picker
    ref="datePicker"
    type="date"
    v-model="selTab.pickerValue" @confirm="onConfirm"></bq-datetime-picker>
    <bq-action-sheet
      cancelText=""
      :actions="selTab.actions"
      v-model="selTab.sheetVisible">
    </bq-action-sheet>
  </bq-page>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      code: '',
      selected: '1',
      selTab: {
        pickerValue: new Date()
      },
      selType: 1,
      orderData: {
        init: true,
        type: 1,
        parameter: '',
        startTime: '',
        endTime: '',
        actions: [
          { name: '全部', method: () => { this.selType = 1 } },
          {name: '待付款', method: () => { this.selType = 2 }},
          {name: '待收货', method: () => { this.selType = 3 }},
          {name: '已完成', method: () => { this.selType = 4 }},
          {name: '已关闭', method: () => { this.selType = 5 }},
          {name: '待卖家差异审核', method: () => { this.selType = 10 }},
          {name: '待平台差异审核', method: () => { this.selType = 20 }}],
        sheetVisible: false
      },
      returnData: {
        init: true,
        type: 1,
        parameter: '',
        startTime: '',
        endTime: '',
        actions: [
          {name: '全部', method: () => { this.selType = 1 }},
          {name: '退货待审核', method: () => { this.selType = 2 }},
          {name: '退货成功', method: () => { this.selType = 4 }},
          {name: '退货失败', method: () => { this.selType = 5 }}],
        sheetVisible: false
      }
    }
  },
  computed: {
    orderActionText() {
      if (this.selected === '1') {
        if (this.selType === 10) {
          return this.orderData.actions[5].name
        }
        if (this.selType === 20) {
          return this.orderData.actions[6].name
        }
        return this.orderData.actions[this.selType - 1].name
      }
    },
    returnActionText() {
      if (this.selected === '2') {
        return this.returnData.actions[this.selType < 3 ? this.selType - 1 : this.selType - 2].name
      }
    }
  },
  methods: {
    ...mapActions({
      setOrderSearchParams: 'setOrderSearchParams'
    }),
    onConfirm() {
      let timeArr = ['startTime', 'endTime']
      let time = this.$bqUtils.dateFormat(this.selTab.pickerValue, 'yyyy-MM-dd')
      if (this.selected === '1') {
        this.orderData[timeArr[this.code]] = time
      } else if (this.selected === '2') {
        this.returnData[timeArr[this.code]] = time
      }
    },
    async searchList() {
      let typeData = this.selected === '1' ? this.orderData : this.returnData
      typeData.type = this.selType
      let {parameter, startTime, endTime, type} = typeData
      await this.setOrderSearchParams({parameter, startTime, endTime, type})
      this.$router.push({path: `/order/search/result/${this.selected === '1'}`})
    },
    dateFormat(val) {
      if (val === '') return '请选择'
      return this.$bqUtils.dateFormat(new Date(val), 'yyyy-MM-dd')
    },
    showDatePicker(code) { // code 0:开始 1:结束
      this.code = code
      this.$refs.datePicker.open()
    },
    showActionSheet(code) {
      this.selTab = code === 0 ? this.orderData : this.returnData
      this.selTab.sheetVisible = true
    }
  },
  watch: {
    'selected'() {
      this.selType = 1
      this.orderData.parameter = ''
      this.returnData.parameter = ''
    }
  }
}
</script>
<style lang="scss">
  .bq-page-order-search {
    .tab-content-box {
      margin: 11px 0 31px;
    }
    .status-text {
      display: inline-block;
      margin-left: 15px;
      font-size: 14px;
      line-height: 14px;
    }
    .init {
      color: #999;
    }
    .init, .status-text {
      width: calc(100% - 100px);
    }
    .bq-btn-search {
      margin: 0 20px;
      width: calc(100% - 40px);
    }
    .bq-card-item__right {
      flex: 0;
    }
  }
</style>
