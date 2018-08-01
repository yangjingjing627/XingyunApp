<!-- 2.1版本废弃 -->
<template>
  <div class="bq-cart">
    <bq-header title="订货车" :isLeftIcon="true">
      <bq-button class="bq-cart-headright" slot="right" v-if="list.length!=0" @click="delBtnEvent">
         {{isDel ? '完成' : '删除商品'}}
      </bq-button>
    </bq-header>
    <bq-content class="bq-cart-content" :padding-bottom="isDel">
      <div class="shop-item" v-for="item in list" :key="item.sellerId">
        <div class="name" :isnoborder="item.totalPrice < item.minDeliverAmount">
          <bq-checkbox type="radio" v-model="item.ischecked" :disabled="item.noChecked && !isDel"  @change.native="sellAllSelEvent(item)"></bq-checkbox>
          {{item.storeName}}<span>（起送价{{$bqUtils.moneyFixed(item.minDeliverAmount)}}元）</span>
          <span class="rightdelt" v-if="item.storeStatus === 1" @click="removeSeller(item)">删除</span>
        </div>
        <p class="cou" :isclosesell="item.storeStatus === 1"
          @click.stop="goJoinSingle(item)"
          v-show="item.totalPrice < item.minDeliverAmount">还差{{$bqUtils.moneyFixed((item.minDeliverAmount-item.totalPrice))}}元  <span arrow>去凑单</span></p>
        <goods-item v-for="goodsItem in item.goodsList"
                    :key="goodsItem.goodsId"
                    :goodsitem="goodsItem"
                    :isDel="isDel"
                    @goodsItemCountChanage="goodsItemCountChanage"
                    @goodsItemSelChanage="goodsItemSelChanage">
          <bq-button type="primary"  class="operatebtn itemdel" slot="delbtn" @click="delGoodsInfoOne(goodsItem)">
            删除
          </bq-button>
        </goods-item>
        <div class="shop-item-foot">
          <p>
            <span>合计：<span class="count-price">¥{{$bqUtils.moneyFixed(item.totalPrice)}}</span></span>
            <span class="count">共{{item.total}}件</span>
          </p>
          <p class="youhui">
            <span>总额：¥1350.00</span>
            <span>优惠：¥50.00</span>
          </p>
          <bq-button type="primary" class="operatebtn" :disabled="item.totalPrice < item.minDeliverAmount || item.total<=0" @click="balanceEvent(item)">
            结算
          </bq-button>
        </div>
      </div>
    </bq-content>
    <bq-footer class="bq-cart-foot" v-show="isDel">
      <bq-checkbox type="radio" label="全选" v-model="isAllSel" @change.native="delAllSelEvent"></bq-checkbox>
      <bq-button type="primary" class="operatebtn alldel" :disabled="selGoodsArray.length==0" @click="delGoodsInfo">删除</bq-button>
    </bq-footer>
    <bq-prompt v-if="list.length==0" title="您的订货车是空的，快去添加商品吧!!!" go-url="/home"></bq-prompt>
  </div>
</template>
<script>
import goodsItem from './goods.item.vue'
import CartService from '@/services/cart.service.js'
import CartMixin from './cart.mixin'
export default {
  mixins: [ CartMixin ],

  data () {
    return {
      list: [],
      isAllSel: true,
      isDel: false,
      isoneDel: false
    }
  },
  computed: {
    selGoodsArray () {
      let selgoodsIdArray = []
      this.list.forEach(item => {
        item.goodsList.forEach(goodsItem => {
          if (goodsItem.ischecked) {
            selgoodsIdArray.push(goodsItem.goodsId)
          }
        })
      })
      return selgoodsIdArray
    }
  },
  async mounted () {
    this.CartService = new CartService()
    let n = await this.CartService.getCartByMkt()
    console.log(n)
    let res = await this.CartService.getCartList()
    this.list = res.list.map(sellitem => {
      return this.sellItemInit(sellitem)
    })
    this.$store.commit('UPDATE_LOADING', { isLoading: false })
  },
  methods: {
    // 单个可购买信息初始化处理
    sellItemInit (sellItem) {
      // 判断当前商店是否可以选择操作
      let sellnoChecked = true
      // 商店是否可购买
      if (sellItem.storeStatus === 0) {
        sellItem.noChecked = false
      } else {
        sellItem.noChecked = true
      }
      sellItem.goodsList = sellItem.goodsList.map(item => {
        item.selId = sellItem.sellerId
        if (item.count === 0 || item.status === 0 || item.stock - item.orderUnit < 0 || item.stock - item.count < 0 || sellItem.noChecked) {
          item.noChecked = true
          item.ischecked = this.isDel ? item.ischecked : false
        } else {
          item.noChecked = false
          item.ischecked = this.isDel ? item.ischecked : true
          sellnoChecked = false
        }
        return item
      })
      // 根据商品信息判断商店是否可购买
      if (sellnoChecked) {
        sellItem.noChecked = true
        sellItem.ischecked = this.isDel ? sellItem.ischecked : false
      } else {
        sellItem.noChecked = false
        sellItem.ischecked = this.isDel ? sellItem.ischecked : true
      }
      sellItem.total = this.getSellerTotal(sellItem.goodsList)

      // 调用计算 满减优惠金额
      this.getDiscountPrice(sellItem.goodsList)

      this.priceNumberReckon(sellItem)
      return sellItem
    },
    // 获取商店商品总数
    getSellerTotal (goodsList) {
      let total = 0
      goodsList.forEach((item) => {
        if (item.ischecked && !item.noChecked) {
          total += item.count
        }
      })
      return total
    },
    // 某个商品数量变化处理
    async goodsItemCountChanage (upInfo) {
      // 获取修改的商店信息
      let sell = null
      let sellIndex = -1
      this.list.every((item, i) => {
        if (item.sellerId === upInfo.goodsItem.selId) {
          sell = item
          sellIndex = i
          return false
        }
        return true
      })
      // 获取修改的商品店信息
      let upGoods = null
      let upGoodsIndex = -1
      sell.goodsList.every((item, i) => {
        if (item.goodsId === upInfo.goodsItem.goodsId) {
          upGoods = item
          upGoodsIndex = i
          return false
        }
        return true
      })
      if (!upGoods) {
        return
      }
      if (this.isoneDel) {
        let res = await this.CartService.addCartGoods(upGoods.goodsId, upGoods.count)
        this.isoneDel = false
        if (res !== true) {
          upGoods.count = upInfo.oldval
          return
        }
      }
      window.store.dispatch('getCartCount')
      // 重新计算总价信息
      this.priceNumberReckon(sell)
      // 如果改商品数量为0在列表中移除该条信息
      if (upGoods.count === 0) {
        sell.goodsList.splice(upGoodsIndex, 1)
      }
      // 删除已没商品的商店
      if (sell.goodsList.length === 0) {
        this.list.splice(sellIndex, 1)
      }
      // 重新计算当前商品的可购买状态
      if (upGoods.count === 0 || upGoods.status === 0 || upGoods.stock - upGoods.orderUnit < 0 || upGoods.stock - upGoods.count < 0 || sell.noChecked) {
        upGoods.noChecked = true
      } else {
        upGoods.noChecked = false
      }
      this.setSelect(sell)
    },
    // 某个商品选中状态改变变化处理
    goodsItemSelChanage (upInfo) {
      // 获取修改的商店信息
      let sell = null
      this.list.every(item => {
        if (item.sellerId === upInfo.selId) {
          sell = item
          return false
        }
        return true
      })
      this.setSelect(sell) // 重置当前商店选中状态
      this.setAllSelect()  // 重置全局的选中状态
      this.priceNumberReckon(sell) // 重新计算价格
    },
    // 重新计算商店的结算商品总数和价格
    priceNumberReckon (sellItem) {
      sellItem.total = this.getSellerTotal(sellItem.goodsList)
      if (sellItem.noChecked) {
        sellItem.totalPrice = 0
        return
      }
      let totalPrice = 0
      sellItem.goodsList = sellItem.goodsList.map(item => {
        item.totalPrice = (item.count * 1) * (item.price * 1)
        if (item.ischecked && !item.noChecked) {
          totalPrice += item.totalPrice
        }
        return item
      })
      sellItem.totalPrice = totalPrice
    },
    // 批量删除商品信息
    async delGoodsInfo () {
      await this.$messagebox.confirm(`你确认要删除这<span class='prompttitle'>${this.selGoodsArray.length}件</span>商品吗?`, ``)
      let res = await this.CartService.removeGoods(this.selGoodsArray.join(','))
      if (res === true) {
        this.$router.go(0)
      }
    },
    // 删除单个商品信息
    async delGoodsInfoOne (goodsItem) {
      await this.$messagebox.confirm(`是否删除商品`, ``)
      this.isoneDel = true
      goodsItem.count = 0
    },
    // 设置当前商店选中状态信息
    setSelect (sellItem) {
      let hasNoSelect = true
      if (this.isDel) {
        sellItem.goodsList.forEach(item => {
          if (!item.ischecked) {
            hasNoSelect = false
            return false
          }
          return true
        })
        sellItem.ischecked = hasNoSelect
      } else {
        sellItem.goodsList.forEach(item => {
          if (!item.ischecked && !item.noChecked) {
            hasNoSelect = false
            return false
          }
          return true
        })
        if (sellItem.noChecked) {
          sellItem.ischecked = false
        } else {
          sellItem.ischecked = hasNoSelect
        }
      }
    },
    // 设置全选信息状态
    setAllSelect () {
      let hasNoSelect = true
      this.list.forEach(item => {
        if (!item.ischecked) {
          hasNoSelect = false
          return false
        }
        return true
      })
      this.isAllSel = hasNoSelect
    },
    // 商店全选改变事件
    sellAllSelEvent (sellItem, isdelAllSel) {
      if (this.isDel) {
        sellItem.goodsList = sellItem.goodsList.map(item => {
          item.ischecked = sellItem.ischecked
          return item
        })
      } else {
        sellItem.goodsList = sellItem.goodsList.map(item => {
          if (!item.noChecked) {
            item.ischecked = sellItem.ischecked
          }
          return item
        })
      }
      this.priceNumberReckon(sellItem)
      if (!isdelAllSel) {
        this.setAllSelect()
      }
    },
    // 删除全选按钮操作
    delAllSelEvent () {
      this.list = this.list.map(item => {
        item.ischecked = this.isAllSel
        this.sellAllSelEvent(item, true)
        return item
      })
    },
    // 头部删除按钮完成事件
    delBtnEvent () {
      this.isDel = !this.isDel
      this.list = this.list.map(selitem => {
        if (selitem.noChecked) {
          selitem.ischecked = this.isDel
        }
        selitem.goodsList = selitem.goodsList.map(goodsitem => {
          if (goodsitem.noChecked) {
            goodsitem.ischecked = this.isDel
          }
          return goodsitem
        })
        return selitem
      })
    },
    // 订购车结算
    async balanceEvent (sellItem) {
      let goodsIdArray = []
      sellItem.goodsList.forEach(item => {
        if (!item.noChecked && item.ischecked) {
          goodsIdArray.push(item.goodsId)
        }
      })
      let sellId = sellItem.sellerId
      try {
        await this.CartService.sellerIdBefore({goodsIds: goodsIdArray.join(','), sellerId: sellId})
        this.$router.push({name: 'orderConfirm', query: {goodId: goodsIdArray.join(','), sellerId: sellId}})
      } catch (e) {
        if (e.data) {
          if (e.data.diffStatus === 1 || e.data.diffStatus === 3) {
            this.$messagebox.confirm(e.message, '温馨提示', {
              confirmButtonClass: 'bq-msg-confirm-ok',
              confirmButtonText: '继续结算',
              cancelButtonClass: 'bq-msg-confirm-cancel',
              cancelButtonText: '取消'
            }).then(() => {
              let validGoods = e.data.validGoods
              this.CartService.sellerIdBefore({goodsIds: validGoods, sellerId: sellId})
              this.$router.push({name: 'orderConfirm', query: {goodId: validGoods, sellerId: sellId}})
            })
          } else if (e.data.diffStatus === 4) {
            await this.$messagebox.alert(e.message, '', {confirmButtonText: '重新选购'})
            this.$router.push('/home')
          }
        } else {
          await this.$messagebox.alert(e.message)
        }
      }
    },
    // 去凑单
    goJoinSingle (sellItem) {
      if (sellItem.storeStatus !== 1) {
        this.$router.push(`/category/seller/${sellItem.sellerId}`)
      }
    },
    // 删除商店下所有商品
    async removeSeller(sellItem) {
      await this.$messagebox.confirm(`是否删除该卖家所有商品？`, ``)
      // TODO:获取需要删除的商品id
      let goodsArray = []
      sellItem.goodsList.forEach(item => {
        goodsArray.push(item.goodsId)
      })
      let res = await this.CartService.removeGoods(goodsArray.join(','))
      if (res === true) {
        this.$router.go(0)
      }
    },
    beforeDestroy() {
      this.$messagebox.close()
    }
  },
  components: {
    goodsItem
  }
}
</script>
<style lang="scss" >
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
.bq-cart {
  background-color: $bg-color;
  &-headright {
    .mint-button-text {
      color: $font-color;
      @include font-dpr(14px);
    }
  }
  &-content {
    margin-bottom: 46px;
  }
  &-content[padding-bottom=true] {
    margin-bottom: 91px;
  }
  .operatebtn {
    position: absolute;
    right: 0px;
    top: 0px;
    background-color: #FF7700;
    min-height: 100%;
    &[disabled=disabled] {
      background-color:#ccc;
    }
    label {
      color: #fff;
    }
    &.itemdel {
      width: 65px;
      right: 30px;
    }
  }
  .shop-item {
    background-color: #fff;
    margin-top: 10px;
    > p, > div {
      padding: 0 15px;
    }
    > div {
      border-bottom: 1px solid $border-color;
    }
    &:first-child {
      margin-top: 0px;
    }
  }
  .shop-item .name {
    height: 34px;
    @include font-dpr(14px);
    color: $font-color;
    line-height: 34px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    > span {
      @include font-dpr(12px);
      color: #202020;
    }
    &[isnoborder=true] {
      border-bottom: 0px;
    }
    .rightdelt {
      float: right;
      color: $danger;
    }
  }
  .shop-item .cou {
    background-color: #FEF3CC;
    color: $danger;
    @include font-dpr(12px);
    height: 30px;
    line-height: 30px;
    span {
      float: right;
    }
  }
  .shop-item-foot {
    height: 55px;
    position: relative;
    p {
      display: flex;
      // flex-direction: column;
      padding: 10px 82px 0 0;
      color: $font-color;
      @include font-dpr(14px);
      line-height: 16px;
      span {
        width: 50%;
      }
      .count {
        @include font-dpr(12px);
        color: #666666;
        margin-top: 3px;
        flex: 1;
        display: flex;
      }
      .count-price {
        color: $danger;
      }
      // 营销优惠价格
      &.youhui {
        padding-top: 3px;
        span {
          @include font-dpr(12px);
          color: #333333;
        }
      }
    }
    > button {
      width: 107px;
    }
  }
  .bq-page-prompt__btns .mint-button {
    margin-top: 20px;
  }
  span[arrow]{
    &:after {
      content: ' ';
      width: 8px;
      display: inline-block;
      height: 8px;
      transform: rotate(44deg);
      border-right: 1px solid $danger;
      border-top: 1px solid $danger;
      margin-left: 8px;
    }
  }
  .shop-item .cou[isclosesell=true] {
    background-color: $border-color;
    color: #fff;
    span[arrow] {
      &:after {
        border-right: 1px solid #fff;
        border-top: 1px solid #fff;
      }
    }
  }
  &-foot {
    background-color: #FFFFFF;
    height: 44px;
    line-height: 44px;
    padding-left: 15px;
    @include font-dpr(16px);
    color: $font-color;
    border-top: 1px solid $border-color;
    bottom: 50px;
    .alldel {
      width: 100px;
      right: 15px;
    }
  }
  .modify {
    right: 19px;
  }

  .prompttitle {
    color: red;
    @include font-dpr(13px);
    padding: 0 3px;
  }
}
.bq-cart .bq-checkbox-wrapper .bq-checkbox-input:disabled + .bq-checkbox-core {
  background-color: #d8d8d8;
}
</style>
