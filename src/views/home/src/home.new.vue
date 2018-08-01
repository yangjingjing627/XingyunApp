<template>
  <div class="home">
    <header>
      <div class="logo">
      </div>
      <div class="search" @click="onChangeSearch()">
        <i class="bq-icon-home-search"></i>
        <input placeholder="请输入商品名称/条码" :value="params.parameter">
      </div>
      <div class="btns">
        <scan @scan="onScan">
          <bq-button>
            <i slot="icon" class="bq-icon-home-scan"></i>
          </bq-button>
        </scan>
      </div>
    </header>
    <tabs v-if="isShowTopTab" v-model="selectedHome" @tab="loadGoods()"></tabs>
    <bq-content has-footer @scroll="resetScrollVariable" ref="content" >
      <bq-swipe :auto="5000" class="banner">
        <bq-swipe-item v-for="(item,index) in bannerList" :key="'banner'+index">
          <a @click="bannerFun(item)" >
            <img class="banner-bg" :src="item.programPic || 'http://ogd5wcvme.bkt.clouddn.com/no-img.png'" >
          </a>
        </bq-swipe-item>
      </bq-swipe>
      <single></single>
      <!-- <assemble></assemble>
      <brand></brand> -->
      <tabs id="tab" v-model="selectedHome" @tab="loadGoods()"></tabs>
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
      <p class="no-goods" v-show="status.noSearchGoods">暂未找到您要搜索的商品</p>
    </bq-content>
    <user-gifts v-if="showGifts" :info="giftsInfo" :type="register" :tagShow="tagShow" @closeDialog="closeGiftsDialog"></user-gifts>
  </div>
</template>
<script>
import HomeService from '@/services/home.service'
import GoodService from '@/services/goods.service'
import single from './single/single'
import { goPage } from './home'
// import assemble from './assemble/assemble'
// import brand from './brand/brand'
import tabs from './common/tabs.vue'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      showGifts: false,
      bannerList: [],
      selectedHome: 'allclassification',
      params: {
        page: 1,
        pageSize: 20,
        type: 5
      },
      register: 1,
      tagShow: {
        isRotate: false,
        couponShow: false,
        failShow: false
      },
      status: {
        loading: false,
        noMoreGoods: false
      },
      goodsList: [],
      isShowTopTab: false
    }
  },
  computed: {
    noMoreGoods () {
      return this.status.noMoreGoods && this.goodsList.length > 0
    },
    noSearchGoods() {
      return this.status.noMoreGoods && this.params.parameter && this.params.parameter.length > 0 && this.goodsList.length === 0
    },
    ...mapState({
      giftsInfo: state => state.usergifts.info
    })
  },
  async created() {
    this.GoodService = new GoodService()
    this.HomeService = new HomeService()
    let bannerList = await this.HomeService.bannerList()
    this.bannerList = bannerList
  },
  mounted() {
    if (this.giftsInfo && this.giftsInfo.couponList && this.giftsInfo.couponList.length > 0) {
      this.showGifts = true
    }
    this.loadMore()
    this.$tab = $('#tab')
    this.$content = $(this.$refs.content.$el)
  },
  methods: {
    closeGiftsDialog() {
      this.giftsInfo = {}
      this.showGifts = false
    },
    resetScrollVariable(e) {
      // 处理 tabs 悬停
      let scrollTop = e.target.scrollTop
      if (this.$tab[0].getBoundingClientRect().top <= 2) {
        this.isShowTopTab = true
      } else {
        this.isShowTopTab = false
      }
      this.$emit('resetScrollVariable', scrollTop, this.$refs.content)
    },
    goToCart() {
      this.$router.push('/cart')
    },
    goCategory() {
      this.$router.push('/category')
    },
    async loadGoods() {
      this.params.page = 1
      this.status.loading = false
      this.status.noMoreGoods = false
      this.goodsList = []
      this.type = this.getSelType()
      this.params.parameter = null
      // 方式搜索值遗留引起的问题
      delete this.params.parameter
      this.loadMore()
    },
    async loadMore() {
      if (this.status.loading) {
        return
      }
      this.status.loading = true
      this.type = this.getSelType()
      this.params.type = this.type
      if (this.$route.params.id) {
        this.params.sellerId = this.$route.params.id
      }
      let {list, next} = await this.GoodService.getCateGoodsList(this.params)
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
    getSelType() {
      switch (this.selectedHome) {
        case 'new':
          return 1
        case 'selling':
          return 2
        case 'oftenbuy':
          return 3
        case 'allclassification':
          return 5
      }
    },
    onChangeSearch() {
      this.$router.push({name: 'SearchNew'})
      // let value = e.target.value || ''
      // if (value.length > 0) {
      //   this.params.parameter = value
      //   this.goodsList = []
      //   this.params.page = 1
      //   this.status.loading = false
      //   this.status.noMoreGoods = false
      //   this.loadMore()
      //   return
      // }
      // if (value.length === 0) {
      //   this.params.parameter = null
      //   this.loadGoods()
      // }
    },
    onScan(val) {
      this.params.parameter = val
      this.goodsList = []
      this.params.page = 1
      this.status.loading = false
      this.status.noMoreGoods = false
      this.loadMore()
    },
    bannerFun (item) {
      console.log(item)
      goPage(this.$router, item)
    }
  },
  components: {
    'single': single,
    tabs: tabs
    // 'assemble': assemble,
    // 'brand': brand
  }
}
</script>

<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  $iconImgUrl:'../../../assets/img';
  .home {
    width: 100%;
    height: 100%;
    overflow: hidden;
    #topTab {
      display: none;
      &.active {
        display: block;
      }
    }
    .bq-content{
      top: 45px;
    }
    header {
      padding: 0 17px;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 44px;
      display: flex;
      align-items: center;
      background: #fff;
      border-bottom: 1px solid #f1f1f1;
      // background: url(#{$iconImgUrl}/home/top-back.png) no-repeat;
      // background-size: 100% 100%;
      // z-index: 5;
      .logo{
        width: 45px;
        height: 22px;
        padding-right: 13px;
        background: url(#{$iconImgUrl}/logo.png) no-repeat;
        background-size: 45px;
      }
      .search {
        flex: 1;
        height: 28px;
        position: relative;
        padding-right: 30px;
        background: #E5E5E5;
        border-radius: 54px;
        input {
          width: 100%;
          height: 27px;
          line-height: 27px;
          border-radius: 2px;
          padding: 0;
          padding-left: 34px;
          color: #999;
          @include font-dpr(12px);
          @include appearance(none);
          // background: rgba(255,255,255, .4);
          border: none;
          font-weight: 300!important;
          // letter-spacing: 2px;
          // opacity: .8;
          &::-webkit-input-placeholder {
            text-indent: 0;
            color: #999;
            @include font-dpr(12px);
            font-weight: 300!important;
            // letter-spacing: 2px;
          }
        }
        i {
          position: absolute;
          top: 5px;
          left: 10px;
        }
      }
      .bq-icon-home {
        &-search {
          @include baseIcon('/home/searchblack.png');
        }
        &-scan {
          @include baseIcon('/home/scanblack.png', 25px, 25px) {
            top: -3px;
          };
        }
      }
      .btns {
        width: 80px;
        padding-left: 10px;
        display: flex;
        align-items: center;
        .mint-button {
          height: 27px;
          width: 35px;
          margin-left: 10px;
          background: none;
          border: none;
          padding: 0;
        }
      }
    }
    // .bq-content {
    //   top: 0;
    // }
    .banner {
      height: 130px;
      margin-bottom: 10px;
      &-bg {
        width: 100%;
        height: 100%;
      }
    }
    @each $item in new, selling, oftenbuy, allclassification {
      .bq-icon-home-#{$item} {
        @include baseIcon('/home/#{$item}.png', 33px, 33px);
      }
    }
    .home-tabs {
      height: 44px;
      padding: 12px 0;
      box-sizing: border-box;
      margin-bottom: 1px;
      .mint-tab-item {
        padding: 0 20px;
        border-right: 1px solid #e5e5e5;
        &:last-child{
          border-right: 0;
        }
      }
      // .mint-tab-item-icon {
      //   width: 33px;
      //   height: 33px;
      // }
      .mint-tab-item-label {
        font-size: 12px;
        @include font-dpr(14px);
        line-height: 20px;
      }
      .is-selected {
        .mint-tab-item-label {
          color: $font-color;
          font-weight: normal;
          &:after {
            bottom: -14px;
            height: 3px;
          }
        }
      }
    }
    // &-goods-item {
    //   .info {
    //     padding: 10px 37px 13px 85px;
    //     .detail {
    //       h3 {
    //         @include font-dpr(16px);
    //         line-height: 16px;
    //         height: 16px;
    //         padding: 0px 0;
    //         margin-bottom: 5px;
    //       }
    //       h4 {
    //         // display: inline-block;
    //         margin: 0;
    //         font-size: 14px;
    //         line-height: 16px;
    //         height: 16px;
    //         vertical-align: middle;
    //         // margin-right: 30px;
    //       }
    //     }
    //     .img {
    //       width: 60px;
    //       height: 60px;
    //       left: 15px;
    //     }
    //   }
    //   .seller {
    //     padding-left: 15px;
    //     p {
    //       @include font-dpr(12px);
    //     }
    //     .good-list-btn {
    //       .modify {
    //         right: 10px;
    //       }
    //     }
    //   }
    // }
  }
</style>
