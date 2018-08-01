<template>
  <bq-page>
    <bq-header title="设置">
    </bq-header>
    <bq-content>
      <bq-card margin-top>
        <bq-card-item padding class="settxt">
          是否开启订货车自动补货
          <div slot="right">
            <bq-switch v-model="status" @change="setConfig"></bq-switch>
          </div>
        </bq-card-item>
      </bq-card>
      <bq-card margin-top>
        <bq-card-item padding no-margin :icon="true" :href="'/me/resetpassword/getcode'">
          登录密码重置
        </bq-card-item>
      </bq-card>
      <bq-card margin-top>
        <bq-card-item padding no-margin :icon="true" :href="'/me/passwordset/getcode/1'">
          支付密码设置
        </bq-card-item>
      </bq-card>
    </bq-content>
  </bq-page>
</template>
<script>
import MyService from '@/services/my.service.js'
export default {
  data () {
    return {
      confCode: '',
      status: false
    }
  },
  async created () {
    this.MyService = new MyService()
    let res = await this.MyService.getConfigSet()
    this.confCode = res[0].confCode
    this.status = res[0].status === 0
  },
  methods: {
    async setConfig() {
      let params = {}
      params.confCode = this.confCode
      params.onOff = this.status ? 0 : 1
      let res = await this.MyService.setConfigSet(params)
      if (res !== true) {
        this.status = !this.status
      }
    }
  }
}
</script>
<style lang="scss">
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
.settxt {
  .bq-card-item__info {
    color: $font-color;
  }
}
</style>
