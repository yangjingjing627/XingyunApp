<template>
  <div class="bq-cate">
    <bq-header :title="cateName">
    </bq-header>
    <bq-content ref="content">
      <bq-good-content
        v-if="goodsList.length"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="status.loading"
        infinite-scroll-distance="50"
        infinite-scroll-immediate-check = false>
        <bq-good-item
          class="home-goods-item"
          v-for="good in goodsList"
          :key="good.sku"
          :good="good">
        </bq-good-item>
      </bq-good-content>
      <div class="bq-f-loading" v-show="status.loading && !status.noMoreGoods">
        <bq-triple-bounce></bq-triple-bounce>
      </div>
      <p class="no-goods" v-show="status.noMoreGoods">已加载完所有商品</p>
    </bq-content>
    <div class="gtop" @click="onScrollTop"></div>
  </div>
</template>
<script>
import GoodService from '@/services/goods.service'

export default {
  data() {
    return {
      params: {
        page: 1,
        pageSize: 20,
        type: 1
      },
      status: {
        loading: false,
        noMoreGoods: false
      },
      goodsList: [],
      cateName: '分类名称'
    }
  },
  mounted() {
    this.loadMore()
  },
  async created() {
    this.GoodService = new GoodService()
  },
  methods: {
    async loadMore() {
      if (this.status.loading) {
        return
      }
      this.status.loading = true
      this.params.type = this.type
      if (this.$route.params.cate1) {
        this.params.cateId1 = this.$route.params.cate1
      }
      if (this.$route.params.cate2) {
        this.params.cateId2Str = this.$route.params.cate2
      }
      let {list, next, cateName} = await this.GoodService.getBuyerCateList(this.params)
      if (cateName) {
        this.cateName = cateName
      }
      let nList = list.map(item => {
        if (item.storeList && item.storeList.length > 0) {
          // 商品库存是否全为0
          item.good_empty = true
          // 商品为补货中状态，如果库存减去购物车数量大于等于 订货单位，是非补货状态
          item.storeList.map(sitem => {
            sitem.book = sitem.cartCount
            if (sitem.stock - sitem.cartCount * 1 >= sitem.orderUnit) {
              item.good_empty = false
            }
            return sitem
          })
        }
        return item
      })
      this.goodsList = this.goodsList.concat(nList)
      if (next === 0) {
        this.status.loading = true
        this.status.noMoreGoods = true
      } else {
        this.status.loading = false
        this.status.noMoreGoods = false
        this.params.page = this.params.page + 1
      }
    },
    onScrollTop() {
      this.$refs.content.scrollTo(0)
    }
  },
  computed: {
  },
  components: {
  },
  destroyed () {
  }
}
</script>
<style lang="scss" scoped>
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  .bq-cate {
    padding-bottom: 40px;
    &-headright {
      .mint-button-text {
        color: $font-color;
        @include font-dpr(14px);
      }
    }
    .gtop{
      position: fixed;
      z-index: 1;
      bottom: 50px;
      right: 15px;
      width: 47px;
      height: 47px;
      background: url('../../../assets/img/home/gotop.png') no-repeat;
      background-size: 100%;
      cursor: pointer;
    }
    .no-goods {
      margin-bottom: 50px;
    }
  }
</style>
