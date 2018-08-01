export default {
  methods: {
    goLink(linkVal) {
      let link = JSON.parse(linkVal)
      switch (link.type) {
        // 专题
        case 1:
          window.location.href = `/template/${link.templateId}`
          break
        // 分类
        case 2:
          let url = ['/category/list']
          let cate1 = link.cate1
          cate1 && url.push(cate1)
          let cate2 = link.cate2
          cate2 && url.push(cate2)
          this.$router.push(url.join('/'))
          break
        // sku 详情页
        case 3:
          this.$router.push(`/goods/detail/${link.sku}`)
          break
        // 自定义连接
        case 4:
          window.location.href = link.url
          break
      }
      console.log(link)
    }
  }
}
