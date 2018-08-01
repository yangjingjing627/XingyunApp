<template>
  <section class="yc-cart">
    <bq-header title="订货车" :isLeftIcon="true">
      <bq-button class="bq-cart-headright" slot="right" @click="tiggerDel" >
         {{isDel ? '完成' : '删除商品'}}
      </bq-button>
    </bq-header>
    <div class="stay-top" v-if="list.length > 0 && listStop.sellerId">
      <store :item="listStop" :isDel="isDel" @storeCheckedChange="storeCheckedChange"></store>
    </div>
    <bq-content class="yc-cart-content" :padding-bottom="isDel" @scroll="scroll">
      <cart-list>
        <cart-item v-for="(item, index) in list"
        :key="item.sellerId"
        :item="item"
        :isDel="isDel"
        :nowIndex = 'nowIndex'
        :index="index"
        @deleteStore="onDeleteStore(index)"
        @goodCheckedChange="onCheckedChange"
        @storeCheckedChange="storeCheckedChange">
      </cart-item>
     </cart-list>
    </bq-content>
    <bq-footer class="yc-cart__footer" v-show="isDel">
      <bq-checkbox type="radio" label="全选" v-model="isAllSel" @change.native="onAllChange()"></bq-checkbox>
      <bq-button type="primary" class="btn-del" :disabled="selectedGoods.length == 0" @click="onDeleteGoods"  >删除</bq-button>
    </bq-footer>
    <bq-prompt v-if="list.length==0" title="您的订货车是空的，快去添加商品吧!!!" go-url="/home"></bq-prompt>
  </section>
</template>
<script>
import CartList from './common/cart.list.vue'
import CartItem from './common/cart.item.vue'
import CartMixin from './cart.mixin'
import CartService from '@/services/cart.service'
import Store from './common/cart.item.srore.vue'
// import {addClass, removeClass} from '@/utils/utils'
export default {
  mixins: [ CartMixin ],

  data () {
    return {
      list: [],
      isAllSel: true,
      isDel: false,
      isoneDel: false,
      listStop: {},
      nowIndex: 0,
      combinGoodsLength: 0
    }
  },

  created() {
    this.CartService = new CartService()
    this.init()
  },

  computed: {
    // 选中的商品
    selectedGoods() {
      let goods = []
      this.list.forEach(item => {
        item.activityList.forEach(activity => {
          activity.goodsList.forEach(good => {
            if (good.isChecked) {
              goods.push(good.goodsId)
            }
          })
        })
      })
      return goods
    },
    combinPageStatus () {
      return window.store.state.combin.pageStatus
    }
  },
  watch: {
    combinPageStatus (val) {
      if (!val) {
        this.init()
      }
    }
  },
  methods: {
    async init() {
      try {
        this.list = []
        let {list} = await this.CartService.getCartByMkt()
        this.list = list.map(item => {
          return this.reset(item)
        })
        this.listStop = this.list[0]
      } finally {
        this.$store.commit('UPDATE_LOADING', { isLoading: false })
      }
    },

    reset(item) {
      let noCheckedStore = true
      // 处理单个商户是否可以 选中
      item.noChecked = item.storeStatus !== 0
      item.isChecked = this.isDel ? item.isChecked : false

      // 商品总数
      let total = 0

      // 活动部分
      item.activityList = item.activityList.map(activity => {
        // 商品部分
        // 组合时添加字段 一个组合需要的商品数量
        if (activity.activityType === 50) {
          activity.combinLength = activity.goodsIds.length
          activity.isCombin = false
          activity.isCombinLength = false
        }
        activity.goodsList = activity.goodsList.map(good => {
          good.selId = item.sellerId
           // 原价商品数量 给个默认值
          good.originalCount = 0
          if (good.count === 0 || good.status === 0 || good.stock - good.orderUnit < 0 || good.stock - good.count < 0 || item.noChecked) {
            good.noChecked = true
            good.isChecked = this.isDel ? good.isChecked : false
          } else {
            good.noChecked = false
            good.isChecked = this.isDel ? good.isChecked : true
            noCheckedStore = false
          }
          // 计算商品总数
          if (good.isChecked && !good.noChecked) {
            total += good.count
          }
          return good
        })
        return activity
      })

      // 根据商品信息判断商店是否可购买
      if (noCheckedStore) {
        item.noChecked = true
        item.isChecked = this.isDel ? item.isChecked : false
      } else {
        item.noChecked = false
        item.isChecked = this.isDel ? item.isChecked : true
      }

      // total 获取商店商品总数
      item.total = total

      return item
    },

    // 顶部删除触发
    tiggerDel() {
      this.isDel = !this.isDel
      this.list = this.list.map(item => {
        if (item.noChecked) {
          item.isChecked = this.isDel
        }
        item.activityList = item.activityList.map(activity => {
          activity.goodsList = activity.goodsList.map(good => {
            if (good.noChecked) {
              good.isChecked = this.isDel
            }
            return good
          })
          return activity
        })
        return item
      })

    },

    // 底部删除按钮 批量删除商品
    async onDeleteGoods() {
      await this.$messagebox.confirm(`你确认要删除这<span class='prompttitle'>${this.selectedGoods.length}件</span>商品吗?`, '')
      let res = await this.CartService.removeGoods(this.selectedGoods.join(','))
      if (res === true) {
        this.$router.go(0)
      }
    }

  },

  beforeDestroy() {
    this.$messagebox.close()
  },

  components: {
    CartList,
    CartItem,
    Store
  }

}
</script>

<style lang="scss">
  @import './cart.scss';
  .stay-top{
    position: absolute;
    left: 0;
    right: 0;
    top: 48px;
    background: #fff;
  }
</style>
