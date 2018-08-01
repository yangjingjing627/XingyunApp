<template>
  <bq-page class="buyer-set">
    <bq-header title="买家信息设置">
    </bq-header>
    <bq-content>
      <bq-card>
        <bq-card-item padding no-margin only class="phone">
          店铺ID：<i>{{param.storeId}}</i>
        </bq-card-item>
        <bq-card-input padding no-margin v-model="param.storeName" :maxlength="30">
          店铺名称：
        </bq-card-input>
        <bq-card-item padding no-margin only class="phone">
          商户电话：<i>{{param.storePhone}}</i>
        </bq-card-item>
        <bq-card-input padding no-margin v-model="param.owerName">
          商户姓名：
        </bq-card-input>
        <bq-card-input padding no-margin v-model="param.address">
          店铺地址：
        </bq-card-input>
      </bq-card>
      <div class="btn">
        <bq-button type="primary" size="large" @click="postInfo">保存</bq-button>
      </div>
    </bq-content>
  </bq-page>
</template>
<script>
import MyService from '@/services/my.service'
export default {
  data() {
    return {
      param: {
        storeName: '',
        storePhone: '',
        owerName: '',
        address: ''
      }
    }
  },
  mounted () {
    this.MyService = new MyService()
    this.getBuyerInfo()
  },
  methods: {
    getBuyerInfo() {
      this.MyService.getBuyerInfo(this.param).then(res => {
        this.param = res
      })
    },
    postInfo() {
      if (!this.param.storeName || !this.param.storePhone || !this.param.owerName || !this.param.address) {
        this.$messagebox.alert('请将信息填写完整')
        return
      }
      if (this.param.storeName.length <= 0) {
        this.$messagebox.alert('请输入店铺名称')
        return
      }
      if (!this.$bqUtils.vRegister(this.param.storeName)) {
        this.$messagebox.alert('店铺名称只允许输入汉字，数字和英文字母')
        return
      }
      if (this.param.owerName.length > 10) {
        this.$messagebox.alert('商户姓名不能超过10个字')
        return
      }
      delete this.param.storeId
      this.MyService.getBuyerInfo(this.param).then(() => {
        this.$messagebox.alert('修改成功')
        this.$router.replace('/me/buyer')
      })
    }
  }
}
</script>
<style lang="scss">
@import 'scss/mixin';
  .buyer-set {
    .bq-card:after {
      border-top: none;
      border-left: none;
      border-right: none;
    }
    input {
      @include font-dpr(14px);
      color: #505050;
    }
    .phone {
      @include font-dpr(14px);
      color: #505050;
      i {
        opacity: .4;
      }
    }
    .bq-input-wrapper .bq-input .text-input {
      margin: 0;
      margin-top: -2px;
    }
    .btn {
      padding: 31px 15px 0 15px;
    }
  }
</style>
