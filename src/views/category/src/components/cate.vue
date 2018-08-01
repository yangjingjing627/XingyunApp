<template>
  <div class="cate">
    <ul class="cate1">
      <li v-for="(item, index) in cateList"
        :class="{active: selected === index}"
        :key="'cate' + index">
        <a v-if="item.cateName" @click="getCateChild(item, index)">
          {{ item.cateName }}
        </a>
        <a v-if="item.cateTagName" @click="getTagGoodsList(item, index)" class="tag">
          <img v-if="item.iconUrl" :src="item.iconUrl" alt="">
          {{ item.cateTagName }}
        </a>
      </li>
    </ul>
    <div class="cate-list">
      <p class="title">{{ title }}</p>
      <ul class="cate2">
        <li v-for="(child, index) in childList"
          :key="'childCate' + index"
          @click="getList(child)">
          <div>
            <img v-lazy="child.cateImage" alt="">
          </div>
          <p>{{ child.cateName }}</p>
        </li>
        <span></span>
      </ul>
    </div>
  </div>
</template>
<script>
import GoodService from '@/services/goods.service'
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      cate: [],
      selected: 0,
      childList: [],
      tagList: [],
      title: '',
      params: {
        page: 1,
        pageSize: 20
      },
      isNotag: false,
      selCatType: 'pt'
    }
  },
  computed: {
    cateList () {
      return this.tagList.concat(this.cate)
    }
  },
  mounted() {
    this.GoodService = new GoodService()
    this.getCateList()
    if (this.$route.name === 'categorySeller' && this.$route.params.id) {
      this.getTagList(this.$route.params.id)
    }
  },
  methods: {
    ...mapActions({
      getGoodsList: 'getGoodsList'
    }),
    async getCateList () {
      try {
        let params = {}
        if (this.$route.params.id) {
          params.sellerId = this.$route.params.id
        }
        let res = await this.GoodService.getCateList(params)
        this.cate = res.list || []
        // this.title = this.cate[0].cateName
        if (this.cate.length > 0) {
          this.$emit('cateUpdate')
          this.childList = this.cate[0].cateList
          if (this.$route.name !== 'categorySeller' || this.isNotag) {
            this.title = this.cate[0].cateName
          }
        }
      } finally {
        this.$store.commit('UPDATE_LOADING', { isLoading: false })
      }
    },
    async getTagList (sellerId) {
      let res = await this.GoodService.getTagList({sellerId: sellerId})
      this.tagList = res || []
      if (this.tagList.length > 0) {
        this.getTagGoodsList(this.tagList[0])
      } else {
        this.isNotag = true
      }
    },
    getCateChild (item, index) {
      this.selCatType = 'pt'
      this.selected = index
      this.childList = item.cateList
      this.title = item.cateName
      this.$store.commit('GET_GOODS_LIST', [])
      this.$emit('cateUpdate')
    },
    getTagGoodsList (item, index = 0) {
      this.selCatType = 'npt'
      this.selected = index
      this.params.cateTagId = item.cateTagId
      this.title = item.cateTagName + '-' + item.cateTagSubTitle
      this.getGoodsList(this.params)
      this.$emit('cateTagUpdate')
      this.$emit('cateTag')
    },
    async getList (child) {
      this.params.cateId = child.cateId
      this.params.cateTagId = ''
      if (this.$route.params.id) {
        this.params.sellerId = this.$route.params.id
      }
      this.title = this.title + '-' + child.cateName
      // this.$store.commit('GET_GOODS_STATUS', {params: this.params})
      this.getGoodsList(this.params)
      // console.log(this.params)
      this.$emit('newParam', this.params)
      this.$emit('cateTag')
    }
  },
  watch: {
    isNotag () {
      if (this.isNotag && this.childList > 0) {
        this.title = this.cate[0].cateName
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  *{
    box-sizing: border-box;
  }
  .cate{
    height: 100%;
    overflow: hidden;
    color: $font-color;
    position: relative;
    ul.cate1{
      width: 100%;
      background: #F8F5E7;
      display: block;
      height: 100%;
      width: 85px;
      overflow: auto;
      li{
        display: block;
        width: 100%;
        height: 45px;
        line-height: 45px;
        text-align: center;
        position: relative;
        @include font-dpr(13px);
        a{
          color: $font-color;
          display: block;
          width: 100%;
          height: 100%;
          &.tag{
            padding-left: 13px;
          }
          img{
            width: 13px;
            height: 13px;
            position: absolute;
            top: 16px;
            left: 6px;
          }
        }
        &.active{
          background: #fff;
          a{
            color: $cate-font-color;
          }
          &:after{
            content: "";
            position: absolute;
            width: 3px;
            height: 100%;
            background: $primary;
            left: 0;
            top: 0;
          }
        }
      }
    }
    .cate-list{
      // width: 290px;
      height: 100%;
      overflow: hidden;
      padding-top: 20px;
      position: absolute;
      right: 0;
      top:0;
      left: 85px;
      background: #fff;
      p.title{
        height: 20px;
        line-height: 20px;
        text-align: center;
        @include font-dpr(12px);
        color: #505050;
        position: absolute;
        width: 100%;
        top:0;
        right: 0;
        border-bottom: 1px solid $light-border-color;
        background: #FBF9F1;
      }
    }
    ul.cate2{
      display: block;
      width: 100%;
      height: 100%;
      overflow: auto;
      li{
        display: block;
        float: left;
        width: 33%;
        padding: 10px 0;
        div{
          width: 70px;
          height: 60px;
          margin: 0 auto;
          img{
            width: 100%;
            height: 100%;
          }
        }
        p{
          // height: 14px; /*no*/
          line-height: 14px; /*no*/
          padding-top: 12px;
          @include font-dpr(13px);
          text-align: center;
        }
      }
      span{
        clear: both;
      }
    }
  }
</style>
