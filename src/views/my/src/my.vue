<template>
  <div class="my-view">
    <bq-content>
      <bq-card>
        <bq-card-item padding no-margin :icon="true" :href="'/me/wallet'">
          <i class="wallet"></i>
          头像
          <span slot="right">￥7384485</span>
        </bq-card-item>
      </bq-card>
      <bq-card>
        <bq-card-item padding no-margin :icon="true" :href="'/me/coupon'">
          <i class="coupon"></i>
          昵称
          <span slot="right">0张</span>
        </bq-card-item>
      </bq-card>
      <bq-card>
        <bq-card-item padding no-margin :icon="true" :href="'/me/buyer'">
          <i class="info"></i>
          买家信息
        </bq-card-item>
      </bq-card>
      <bq-card>
        <bq-card-item padding no-margin :icon="true" :href="'/me/set'">
          <i class="set"></i>
          设置
        </bq-card-item>
      </bq-card>
      <div class="btn">
        <bq-button type="primary" size="large" @click="onExit">退出</bq-button>
      </div>
    </bq-content>
  </div>
</template>
<script>
import MyService from '@/services/my.service'
import UserService from '@/services/user.service'
export default {
  data() {
    return {
      info: []
    }
  },
  mounted () {
    this.MyService = new MyService()
    this.UserService = new UserService()
    this.getMyInfo()
  },
  methods: {
    async getMyInfo() {
      try {
        let res = await this.MyService.getMyInfo()
        this.info = res
      } finally {
        this.$store.commit('UPDATE_LOADING', { isLoading: false })
      }
    },
    onExit() {
      this.$messagebox.confirm('您确定要退出吗？', '').then(() => {
        this.logout()
      }).catch(() => {
      })
    },
    async logout () {
      await this.UserService.loginOut({})
      let arr = ['uid', 'token', 'uname']
      bq.isDevelopment && arr.push('openid')
      arr.forEach(key => {
        this.$cookie.set(key, null, {
          path: '/',
          expires: new Date(0)
        })
      })
      window.location.reload()
    }
  }
}
</script>
<style lang="scss" scoped>
@import './my.scss';
.bq-content {
  top: 0;
}
.bq-card:after {
  border: 0;
}
.bq-card-item {
  color: #FFF;
}
</style>
