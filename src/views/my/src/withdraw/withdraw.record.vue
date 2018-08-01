<template>
  <bq-page class="bq-page-payment-item">
    <bq-header title="提现记录"></bq-header>
    <bq-content>
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="current.loading"
        infinite-scroll-distance="100"
        infinite-scroll-check-load="true">
        <bq-card v-for="item in list"  :key="item.recordId" @click.native="$router.push(`/me/withdraw/detail/${item.recordId}`)">
          <bq-card-item padding no-margin :icon="true" class="card-item">
            <ul>
              <li>{{item.withDrawMoney}}</li>
              <li>{{item.withDrawTime}}</li>
            </ul>
            <div class="time" :class="{'red': item.status == 3, 'green': item.status == 2}">{{ item.statusDesc }}</div>
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
        if (this.list.length < (this.current.page - 1) * this.current.pageSize) return
        delete this.current.isNoMsg
        delete this.current.loading
        this.data = await this.MyService.getWithDrawRecord(this.current)
        this.list = this.list.concat(this.data.dataList)
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
      flex: 1;
      font-size: 14px;
      color: #333333;
      line-height: 14px;
    }
    .red{
      color: red;
    }
    .green{
      color: green;
    }
    ul {
      flex: 4;
      li {
        font-size: 12px;
        line-height: 19px;
        color: $font-color;
      }
      li:nth-child(1) {
        font-size: 20px;
        color: #333333;
        padding-bottom: 8px;
        line-height: 19px;
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
