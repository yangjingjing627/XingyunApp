<template>
  <div class="yc-template-t" v-if="tabs.length !== 0">
    <nav :style="navStyle" v-if="nav.navbarStatus === 0" class="bq-template-tabs" id="ycTemplateNavbar">
      <!-- :href="'#ycTab'+ item.moduleDetailId" -->
      <a v-for="(item, index) in tabs"
       :key="'topNavBar' + item.moduleDetailId"
       class="bq-template-tabs__item"
       @click="onSelect(index, item.moduleDetailId)"
       :style="selected === index ? navSelectedStyle : {}">
        {{ item.title}}
      </a>
    </nav>
    <!-- 单个区块  -->
    <section :id="'ycTab' + tab.moduleDetailId"
      v-for="(tab, tabIndex) in tabs"
      :key="'ycTab' + tab.moduleDetailId"
      class="bq-template-tab" >
        <nav  class="bq-template-tab__nav" :style="tabStyle">
          {{ tab.title }}
        </nav>
        <!-- lazy-component -->
        <lazy-component :style="getTabHeight(tab.extendList)" class="bq-template-tab__goods" @visible="visible(tabIndex)">
          <bq-good-content v-if="tab.extendList.length">
            <bq-good-item
              class="home-goods-item"
              v-for="good in tab.extendList"
              :key="good.sku"
              :good="good">
            </bq-good-item>
          </bq-good-content>
          <div v-if="!tab.extendList.length" class="bq-template-tab__tip">还没有商品数据哦</div>
        </lazy-component>
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selected: 0
    }
  },
  mounted() {
    // 126
    this.$body = $('body')
  },
  props: {
    module: {
      type: Object,
      default: () => {}
    },
    nav: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    tabs() {
      let modules = this.module.modulesDetailList || []
      let tabs = modules.map(item => {
        item.extendList.map(good => {
          if (good.storeList && good.storeList.length > 0) {
            // 商品库存是否全为0
            good.good_empty = true
            // 商品为补货中状态，如果库存减去购物车数量大于等于 订货单位，是非补货状态
            good.storeList.map(sitem => {
              sitem.book = sitem.cartCount
              if (sitem.stock - sitem.cartCount * 1 >= sitem.orderUnit) {
                good.good_empty = false
              }
              return sitem
            })
          }
          return good
        })
        return item
      })
      return tabs
    },
    navStyle() {
      let {navbarType, navbarDefaultBackground: val, navbarDefaultFontColor} = this.nav
      let style = {
        background: navbarType === 1 ? `url(${val}) repeat` : val,
        color: navbarDefaultFontColor
      }
      return style
    },
    navSelectedStyle() {
      let {navbarType, navbarFocusBackground: val, navbarFocusFontColor} = this.nav
      let style = {
        background: navbarType === 1 ? `url(${val}) repeat` : val,
        color: navbarFocusFontColor
      }
      return style
    },
    tabStyle() {
      let {moduleBackgroundType, moduleBackgroundValue: val, moduleTitleFontColor} = this.module
      let style = {
        background: moduleBackgroundType === 1 ? `url(${val}) repeat` : val,
        color: moduleTitleFontColor
      }
      return style
    }
  },
  methods: {
    onSelect(index, moduleId) {
      let $tab = $('#ycTab' + moduleId)
      let offsetTop = $tab.offset().top
      let height = 44 / 37.5
      this.$body.scrollTop(offsetTop - height)
      this.selected = index
    },
    visible(index) {
      this.selected = index
    },
    getTabHeight(list) {
      let len = list.length
      let height = 44 / 37.5
      if (len > 0) {
        // 1个130 大于一个 161
        height = list.reduce((pre, cur) => {
          let storeLen = cur.storeList.length
          let width = 130
          if (storeLen > 1) {
            width = 160
          }
          return pre + width
        }, 0)
      }
      return {
        minHeight: `${height / 37.5}rem`
      }
    }
  }
}
</script>
<style lang="scss">
  .yc-template-t {
    overflow: hidden;
  }
  .bq-template-tabs {
    overflow: hidden;
    &__item {
      color: inherit;
      text-align: center;
      width: 20%;
      height: 44px;
      line-height: 44px;
    }
  }

  // 单个区块
  .bq-template-tab {
    &__hash {
      height: 1px;
      width: 100%;
    }

    &__nav {
      margin-top: 8px;
      text-align: center;
      width: 100%;
      height: 44px;
      line-height: 44px;
      background-color: #CCCCCC;
      font-size: 16px;
      color: #333333;
    }
    &__goods {
      .bq-list-content {
        background: inherit;
      }
    }

    &__tip {
      margin-bottom: 10px;
      height: 44px;
      line-height: 44px;
      width: 100%;
      text-align: center;
      color: #666;
    }
  }
</style>
