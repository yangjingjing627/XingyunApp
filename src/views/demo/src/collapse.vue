<template>
  <bq-page class="demo-collapse">
    <bq-header title="collapse"></bq-header>
    <bq-content >
      <bq-collapse>
        <bq-collapse-header>哈哈哈</bq-collapse-header>
        <bq-collapse-content>
          <h1>哈哈哈</h1>
          <item>
            <item-img :content="2" v-model="val" @on-say="onHello">
            </item-img>
          </item>
        </bq-collapse-content>
      </bq-collapse>
    </bq-content>
  </bq-page>
</template>
<script>
export default {
  data() {
    return {
      val: '111'
    }
  },
  methods: {
    onHello(val) {
      console.log(val)
    }
  }
}
</script>
