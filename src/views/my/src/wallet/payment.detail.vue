<template>
  <bq-page class="bq-page-payment-item">
    <bq-header title="收支明细"></bq-header>
    <bq-content>
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="current.loading"
        infinite-scroll-distance="100"
        infinite-scroll-check-load="true">
        <bq-card v-for="item in list"  :key="item.transactionId" @click.native="$router.push(`/me/wallet/detial/${item.transactionId}`)">
          <bq-card-header :title="item.date" class="card-title" v-if="item.transactionId.length==0"></bq-card-header>
          <bq-card-item padding no-margin :icon="true" class="card-item" v-if="item.transactionId">
            <div class="time">{{item.time}}</div>
            <ul>
              <li>{{item.moneyType==2?'-':item.moneyType==1?'+':''}}￥{{item.transactionMoney}}</li>
              <li>{{item.transactionType}}</li>
            </ul>
          </bq-card-item>
        </bq-card>
        <div v-if="current.isNoMsg==true&&list.length>0" class="no-data-msg">没有更多数据了...</div>
      </div>
    </bq-content>
  </bq-page>
</template>
<script>
import MyService from '@/services/my.service'
export default {
  data() {
    return {
      list: [],
      data: {},
      current: {
        page: 1,
        pageSize: 10,
        loading: false,
        isNoMsg: false
      }
    }
  },
  created() {
    this.MyService = new MyService()
  },
  methods: {
    async loadMore() {
      if (this.current.loading || this.data.next === 0) return
      this.current.loading = true
      try {
        let num = 0
        this.list.map((item) => {
          if (item.transactionId) {
            num++
          }
        })
        if (num < (this.current.page - 1) * this.current.pageSize) return
        this.data = await this.MyService.getTransactionList(this.current)
        this.list = this.list.concat(this.data.list)
        if (this.data.next === 0) {
          this.current.isNoMsg = true
        }
        this.current.page++
        this.current.loading = false
      } catch (e) {
        this.current.loading = false
      }
    }
  }
}
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  .bq-page-payment-item {
    color: $font-color;
    font-size: 14px;
    .card-title {
      color: $danger;
      height: 30px;
      line-height: 30px;
      background: #fef3cc;
      &:after {
        content: none;
      }
    }
    .card-item>div {
      display: flex;
      align-items: center;
      flex: 1;
      &.bq-card-item__right {
        flex: 0;
      }
    }
    .time {
      color: #999;
      flex: 1;
    }
    ul {
      flex: 4;
      li {
        font-size: 12px;
        line-height: 19px;
        color: $font-color;
      }
    }
    .no-data-msg {
      margin: 50px auto;
      text-align: center;
    }
    .bq-card:nth-of-type(1) {
      &:after {
        content: none;
      }
    }
  }
</style>
