import {getTotalPrice} from './common/cart.helper'
// 购物车营销逻辑
export default {

  methods: {

    // 店铺勾选触发
    storeCheckedChange() {
      let hasNoSelect = true
      this.list.forEach(item => {
        if (!item.isChecked) {
          hasNoSelect = false
          return false
        }
        return true
      })
      this.isAllSel = hasNoSelect
    },

    /**
     *
     * 单个商品更改 触发
     * @param {Object} item 单个店铺的商品信息
     */
    onCheckedChange(item) {
      for (let activityIndex in item.activityList) {
        let activity = item.activityList[activityIndex]
        let goods = activity.goodsList
        for (let goodIndex in goods) {
          let good = goods[goodIndex]
          // 删除状态下
          if (this.isDel && !good.isChecked) {
            item.isChecked = false
            getTotalPrice.call(this, item)
            this.storeCheckedChange()
            return false
          }
          // 非删除状态
          if (!this.isDel && !good.isChecked && !good.noChecked) {
            item.isChecked = false
            getTotalPrice.call(this, item)
            return false
          }
        }
      }
      item.isChecked = true
      getTotalPrice.call(this, item)
      this.storeCheckedChange()
    },

    /**
     *
     * 店铺选中状态 变更
     * @param {any} item
     */
    onStoreChecked(item) {
      item.activityList = item.activityList.map(activity => {
        activity.goodsList = activity.goodsList.map(good => {
          if (this.isDel) {
            good.isChecked = item.isChecked
          } else {
            if (!good.noChecked) {
              good.isChecked = item.isChecked
            }
          }
          return good
        })
        return activity
      })
      getTotalPrice.call(this, item)
    },

    /**
     *
     * 权限按钮点击
     */
    onAllChange() {
      this.list = this.list.map(item => {
        item.isChecked = this.isAllSel
        this.onStoreChecked(item)
        return item
      })
    },

    /**
     *
     * 删除某个店铺 由删除单个商品引起后删除
     * @param 当前店铺下标
     */
    onDeleteStore(index) {
      this.list.splice(index, 1)
      this.scroll()
    },
    scroll () {
      // 滚动 卖家条驻留在顶部
      let listLength = this.list.length
      let sellerTops = []
      let top = document.getElementsByClassName('scroller')[0].scrollTop
      for (let i = 0; i < listLength; i++) {
        sellerTops[i] = document.getElementsByClassName('store-top')[i].offsetTop
      }
      // 当卖家滚动条到顶部时，顶部条的内容更换
      for (let j = 0; j < listLength; j++) {
        if (sellerTops[j] > top) {
          this.listStop = this.list[j - 1]
          break
        }
        // 最后一个特殊处理
        if (j === listLength - 1) {
          this.listStop = this.list[j]
          break
        }
      }
    }
  }
}
