<template>
  <h1>正在进行授权操作中...</h1>
</template>
<script>
export default {
  created() {
    let query = this.$route.query
    Object.keys(query).forEach(key => {
      if (key === 'myUrl') {
        return
      }
      this.$cookie.set(key, query[key], {
        path: '/', // cookie值保存的路径，默认与创建页路径一致
        expires: 360 // 设置时间，如果此处留空，则浏览器关闭此cookie就失效。
      })
    })
    // 如果是 带有跳转url 的直接跳转
    if (query.myUrl) {
      this.$router.replace(query.myUrl)
      return
    }
    this.$router.replace('/')
  },
  beforeDestroy() {
    this.$store.commit('UPDATE_LOADING', { isLoading: false })
  },
  beforeRouteEnter(to, from, next) {
    let {name} = from
    if (name === 'login' || name === 'home') {
      next()
      wx.ready(() => {
        wx.closeWindow()
      })
      return
    }
    next()
  }
}
</script>
