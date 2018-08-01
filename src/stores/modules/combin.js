import { COMBIN_PAGE_STATUS } from '../mutation.types'
const state = {
  // 组合页面是否存在
  pageStatus: false
}

const mutations = {
  [COMBIN_PAGE_STATUS](state, value) {
    state.pageStatus = value
  }
}

export default {
  state,
  mutations
}
