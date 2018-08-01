/**
* 首页单栏专区 banner跳转页面方法
*/
import RecordService from '@/services/record.service'
let recordService = new RecordService()

export const goPage = async(router, item) => {
  let link = {}
  if (item.linkValue) {
    link = JSON.parse(item.linkValue)
  }
  let params = ''
  // programId banner或单栏id
  // programType 栏目类型 1:单栏;2:组合;3:banner
  if (item.programId && item.programType) {
    params = '?programId=' + item.programId + '&programType=' + item.programType
  }
  console.log(new Date().getTime())
  try {
    if (item.programType) {
      let res = await recordService.recording({type: 1, uniqueId: item.programId})
      // return
      console.log(res)
    }
  } catch (e) {
    console.log(e)
  }
  console.log(new Date().getTime())
  switch (link.type) {
    // 专题
    case 1:
      window.location.href = `/template/${link.templateId}` + params
      break
    // 分类
    case 2:
      let url = ['/category/list']
      let cate1 = link.cate1
      cate1 && url.push(cate1)
      let cate2 = link.cate2
      cate2 && url.push(cate2)
      router.push(url.join('/'))
      break
    // sku 详情页
    case 3:
      router.push(`/goods/detail/${link.sku}`)
      break
    // 自定义连接
    case 4:
      window.location.href = link.url
      break
  }
}
