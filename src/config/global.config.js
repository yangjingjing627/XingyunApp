// 接口地址
export let API_HOST = bq.isProductionAPI ? 'http://api/' : 'http://test/api/'

// 版本
export let VERSION = bq.version || '1.0'

// 过滤掉 不需要在 路由加载完后 关闭掉loading 的页面 在 页面本身 去设置loading
export let NoAfterRouteIsLoading = [
  'cart',
  'category',
  'me',
  'WxOauth',
  'buyer',
  'template',
  'StoreUpload'
]

// 不需要加载loading 的情况
export let NoLoading = [
  'home'
]
