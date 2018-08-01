<template>
  <div class="goods-list"
      :iskeybuy="goodsCateId.cateTagId && goodsCateId.goodsCount > 0 && goodsNoCateId.length === 0">
    <bq-good-content  v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="50"
      infinite-scroll-immediate-check = false>
      <bq-good-item
      class="category-goods-item"
      v-for="good in goods" :key="good.sku" :good="good">
      </bq-good-item>
    </bq-good-content>
    <div class="bq-f-loading" v-show="loading && !status.noMoreGoods">
      <bq-triple-bounce></bq-triple-bounce>
    </div>
    <div class="no-goods nogoods-bottom" v-show="status.noMoreGoods && goods.length > 0">已加载完所有商品</div>
    <div class="no-goods nogoods-bottom" v-show="status.noMoreGoods && goods.length === 0">暂无商品</div>
    <div class="pro-bottom-keybuy" v-if="goodsCateId.cateTagId && goodsCateId.goodsCount > 0">
      <span class="pro-bot-num">共<i>{{ goodsCateId.goodsCount }}</i>种商品</span>
      <bq-button class="pro-bot-buy" @click.native="allBuy(goodsCateId.cateTagId, goodsCateId.allInCart)"><i>一键订购</i></bq-button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import GoodService from '@/services/goods.service'
export default {
  data() {
    return {
      sellerId: ''
    }
  },
  computed: {
    ...mapGetters({
      goodsList: 'getGoodsList',
      status: 'getGoodsStatus',
      loading: 'getGoodsLoading',
      goodsCateId: 'getGoodsCate',
      goodsNoCateId: 'getGoodsNoCate'
    }),
    ...mapState({
      cartCount: state => state.cart.cartCount
    }),
    goods() {
      return this.goodsList ? this.$bqUtils.copy(this.goodsList) : []
    }
  },
  mounted() {
    this.GoodService = new GoodService()
  },
  methods: {
    ...mapActions({
      getGoodsList: 'getGoodsList',
      goodsCateId: 'getGoodsCate',
      goodsNoCateId: 'getGoodsNoCate'
      // getCartCount: 'getCartCount'
    }),
    async loadMore () {
      let params = {
        ...this.status.params
      }
      params.page = this.status.params.page + 1
      this.getGoodsList(params)
    },
    async allBuy(cateTagId, allInCart) { // 一键订购
      if (allInCart === 0) { // 接口返回数据 allInCart === 0 表示部分商品未加入买家购物车中 1表示该标签下所有可用商品都已添加入买家购物车中
        try {
          let res = await this.GoodService.getTagGoodBuy({cateTagId: cateTagId})
          // 调整订购车数量
          this.$store.commit('GET_CART_COUNT', (this.cartCount + res * 1))
          let params = {
            ...this.status.params
          }
          params.page = this.status.params.page
          this.getGoodsList(params)
          // this.getCartCount(res)
          this.$messagebox.alert('一键订购成功，请到订货车中修改每个商品具体的订货数量', '', {
            confirmButtonText: '知道了'
          })
        } catch (e) {
        }
      } else if (allInCart === 1) {
        this.$messagebox.alert('该分类套餐下的所有商品都已经在订货车中了，请到订货车中查看', '', {
          confirmButtonText: '知道了'
        }).then(() => {
          // this.$router.push('/home')
        })
      }
    }
  },
  destroyed () {
    this.$store.commit('GET_GOODS_LIST', [])
    this.$store.commit('GET_GOODS_CATE', [])
    this.$store.commit('GET_GOODS_NOCATE', [])
  }
}
</script>
<style lang="scss" scoped>
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
.goods-list{
  // position: relative;
  // bottom: 44px;
  // margin-top: 10px;
  width: 100%;
  background: #fff;
  height: 100%;
  overflow: auto;
  &[iskeybuy=true] {
    padding-bottom: 50px;
  }
  ul{
    display: block;
    width: 100%;
    background: #FBF9F1;
    li{
      margin-bottom: 6px;
      border-bottom: 1px solid $light-border-color;
      .info{
        padding: 10px 15px 10px 65px;
        height: 50px;
        position: relative;
        background: #fff;
        .img{
          @include border-zero-5();
          position: absolute;
          width: 50px;
          height: 50px;
          top: 10px;
          left: 5px;
          .buhuo{
            display: block;
            position: absolute;
            bottom: -1px;
            right: -1px;
            left: 0;
            @include font-dpr(12px);
            text-align: center;
            background: rgba(0,0,0,.5);
            line-height: 20px;
            // width: 100%;
            color: #fff;
          }
          img{
            width: 100%;
            height: 100%;
          }
        }
        .detail{
          h3{
            line-height: 14px;/*no*/
            height: 14px;/*no*/
            @include font-dpr(14px);
            color: $font-color;
            margin-bottom: 8px;
            @include text-overflow-1;
          }
          h4{
            line-height: 12px;/*no*/
            height: 12px;/*no*/
            @include font-dpr(12px);
            color: #666;
            margin-bottom: 4px;
          }
          h4:last-child{
            margin-bottom: 0;
          }
        }
      }
      .seller-index{
        padding: 8px 110px 8px 10px;
        background: #fff;
        position: relative;
        border-top: 1px solid $light-border-color;
        height: 28px;
        p{
          line-height: 28px;
          @include font-dpr(14px);
          color: $font-color;
          i{
            color: $danger;
          }
        }
        .good-list-btn{
          .modify{
            bottom: 10px;
            right: 15px;
          }
        }
      }
      .seller{
        padding: 8px 10px 8px 10px;
        background: #FAFAFA;
        position: relative;
        border-bottom: 1px solid $light-border-color;
        .good-list-btn{
          .modify{
            bottom: 15px;
            right: 15px;
          }
        }
        &:last-child{
          border-bottom: 0;
        }
        .bq-collapse-content{
          padding: 0;
        }
        .good-list-btn{
          .modify{
            bottom: 15px;
            right: 15px;
          }
        }
        p{
          @include font-dpr(12);
          color: $font-color;
          line-height: 20px;
          @include text-overflow-1();
          i{
            color: $danger;
            @include font-dpr(14);
          }
        }
      }
    }
  }
  .pro-bottom-keybuy{
    position: fixed;
    // width: 100%;
    width: 77%;
    height: 44px;
    font-size: 14px;
    line-height: 44px;
    text-align: center;
    background: #FBF9F1;
    // background: red;
    z-index: 5;
    color: $font-color;
    border-bottom: 1px solid #ccc;
    bottom: 0px;
    right: 0;
    display: flex;
    .pro-bot-num{
      flex: 3;
      display: inline-block;
      text-align: left;
      padding-left: 5px;
      i{
        color: #FF8113;
      }
    }
    .pro-bot-buy{
      flex: 1.5;
      display: inline-block;
      background: $danger;
      width: 90px;
      height: 100%;
      line-height: 40px;
      cursor: pointer;
      i {
        font-weight: 200;
        color: #fff;
      }
    }
  }
}
</style>
