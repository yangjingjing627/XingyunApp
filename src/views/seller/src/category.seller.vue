<template>
  <bq-page>
    <div class="header">
      <div class="top">
        <a @click="$router.go(-1)"><i class="bq-icon-back"></i></a>
        <p>{{ seller.sellerName }}</p>
        <a @click="goCart()">
          <i class="bq-icon-cart"></i>&nbsp;&nbsp;
          <cart-count></cart-count>
        </a>
      </div>
      <div class="header-content" @click="showInfo" :class="{'hide-style': !showall}">
        <p>{{ seller.minDeliveryAmount }}元起送</p>
        <p class="desc" :class="{'hide-desc': showall}">{{ seller.remark }}</p>
        <template v-for="(activity, index) in seller.activityList" >
          <p v-if="activity.activityType === 10" :key="activity.activityId">
            <yc-mkt-label type="manjian" size="max"></yc-mkt-label>
            {{ JSON.parse(activity.activityRule).join('; ') }}
            <span class="mkt-right" v-if="!showall && seller.activityList.length > 1 && index === 0">
              {{ seller.activityList.length }}个活动
            </span>
          </p>
          <p v-if="activity.activityType === 20" :key="activity.activityId">
            <yc-mkt-label type="chuxiao" size="max"></yc-mkt-label>
            <span>{{ JSON.parse(activity.activityRule).join('') }}</span>
            <span class="mkt-right" v-if="!showall && seller.activityList.length > 1 && index === 0">
              {{ seller.activityList.length }}个活动
            </span>
          </p>
          <p v-if="activity.activityType === 40" :key="activity.activityId">
            <yc-mkt-label type="maizeng" size="max"></yc-mkt-label>
            <span>购买指定商品有赠品，赠完为止</span>
            <span class="mkt-right" v-if="!showall && seller.activityList.length > 1 && index === 0">
              {{ seller.activityList.length }}个活动
            </span>
          </p>
          <p v-if="activity.activityType === 50" :key="activity.activityId">
            <yc-mkt-label type="zuhe"></yc-mkt-label>
            <span>购买带组合立减标签中的组合套餐部分商品会享受更优惠的价格！</span>
            <span class="mkt-right" v-if="!showall && seller.activityList.length > 1 && index === 0">
              {{ seller.activityList.length }}个活动
            </span>
          </p>
          <p v-if="activity.activityType === 60" :key="activity.activityId">
            <yc-mkt-label type="zhijiang"></yc-mkt-label>
            <span>购买带有直降标签的商品会享受更优惠的价格！</span>
            <span class="mkt-right" v-if="!showall && seller.activityList.length > 1 && index === 0">
              {{ seller.activityList.length }}个活动
            </span>
          </p>
        </template>
        <p v-if="seller.couponActivityType === 20">
          <span class="label">返券</span>
          <span>现在下单将有机会获得卖家返还的现金优惠券!</span>
        </p>
        <i class="icon-up" :class="{'icon-down': showall}"></i>
        <div v-show="showall" class="moreinfo">
          <div class="line"></div>
          <div class="title">卖家信息</div>
          <p>
            卖家电话：{{seller.storePhone}}<br>
            卖家地址：{{seller.storeAddress}}
          </p>
        </div>
      </div>
    </div>
    <div class="content">
      <!-- <search-bar v-model="searchKey" @input="onChangeSearch" @scan="onScan"></search-bar> -->
      <bq-card class="search-bar">
        <scan @scan="onScan">
          <i class="scan"></i>
        </scan>
        <bq-card-input v-model="searchKey" padding fixed placeholder="输入商品名称／条码" @click.native="onSearch()">
          <i class="search"></i>
        </bq-card-input>
      </bq-card>
      <div class="category">
        <cate ref="cateinfo" @cateUpdate="catsel" @cateTag="cateTag" @newParam="newParam" @cateTagUpdate="catselTag"></cate>
        <div class="goods-list-content" v-if="cateGoodsList.length >= 0 && iscateTag">
          <goods-list></goods-list>
        </div>
        <div class="searchnolist" v-if='cateGoodsList.length <= 0 && searchKey.replace(/(^\s*)|(\s*$)/g, "").length !== 0'>暂无商品</div>
      </div>
    </div>
  </bq-page>
</template>
<script>
import cate from '@/views/category/src/components/cate'
import GoodService from '@/services/goods.service'
import { mapGetters, mapActions } from 'vuex'
import goodsList from '../../goods/src/goods.list'

export default {
  data() {
    return {
      seller: {},
      showall: false,
      searchKey: '',
      iscateTag: false,
      tag: 0,
      newSellerCate: ''
    }
  },
  computed: {
    ...mapGetters({
      cateGoodsList: 'getGoodsList'
    })
  },
  async mounted() {
    this.GoodService = new GoodService()
    let id = this.$route.params.id
    let res = await this.GoodService.getSellerInfo({sellerId: id})
    this.seller = res
  },
  methods: {
    ...mapActions({
      getGoodsList: 'getGoodsList'
    }),
    onChangeSearch () {
      this.cateTag()
      let searchStr = this.searchKey
      if (searchStr) {
        if ($.trim(searchStr).length !== 0) {
          this.$refs.cateinfo.title = ''
          let parames = {}
          parames.page = 1
          parames.pageSize = 20
          parames.sellerId = this.$route.params.id
          parames.parameter = this.searchKey
          this.getGoodsList(parames)
        }
      } else {
        let selIndex = this.$refs.cateinfo.selected
        let selCatType = this.$refs.cateinfo.selCatType
        let selCatItem = this.$refs.cateinfo.cateList[selIndex]
        if (selCatType === 'pt') {
          this.$refs.cateinfo.getCateChild(selCatItem, selIndex)
        } else if (selCatType === 'npt') {
          this.$refs.cateinfo.getTagGoodsList(selCatItem, selIndex)
        }
      }
    },
    newParam (val) {
      this.newSellerCate = val
    },
    onSearch () {
      this.$router.push({name: 'SearchNew', query: {sellerId: this.$route.params.id, cateId: this.newSellerCate.cateId}})
    },
    onScan(val) {
      this.cateTag()
      this.$refs.cateinfo.title = ''
      let parames = {}
      parames.page = 1
      parames.pageSize = 20
      parames.parameter = val
      this.searchKey = val
      this.getGoodsList(parames)
    },
    catsel () {
      if (this.tag > 0) {
        this.iscateTag = false
      }
      this.tag = 1
      this.searchKey = ''
    },
    catselTag () {
      this.searchKey = ''
    },
    cateTag() {
      this.iscateTag = true
    },
    showInfo () {
      this.showall = !this.showall
    },
    goCart () {
      this.$router.push('/cart')
    }
  },
  watch: {
  },
  components: {
    'cate': cate,
    goodsList
  },
  destroyed () {
    this.$store.commit('GET_GOODS_LIST', [])
  }
}
</script>
<style lang="scss" scoped>
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  $iconImgUrl:'../../../assets/img';
  *{
    box-sizing: border-box;
  }
  .header {
    width: 100%;
    position: absolute;
    top: 0;
    background: $primary;
    height: 114px;
    .top{
      height: 44px;
      overflow: hidden;
      padding: 12px 0;
      a, p{
        float: left;
        height: 20px;
        line-height: 20px;
      }
      a{
        display: inline-block;
        width: 20%;
        padding: 0 20px;
        position: relative;
        .badge{
          position: absolute;
          top: -5px;
          left: 50%;
        }
      }
      p{
        width: 59%;
        text-align: center;
        @include font-dpr(17px);
        color: $font-color;
        @include text-overflow-1;
      }
    }
  }
  .header-content {
    width: 100%;
    min-height: 70px;
    line-height: 20px;
    @include font-dpr(12px);
    color: $font-color;
    position: absolute;
    top: 44px;
    background: $primary;
    padding: 7px 20px 20px;
    z-index: 4;
    &.hide-style{
      max-height: 70px;
      overflow: hidden;
    }
    i.icon-up{
      position: absolute;
      display: block;
      width: 16px;
      height: 8px;
      background: url(#{$iconImgUrl}/icon/icon-down.png) center no-repeat;
      background-size: 16px;
      right: 50px;
      top: 30px;
      transition: transform 0.3s;
      transform: rotate(0deg);
    }
    i.icon-down{
      transform: rotate(180deg);
    }
    p{
      padding-right: 60px;
      line-height: 21px;
      // position: relative;
      &.desc {
        @include text-overflow-1;
      }
      &.hide-desc {
        overflow: visible;
        width: 100%;
        word-wrap: break-word;
        white-space: normal;
      }
    }
    .moreinfo{
      background: $primary;
      position: relative;
      padding-top: 28px;
      padding-bottom: 15px;
      top: 10px;
      .title{
        height: 28px;
        line-height: 28px;
        @include font-dpr(14px);
        width: 100px;
        text-align: center;
        z-index: 1;
        margin: 0 auto;
        background: $primary;
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -50px;
      }
      .line{
        position: absolute;
        top: 14px;
        display: block;
        width: 100%;
        height: 1px;
        background: #505050;
        // transform: scaleY(.5);
      }
    }
    .label{
      display: inline-block;
      border-radius: 1px;
      text-align: center;
      // background: #FF571E;
      color: #fff;
      @include font-dpr(10px);
      width: 32px;
      height: 14px;/*no*/
      line-height: 15px;/*no*/
      background-clip: padding-box;
      margin-right: 5px;
      background: #87CEFF;
      font-size: 10px;
      -webkit-text-size-adjust:none;
      -webkit-transform:scale(0.8);
      -webkit-transform-origin:0 0;
      -o-transform:scale(1);
      display: inline-block;
    }
  }
  .mkt-right {
    position: absolute;
    right: 20px;
    // top: 0;
    bottom: 0px;
  }
  .content{
    width: 100%;
    position: absolute;
    top: 114px;
    padding-top: 45px;
    right: 0;
    left: 0;
    bottom: 0;
    .search-bar{
      position: absolute;
      top: 0;
    }
  }
  .category{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .goods-list-content{
    position: absolute;
    // width: 290px;
    top: 20px;
    left: 85px;
    right: 0;
    bottom: 0;
    z-index: 2;
    background: #fff;
  }
  .searchnolist {
    position: absolute;
    // width: 290px;
    top: 20px;
    left: 85px;
    right: 0;
    bottom: 0;
    z-index: 2;
    background: #fff;
    padding-top: 100px;
    font-size: 16px;
    text-align: center;
  }
</style>
