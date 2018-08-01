import {get, post} from 'http'
import {CancelToken} from 'axios'
export default class GoodService {
  constructor() {
    this.cancelGoodsList = null
    this.cancelGoodsSearch = null
    this.cancelCateList = null
    this.cancelGetTagGoodsList = null
  }
  /**
   *
   * 获取商品详情页数据
   * @param {any} params.uid 买家ID [必须]
   * @param {any} params.sku 商品id [必须]
   * @param {any} params.client 微信：10 PC：20 APP：30（数字类型）
   * @returns
   * @memberof GoodService
   */
  getDetail(params, config = {}) {
    params.client = 10
    return get('buyer/goods/detail', params, config)
  }
  /**
   *
   * 获取商品分类列表
   * @param {any} params.uid 买家ID [必须]
   * @param {any} params.sellerId 卖家ID [非必须] 卖家首页时必须
   * @returns
   * @memberof GoodService
   */
  getCateList(params) {
    if (this.cancelCateList) {
      this.cancelCateList()
      this.cancelCateList = null
    }
    return get('buyer/goods/cate/list', params, {
      isLoading: false,
      cancelToken: new CancelToken(c => {
        this.cancelCateList = c
      })
    })
  }

  /**
   *
   * 获取卖家基本信息
   * @param {any} params.uid 买家ID [必须]
   * @param {any} params.sellerId 卖家ID [必须]
   * @returns
   * @memberof GoodService
   */
  getSellerInfo(params) {
    return get('buyer/goods/seller/index', params)
  }

  /**
   *
   * 搜索商品
   * @param {any} params.uid 买家ID [必须]
   * @param {any} params.parameter sku 或者 商品名称 [必须]
   * @param {any} params.sellerId 卖家id
   * @param {any} params.cateId 分类id
   * @param {any} params.page 分页 [必须]
   * @param {any} params.pageSize 显示的页数 [必须]
   * @param {any} params.client 微信：10 PC：20 APP：30（数字类型）
   * @returns 搜索到的商品列表
   * @memberof GoodService
   */
  getGoodsSearch(params = {}) {
    if (this.cancelGoodsSearch) {
      this.cancelGoodsSearch()
      this.cancelGoodsSearch = null
    }
    delete params.type
    params.client = 10
    return get('buyer/goods/search', params, {
      isLoading: false,
      cancelToken: new CancelToken(c => {
        this.cancelGoodsSearch = c
      })
    })
  }

  /**
   *
   * 获取商品列表
   * @param {any} params.uid 买家ID [必须]
   * @param {any} params.cateId 卖家ID [必须]
   * @param {any} params.page 第几页 [必须]
   * @param {any} params.sellerId 卖家id [卖家首页 必须]
   * @param {any} params.pageSize 页数 [必须]
   * @param {any} params.type 1 新品 2 热销 3 常买 4 分类标签
   * @param {any} params.client 微信：10 PC：20 APP：30（数字类型）
   * @returns
   * @memberof GoodService
   */
  getCateGoodsList(params) {
    // 搜索条件是否有值 如果带搜索条件 直接使用 搜索请求
    params.client = 10
    if (params.parameter) {
      return this.getGoodsSearch(params)
    }
    if (this.cancelGoodsList) {
      this.cancelGoodsList()
      this.cancelGoodsList = null
    }
    return get('buyer/goods/list', params, {
      isLoading: false,
      cancelToken: new CancelToken(c => {
        this.cancelGoodsList = c
      })
    })
  }

/**
 *
 * 获取分类标签列表
 * @param {any} params.uid 买家ID [必须]
 * @param {any} params.sellerId 卖家id [必须]
 * @returns
 * @memberof GoodService
 */
  getTagList(params) {
    return get('buyer/goods/cate/tag/list', params)
  }
  /**
   *
   * 获取分类标签商品列表
   * @param {any} params.uid 买家ID [必须]
   * @param {any} params.cateId 卖家ID [必须]
   * @param {any} params.page 第几页 [必须]
   * @param {any} params.pageSize 页数 [必须]
   * @param {any} params.sellerId 卖家id [必须]
   * @param {any} params.type 1 新品 2 热销 3 常买 4 分类标签 [必须]
   * @param {any} params.client 微信：10 PC：20 APP：30（数字类型）
   * @returns
   * @memberof GoodService
   */
  getTagGoodsList(params) {
    if (this.cancelGetTagGoodsList) {
      this.cancelGetTagGoodsList()
      this.cancelGetTagGoodsList = null
    }
    params.client = 10
    return get('buyer/goods/customize/tag/goods/list', params, {
      cancelToken: new CancelToken(c => {
        this.cancelGetTagGoodsList = c
      })
    })
  }
  /**
   *
   * 一键订购
   * @param {any} params.uid 买家ID [必须]
   * @param {any} params.cateTagId 卖家ID [必须]
   * @returns
   * @memberof GoodService
   */
  getTagGoodBuy(params) {
    return post('buyer/order/cart/batch/add', params)
  }
  /**
   * 首页分类广告位->分类商品列表页
   * @param {any} params.uid 买家ID [必须]
   * @param {any} params.page 页码 [必须]
   * @param {any} params.pageSize 每页大小 [必须]
   * @param {any} params.cateId1 一级分类id [必须]
   * @param {any} params.cateId2Str 二级分类id [不是必须]
   * @param {any} params.client 微信：10 PC：20 APP：30（数字类型）
   * @returns
   * @memberof GoodService
   */
  getBuyerCateList(params) {
    params.client = 10
    return get('buyer/goods/cate/goods/list', params)
  }

  /**
   *
   * 获取商品属性列表
   * @param {any} params sellerId 卖家Id
   * @param {any} params sku 主商品的sku, 买家查列表获取的信息全是主商品的
   * @returns Promise
   * @memberof GoodService
   */
  getPropertyList(params) {
    return get('buyer/goods/property/list', params)
  }
  /**
   *
   * 搜索
   * @param {any} params.uid
   * @param {any} params.keyword  关键字
   * @param {any} params.sellerId 卖家id  关键字
   * @returns
   * @memberof GoodService
   */
  autoSuggest(params = {}) {
    return get('buyer/search/keyword/query', params, {isLoading: false})
  }
  /**
   *
   * 搜索历史
   * @param {any} params.uid
   * @returns
   * @memberof GoodService
   */
  historySuggest(params = {}) {
    return get('buyer/search/record/list', params, {isLoading: false})
  }
  /**
   *
   * 删除
   * @param {any} params
   * @returns
   * @memberof GoodService
   */
  delSearch(params = {}) {
    return post('buyer/search/record/delete', params, {isLoading: false})
  }

  /**
   *
   * 查询组合套餐
   * @param {any} spu
   * @param {any} sellerId
   * @returns
   * @memberof GoodService
   */
  combinPackages(params = {}) {
    return get('buyer/combination/packages/list', params)
  }

  /**
   *
   * 组合套餐 一键订购
   * @param {any} activityId
   * @param {any} groupId
   * @returns
   * @memberof GoodService
   */
  combinPackagesAdd(params = {}) {
    return post('buyer/combination/packages/add', params)
  }
}
