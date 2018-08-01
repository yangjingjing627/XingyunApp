<template>
  <div class="modify">
    <div class="ding" v-if="(!count && type !== 'cart' && type !== 'ding') || propertyStocks===0" @click="addCart()" :class="{'no': isAdd}">订</div>
    <div class="ding-add-less" v-if="(count || type === 'cart' || type === 'ding') && propertyStocks===1">
      <span class="less" :class="{'no': isLess}" @click="lessCart()"></span>
      <span class="change" @click="changeCart()">{{ count }}</span>
      <span class="add" :class="{'no': isAdd}" @click="addCart()"></span>
    </div>
  </div>
</template>
<script>
import OrderCartService from '@/services/order.cart.service'
import CartCount from './cart.count.js'
export default {
  name: 'modify-cart',
  mixins: [ CartCount ],
  data() {
    return {
      currentVal: this.cartData || {}
    }
  },
  props: ['cartData', 'type'],
  watch: {
    cartData(val) {
      this.currentVal = val || {}
    }
  },
  mounted () {
    this.currentVal = this.cartData || {}
  },
  computed: {
    cartObject () {
      return window.store.state.cart.modifyCartCount
    },
    isLess () {
      return !this.count
    },
    isAdd () {
      return parseInt(this.currentVal.stock) - parseInt(this.count) - parseInt(this.currentVal.orderUnit) < 0
    },
    propertyStocks () {
      if (this.currentVal.propertyStocks === 0) {
        return 0
      } else if (this.currentVal.propertyStocks === 1) {
        return 1
      } else {
        return 1
      }
    }
  },
  created() {
    this.OrderCartService = new OrderCartService()
  },
  methods: {
    lessCart () {
      if (this.isLess) {
        return
      }
      let stock = parseInt(this.currentVal.stock)
      let orderUnit = parseInt(this.currentVal.orderUnit)
      if (stock < (this.count - orderUnit)) {
        // this.currentVal.count = this.currentVal.count - this.currentVal.orderUnit
        let count = parseInt(stock / orderUnit) * orderUnit
        let msg = '库存仅剩' + stock + '件，是否修改？'
        this.$messagebox.confirm(msg, '').then(() => {
          this.lessCartFun(count)
        }).catch(() => {
        })
      } else {
        let cartCount = this.count || 0
        let count = cartCount - parseInt(this.cartData.orderUnit)
        this.lessCartFun(count)
      }
    },
    lessCartFun (count) {
      let params = {
        count: count
      }
      params.count = params.count < 0 ? 0 : params.count
      if (params.count === 0 && this.type === 'cart') {
        this.deleteCart(params)
      } else {
        this.modifyCart(params)
      }
    },
    changeCart () {
      let cartCount = this.count || 0
      let params = {}
      let orUnit = this.cartData.orderUnit
      this.$messagebox.prompt('修改商品数量', '', {
        inputValue: cartCount,
        inputPlaceholder: '请输入需要修改的数量',
        inputValidator: function (v) {
          if ((v * 1) === 0 || (v * 1) > 99999) {
            return '请输入1-99999的整数'
          }
          if ((v * 1) % (orUnit) !== 0) {
            return '数量必须为订货倍数的整数倍'
          }
          return true
        }
      }).then(({ value }) => {
        params.count = parseInt(value)
        if (params.count === 0 && this.type === 'cart') {
          this.deleteCart(params)
        } else {
          this.modifyCart(params)
        }
      })
    },
    addCart () {
      if (this.isAdd) {
        return
      }
      let cartCount = parseInt(this.count) || 0
      let params = {
        count: cartCount + parseInt(this.currentVal.orderUnit)
      }
      this.modifyCart(params)
    },
    deleteCart (params) {
      this.$messagebox.confirm('确定删除此商品？').then(() => {
        this.modifyCart(params)
      })
    },
    modifyCart (params) {
      params.goodsId = this.currentVal.goodsId
      let addCount = params.count - this.count
      if (window.router.currentRoute && window.router.currentRoute.query) {
        params.programId = window.router.currentRoute.query.programId
        params.programType = window.router.currentRoute.query.programType
      }
      if (window.router.currentRoute && window.router.currentRoute.params) {
        if (params.programType && params.programId) {
          params.topicId = window.router.currentRoute.params.topicId
        }
      }
      this.OrderCartService.addCart(params).then(res => {
        window.store.commit('UPDATE_CART_COUNT', addCount)
        // 如果是商品详情页 需要把详情页数据同步到列表页
        this.synCount({goodsId: this.cartData.goodsId, count: params.count}, this.type)
        let {activityType, activityTips, activityRule, price} = res
        this.$emit('modifyCartEnd', {
          count: params.count,
          activityType: activityType,
          activityTips: activityTips,
          activityRule: activityRule,
          price: price
        })
        if (this.type === 'cart') {
          this.$set(this.currentVal, 'count', params.count)
        } else {
          this.$set(this.currentVal, 'cartCount', params.count)
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import './modify.scss';
@import 'scss/variables.scss';
.mint-msgbox {
  .mint-msgbox-errormsg {
    padding-top: 5px;
    text-align: center;
    color: $danger;
  }
}
</style>
