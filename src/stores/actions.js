import {
  GET_CART_COUNT,
  GET_GOODS_LIST,
  GET_GOODS_STATUS,
  GET_ORDER_SEARCH_STATUS
} from './mutation.types'
import WxConfig from '@/config/wx.config'
import OrderCartService from '@/services/order.cart.service'
import GoodService from '@/services/goods.service'

let wxConfig = new WxConfig()
let orderCartService = new OrderCartService()
let goodService = new GoodService()
  // 初始化微信
export const initWx = async({ commit }, url) => {
  try {
    if (/micromessenger/i.test(navigator.userAgent)) {
      await wxConfig.init(url)
    }
  } catch (err) {
    console.log(err)
  }
}

// 购物车数量
export const getCartCount = async({
  commit,
  state
}, params) => {
  let res = await orderCartService.getCartCount(params)
  let { cartCount } = res
  commit(GET_CART_COUNT, cartCount)
}

export const getGoodsList = async({
  commit,
  state
}, params) => {
  commit(GET_GOODS_STATUS, {params: params, loading: true, noMoreGoods: false})
  let allList = state.goods.goodsList
  let res = {}
  if (params.cateTagId) {
    res = await goodService.getTagGoodsList(params)
    commit('GET_GOODS_CATE', res)
  } else {
    res = await goodService.getCateGoodsList(params)
    commit('GET_GOODS_NOCATE', res)
  }
  let list = res.list || []
  list.map(function (item) {
    if (item.storeList && item.storeList.length > 0) {
      item.good_empty = true // 商品库存是否全为0
      // 商品为补货中状态，如果库存减去购物车数量大于等于 订货单位，是非补货状态
      item.storeList.map(function (sitem) {
        sitem.book = sitem.cartCount
        if (sitem.stock - sitem.cartCount * 1 >= sitem.orderUnit) {
          item.good_empty = false
        }
        return sitem
      })
    }
    return item
  })
  allList = allList.concat(list)
  if (res.next === 0) {
    let status = { loading: true, noMoreGoods: true, params: params }
    commit(GET_GOODS_STATUS, status)
  } else {
    let status = { loading: false, noMoreGoods: false, params: params }
    commit(GET_GOODS_STATUS, status)
  }
  // 判断是不是第一页 第一页只取当前结果
  if (params.page === 1) {
    commit(GET_GOODS_LIST, list)
  } else {
    commit(GET_GOODS_LIST, allList)
  }
}

export const setOrderSearchParams = ({commit, state}, params) => {
  commit(GET_ORDER_SEARCH_STATUS, {params})
}
