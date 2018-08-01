import { GET_GOODS_LIST, GET_GOODS_STATUS, GET_GOODS_CATE, GET_GOODS_NOCATE } from '../mutation.types'
const state = {
  // 商品列表
  goodsList: [],
  goodCate: {},
  goodNoCate: {},
  status: {
    loading: false, // 是否处于加载中
    noMoreGoods: false, // 加载完毕
    params: {},
    cateChange: true,
    tagList: false // 是否是 分类标签
  }
}

const mutations = {
  [GET_GOODS_LIST](state, value) {
    state.goodsList = value
  },
  [GET_GOODS_CATE](state, value) {
    state.goodCate = value
  },
  [GET_GOODS_NOCATE](state, value) {
    state.goodNoCate = value
  },
  [GET_GOODS_STATUS](state, value) {
    state.status = {
      ...state.status,
      ...value
    }
  }
}

export default {
  state,
  mutations
}
