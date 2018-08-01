<template>
  <span @click="onScan">
    <slot></slot>
  </span>
</template>
<script>
import WxConfig from '@/config/wx.config'
export default {
  name: 'scan',
  created() {
    this.WxConfig = new WxConfig()
  },
  methods: {
    async onScan() {
      if (!this.$device.isWechat) {
        this.$messagebox.alert('请在微信下打开！')
        return
      }
      let res = await this.WxConfig.scanQRCode()
      let {resultStr} = res
      if (resultStr.indexOf(',')) {
        this.$emit('scan', resultStr.split(',')[1])
      }
    }
  }
}
</script>
