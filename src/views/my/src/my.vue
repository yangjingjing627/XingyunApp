<template>
  <div class="my-view">
    <bq-content>
      <div class="top">
        <img src="../../../assets/img/my/chahua.png" alt="">
        <p>{{ info.storeName }}</p>
      </div>
      <bq-card>
        <bq-card-item padding no-margin :icon="true" :href="'/me/wallet'">
          <i class="wallet"></i>
          我的钱包
          <span slot="right">￥{{$bqUtils.moneyFixed(info.balance)}}</span>
        </bq-card-item>
      </bq-card>
      <bq-card>
        <bq-card-item padding no-margin :icon="true" :href="'/me/coupon'">
          <i class="coupon"></i>
          优惠券
          <span slot="right">{{ info.couponNum || 0 }}张</span>
        </bq-card-item>
      </bq-card>
      <bq-card>
        <bq-card-item padding no-margin :icon="true" :href="'/me/buyer'">
          <i class="info"></i>
          买家信息
        </bq-card-item>
      </bq-card>
      <!-- <bq-card>
        <bq-card-item padding no-margin :icon="true" :href="'/me/passwordset'">
          <i class="pay"></i>
          支付密码
        </bq-card-item>
      </bq-card> -->
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
</style>
