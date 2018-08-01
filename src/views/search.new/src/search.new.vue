<template>
  <bq-page>
  <div class="bq-goods-search">
    <div class="ui-searchbar-wrap focus">
      <i class="bq-icon-back" slot="icon" @click="back()"></i>
      <div class="ui-searchbar">
        <div class="search ui-searchbar-input">
          <i class="bq-icon-home-search" slot="icon"></i>
          <form action="">
            <input type="search" placeholder="请输入商品名称/条码"
            v-model="keyword"
            id="goodName"
            value='搜索'
            maxlength= "60"
            autocapitalize="off"
            autofocus="true">
          </form>
          <i v-if="keyword" class="bq-icon-home-clear" @click="clear()"></i>
        </div>
        <i class="ui-icon-gray" v-if="!keyword">搜索</i>
        <i class="ui-icon-close" @click="searchGood(keyword, 1)" v-if="keyword">搜索</i>
      </div>
    </div>
    <div class="bq-goods-fixed">
       <div class="bq-contents">
        <div class="bq-g-s-tip" v-if="keyShow">
          <ul class="ui-list ui-list-text ui-border-b">
            <li class="ui-border-t" v-for="item in suggest_list">
              <a class="ui-list-info" @click="autoGood(item.goodsName)">
                 {{ item.goodsName }}
              </a>
            </li>
          </ul>
        </div>
        <tag v-if="(history_show && suggest_list.length === 0)" title="搜索历史" :del="true"  :list="search_history" v-on:searchGoods="searchGood" @del="clearHistory"></tag>
      </div>
    </div>
    <div class="goods-list" :class="{'hidden': !keyword}" v-if="!keyShow && !(history_show && suggest_list.length === 0)">
      <yc-card-icon></yc-card-icon>
      <bq-good-content
      class="bq-list-search"
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
  <p class="no-goods goods-over" v-show="status.noMoreGoods && !this.status.noGoods">已加载完所有商品</p>
  <p class="no-goods" v-if="!noGood && status.noGoods && goodsList.length <= 0">暂未找到您要搜索的商品</p>
  </div>
  </div>
  </bq-page>
</template>
 <script>
import tag from './tag.vue'
import GoodService from '@/services/goods.service'
export default {
  name: 'SearchNew',
  data() {
    return {
      keyword: '',
      suggest_list: [],
      history_show: false,
      keyShow: false,
      noGood: false,
      search_history: [],
      seller: this.$route.query,
      status: {
        loading: false,
        noMoreGoods: false,
        noGoods: false
      },
      goodsList: [],
      params: {
        page: 1,
        pageSize: 20
      },
      autoFlag: false
    }
  },
  watch: {
    'keyword'(nVal) {
      this.autosuggest(nVal)
      if (!nVal) {
        this.history()
      }
    },
    'goodsList' (val) {
      if (val.length === 0) {
        this.status.noGoods = true
      } else {
        this.status.noGoods = false
      }
    }
  },
  computed: {
  },
  mounted() {
    this.GoodService = new GoodService()
    document.getElementById('goodName').focus()
    this.history()
    this.enterClick()
  },
  methods: {
    // 去前后空格
    allTrim (obj) {
      if (typeof (obj) === 'string') {
        return obj.replace(/(^\s*)|(\s*$)/g, '')
      }
    },
    clear () {
      this.keyword = ''
      this.goodsList = []
    },
    // 搜索历史
    async history () {
      await this.GoodService.historySuggest({}).then(res => {
        this.history_show = true
        this.search_history = res.keywords
      })
    },
    // 清除搜索历史
    async clearHistory () {
      await this.GoodService.delSearch({}).then(() => {
        this.search_history = []
        this.history_show = false
      })
    },
    // 获取联想搜索结果
    async autosuggest(key) {
      if (this.autoFlag) {
        return
      }
      let keyword = this.allTrim(key)
      this.params.page = 1
      this.goodsList = []
      if (keyword) {
        let param = {
          keyword: keyword
        }
        if (this.seller) {
          param.cateId = this.seller.cateId
          param.sellerId = this.seller.sellerId
        }
        if (this.seller.cate) {
          param.cateId = this.seller.cate.cateId
        }
        this.status.loading = true
        await this.GoodService.autoSuggest(param).then(res => {
          this.status.loading = false
          this.history_show = true
          this.suggest_list = res.goodsList
          if (this.suggest_list.length > 0) {
            this.keyShow = true
          }
        })
      } else {
        this.suggest_list = []
        this.goodsList = []
      }
    },
    enterClick () {
      let self = this
      window.document.onkeydown = function (event) {
        let et = event || window.event
        let keycode = et.charCode || et.keyCode
        if (keycode === 13) {
          if (window.event) {
            self.searchGood(self.keyword, 1)
            window.event.returnValue = false
          } else {
            self.searchGood(self.keyword, 1)
            event.preventDefault() // for firefox
          }
        }
      }
    },
    // 删除按钮
    cancel() {
      this.keyword = ''
    },
    back() {
      this.$router.go(-1)
    },
    autoGood (key) {
      this.params.page = 1
      this.searchGoods(key)
    },
    loadMore () {
      if (this.params.page > 1) {
        this.searchGoods(this.keyword)
      }
    },
    searchGood (key, flag) {
      if (!flag) {
        this.autoFlag = true
      }
      let input = document.getElementById('goodName')
      input.blur()
      this.params.page = 1
      this.goodsList = []
      let keyword = this.allTrim(key)
      // if (!keyword) {
      //   this.$messagebox.alert('请输入搜索商品名称或条码')
      //   return
      // }
      this.searchGoods(keyword)
    },
    // 获取搜索商品
    async searchGoods (key) {
      let keyword = this.allTrim(key)
      if (!keyword) {
        this.$messagebox.alert('请输入搜索商品名称或条码')
        return
      }
      this.keyword = keyword
      if (this.seller) {
        this.params.cateId = this.seller.cateId
        this.params.sellerId = this.seller.sellerId
      }
      if (this.seller.cate) {
        this.params.cateId = this.seller.cate.cateId
      }
      this.params.parameter = this.keyword
      let {list, next} = await this.GoodService.getGoodsSearch(this.params)
      this.keyShow = false
      this.history_show = false
      if (list.length > 0) {
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
        if (list.length > 0) {
          this.noGood = true
        }
      } else {
        this.noGood = false
        this.goodsList = []
        this.status.noGoods = true
      }
      if (next === 0) {
        this.status.loading = true
        this.status.noMoreGoods = true
      } else {
        this.status.loading = false
        this.status.noMoreGoods = false
        this.params.page = this.params.page + 1
      }
      this.autoFlag = false
    }
  },
  components: {
    tag
  }
}
 </script>


<style lang="scss" scoped>
@import 'scss/variables';
@import 'scss/mixin.scss';
html,body, #app{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.bq-content{
  top: 0;
}
.hidden{
  overflow: hidden;
}
.bq-goods-search {
  height: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top:0;
  background: #fff;
  .goods-list{
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    &.hidden{
      overflow: hidden;
    }
  }
  .bq-goods-fixed{
    position: fixed;
    top: 50px;
    z-index: 100;
    width: 100%;
    // bottom: 0;
  }
  .ui-searchbar-wrap{
    width: 100%;
    height: 45px;
    margin: 0px auto 5px auto;
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    @include text-overflow-1;
    position: absolute;
    top: 0;
    left: 0;
    .bq-icon-back{
      width: 20px;
      height: 20px;
      position: absolute;
      top: 15px;
      left: 13px;
    }
    .bq-icon-home-search {
      position: absolute;
      width: 15px;
      height: 15px;
      left: 45px;
      top: 14px;
      background: url('../../../assets/img/home/searchblack.png') no-repeat;
      background-size: 100%;
    }
    .bq-icon-home-search {
      position: absolute;
      width: 15px;
      height: 15px;
      left: 45px;
      top: 15px;
      background: url('../../../assets/img/home/searchblack.png') no-repeat;
      background-size: 100%;
    }
    .bq-icon-home-clear {
      position: absolute;
      width: 15px;
      height: 15px;
      right: 80px;
      top: 15px;
      background: url('../../../assets/img/components/upload/group.png') no-repeat;
      background-size: 100%;
    }
    .ui-searchbar{
      width: 320px;
      height: 28px;
      margin: 8px 0 8px 39px;
    }
    .ui-searchbar-input{
      width: 230px;
      height: 28px;
      background: #fff;
      line-height: 28px;
      float: left;
      border: 1px solid #D8D8D8;
      border-radius: 2px;
      padding-left: 34px;
    }
    .ui-icon-close{
      display: inline-block;
      width: 44px;
      float: left;
      margin-left: 5px;
      line-height: 28px;
      text-align: center;
      background: #fff;
      color: #505050;
      border: 1px solid #D8D8D8;
      border-radius: 2px;
      font-size: 12px;
    }
    .ui-icon-gray{
      display: inline-block;
      width: 44px;
      float: left;
      margin-left: 5px;
      line-height: 28px;
      text-align: center;
      background: #D8D8D8;
      color: #fff;
      border: 1px solid #D8D8D8;
      border-radius: 2px;
      font-size: 12px;
    }
  }

    .bq-contents {
        background-color: #fff;
        .bq-g-s-tip {
          background: #fff;
          // border-bottom: 1px solid #e5e5e5;
            .ui-list > li {
              border-bottom: 1px solid #D8D8D8;
                margin-left: 0;
                padding: 12px 12px;
                .ui-list-info {
                    @include font-dpr(14px);
                    @include text-overflow-1;
                    color: #333333;
                    letter-spacing: 0;
                }
            }
        }
        .b-clear-history {
            margin: 30px 62px;
            // @include border-zero-5(#ccc) {
            //     border-radius: 40px;
            // };
        }
    }

}
input[type="search"]{
  width: 100%;
}
.no-goods{
  margin-top: 50px;
  &.goods-over{
    margin-top: 20px;
  }
}
@mixin fc {
     @include font-dpr(13px);
    color: #999999;
    padding-left: 2px;
}
::-webkit-input-placeholder {
    @include fc;
}

::-moz-placeholder {
    @include fc;
}

:-ms-input-placeholder {
    @include fc;
}
input:-moz-placeholder {
    @include fc;
}
</style>
