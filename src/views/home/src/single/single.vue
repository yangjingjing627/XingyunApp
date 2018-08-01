<template>
<component :is="getSingle" :list="list">
</component>
</template>
<script>
import single1 from './single.1'
import singleMore from './single.more'
import HomeService from '@/services/home.service'

export default {
  data() {
    return {
      getSingle: '',
      list: []
    }
  },
  computed: {
    // getSeckill() {
    //   return 'single-1'
    // }
  },
  async created() {
    this.HomeService = new HomeService()
    let list = await this.HomeService.singleList()
    this.list = list
    if (list.length > 1) {
      this.getSingle = 'single-more'
    } else if (list.length === 1) {
      this.getSingle = 'single-1'
    }
  },
  components: {
    'single-1': single1,
    'single-more': singleMore
  }
}
</script>
<style lang="scss" scoped>
</style>
