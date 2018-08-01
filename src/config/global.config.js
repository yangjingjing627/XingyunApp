// 接口地址
export let API_HOST = bq.isProductionAPI ? 'http://yuncai.bqmart.cn/cloud/api/' : 'http://test.cloud.bqmart.cn/cloud/api/'
// export let API_HOST = 'http://192.168.0.57:8080/cloud/api/'

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
