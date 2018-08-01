<template>
  <bq-page class="demo-card">
    <bq-header title="tabs"></bq-header>
    <bq-content has-footer>
      <bq-tabs v-model="selected" :fixed="false">
        <bq-tab id="1">
          全部订货单查询
        </bq-tab>
        <bq-tab id="2">
          退货单查询
        </bq-tab>
      </bq-tabs>
      <bq-tab-content v-model="selected" >
        <bq-tab-content-item id="1">
          <bq-card>
            <bq-card-input padding fixed placeholder="请选择">
              开始时间
            </bq-card-input>
            <bq-card-input padding fixed placeholder="请选择"  >
              结束时间
            </bq-card-input>
            <bq-card-input padding fixed placeholder="全部" >
              订单状态
            </bq-card-input>
            <bq-card-item padding  >
              switch
              <div slot="right">
                <bq-switch v-model="input"></bq-switch>
              </div>
            </bq-card-item>
          </bq-card>
        </bq-tab-content-item>
        <bq-tab-content-item id="2">
          哈哈哈哈哈  我是退货单查询
        </bq-tab-content-item>
      </bq-tab-content>
    </bq-content>
    <bq-footer >
      <bq-tabs v-model="selectedHome" :fixed="true">
        <bq-tab id="h1">
          首页
        </bq-tab>
        <bq-tab id="h2">
          购物车
        </bq-tab>
        <bq-tab id="h3">
          我的
        </bq-tab>
        <bq-tab id="h4">
          闪送超市
        </bq-tab>
      </bq-tabs>
    </bq-footer>
  </bq-page>
</template>
<script>
export default {
  data() {
    return {
      selected: '1',
      selectedHome: 'h1',
      input: true
    }
  },
  watch: {
    selectedHome(val) {
      console.log(val)
    }
  }
}
</script>
