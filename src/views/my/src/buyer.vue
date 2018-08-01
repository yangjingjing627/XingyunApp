<template>
  <bq-page class="buyer-info">
    <bq-header title="买家信息">
      <bq-button slot="right" @click="setInfo">
        设置
      </bq-button>
    </bq-header>
    <bq-content>
      <bq-card>
        <bq-card-item padding no-margin>
          店铺ID：{{ info.storeId }}
        </bq-card-item>
        <bq-card-item padding no-margin>
          店铺名称：{{ info.storeName }}
        </bq-card-item>
        <bq-card-item padding no-margin>
          商户电话：{{ info.storePhone }}
        </bq-card-item>
        <bq-card-item padding no-margin>
          商户姓名：{{ info.owerName }}
        </bq-card-item>
        <bq-card-item padding no-margin>
          店铺地址：{{ info.address }}
        </bq-card-item>
      </bq-card>
    </bq-content>
  </bq-page>
</template>
<script>
import MyService from '@/services/my.service'
export default {
  data() {
    return {
      info: []
    }
  },
  mounted () {
    this.MyService = new MyService()
    this.getBuyerInfo()
  },
  methods: {
    getBuyerInfo() {
      let params = {}
      this.MyService.getBuyerInfo(params).then(res => {
        this.info = res
        setTimeout(() => {
          this.$store.commit('UPDATE_LOADING', { isLoading: false })
        }, 200)
      })
    },
    setInfo() {
      this.$router.push('/me/buyer/setinfo')
    }
  }
}
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  .buyer-info {
    .bq-card:after {
      border-top: none;
      border-left: none;
      border-right: none;
    }
    .bq-card-item__info {
      @include text-overflow-1;
    }
    .bq-card-item__right {
      display: none;
    }
  }
</style>
