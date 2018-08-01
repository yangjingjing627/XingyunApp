<template>
  <div>
    <bq-header title="我要订货" :isLeftIcon="true">
    </bq-header>
    <div class="content">
      <!-- <div class="btns">
        <scan @scan="onScan">
          <bq-button>
            <i slot="icon" class="bq-icon-home-scan"></i>
          </bq-button>
        </scan>
      </div>
      <div class="search" @click="onSearch()">
        <i class="bq-icon-home-search"></i>
        <input placeholder="请输入商品名称/条码" v-model="searchKey" readonly="readonly" >
      </div> -->
      <bq-card class="search-bar">
        <scan @scan="onScan">
          <i class="scan"></i>
        </scan>
        <bq-card-input v-model="searchKey" padding fixed placeholder="输入商品名称／条码" @click.native="onSearch()">
          <i class="search"></i>
        </bq-card-input>
      </bq-card>
      <div class="category">
        <cate ref="cateinfo" @cateUpdate="catsel" @cateTag="cateTag"></cate>
        <div class="goods-list-content" v-if="cateGoodsList.length >= 0 && isCateTag">
          <goods-list></goods-list>
        </div>
         <div class="searchnolist" v-if='cateGoodsList.length <= 0 && !isHasCate'>暂无商品</div>
        <div class="searchnolist" v-if='cateGoodsList.length <= 0 && searchKey.replace(/(^\s*)|(\s*$)/g, "").length !== 0'>暂无商品</div>
      </div>
    </div>
  </div>
</template>
<script>
import cate from './components/cate'
import goodsList from '../../goods/src/goods.list'
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      searchKey: '',
      isHasCate: false,
      isCateTag: false
    }
  },
  methods: {
    ...mapActions({
      getGoodsList: 'getGoodsList'
    }),
    onChangeSearch () { // 先前搜索方法
      this.cateTag()
      let searchStr = this.searchKey
      if (searchStr) {
        if ($.trim(searchStr).length !== 0) {
          this.$refs.cateinfo.title = ''
          let parames = {}
          parames.page = 1
          parames.pageSize = 20
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
    onSearch () { // 修改后跳转到搜索页
      let selIndex = this.$refs.cateinfo.selected
      // let selCatType = this.$refs.cateinfo.selCatType
      let selCatItem = this.$refs.cateinfo.cateList[selIndex]
      // console.log(selIndex)
      // console.log(selCatType)
      console.log(selCatItem)
      this.$router.push({name: 'SearchNew', query: {cate: selCatItem}})
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
      this.isCateTag = false
      this.isHasCate = true
      this.searchKey = ''
    },
    cateTag () {
      this.isCateTag = true
    }
  },
  computed: {
    ...mapGetters({
      cateGoodsList: 'getGoodsList'
    })
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
  .cart{
    width: 20%;
    height: 20px;
    position: relative;
    .badge{
      color: #fff;
      font-size: 11px;
      position: absolute;
      top: -5px;
      left: 50%;
    }
  }
  .content{
    width: 100%;
    position: absolute;
    top: 43px;
    padding-top: 45px;
    right: 0;
    left: 0;
    bottom: 44px;
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
