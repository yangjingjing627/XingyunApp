<template>
  <div class="assemble-content">
    <div v-for="item in list3">
      <assemble-3 :list="item"></assemble-3>
    </div>
    <assemble-1 :list="list1"></assemble-1>
  </div>
</template>
<script>
import assemble1 from './assemble.1'
import assemble3 from './assemble.3'
export default {
  data() {
    return {
      list: [
        {
          background: '#fff',
          title1: '每周半价1',
          title2: '精选商品好货选不停',
          title1Color: '#6A6E30',
          title2Color: '#A5A870',
          img: 'http://img.bqmart.cn/data/files/store/1501928062031.jpg'
        },
        {
          background: '#fff',
          title1: '每周半价2',
          title2: '精选商品好货选不停',
          title1Color: '#6A6E30',
          title2Color: '#A5A870',
          img: 'http://img.bqmart.cn/data/files/store/1501928062031.jpg'
        },
        {
          background: '#fff',
          title1: '每周半价3',
          title2: '精选商品好货选不停',
          title1Color: '#6A6E30',
          title2Color: '#A5A870',
          img: 'http://img.bqmart.cn/data/files/store/1501928062031.jpg'
        },
        {
          background: '#fff',
          title1: '每周半价4',
          title2: '精选商品好货选不停',
          title1Color: '#6A6E30',
          title2Color: '#A5A870',
          img: 'http://img.bqmart.cn/data/files/store/1501928062031.jpg'
        },
        {
          background: '#fff',
          title1: '每周半价5',
          title2: '精选商品好货选不停',
          title1Color: '#6A6E30',
          title2Color: '#A5A870',
          img: 'http://img.bqmart.cn/data/files/store/1501928062031.jpg'
        },
        {
          background: '#fff',
          title1: '每周半价6',
          title2: '精选商品好货选不停',
          title1Color: '#6A6E30',
          title2Color: '#A5A870',
          img: 'http://img.bqmart.cn/data/files/store/1501928062031.jpg'
        },
        {
          background: '#fff',
          title1: '每周半价7',
          title2: '精选商品好货选不停',
          title1Color: '#6A6E30',
          title2Color: '#A5A870',
          img: 'http://img.bqmart.cn/data/files/store/1501928062031.jpg'
        }
      ]
    }
  },
  computed: {
    list1() {
      let l = this.list.length
      let list1 = []
      if (l % 3 === 1) {
        list1.push(this.list[l - 1])
      } else if (l % 3 === 2) {
        list1.push(this.list[l - 2])
        list1.push(this.list[l - 1])
      }
      return list1
    },
    list3 () {
      let list3 = []
      let l = this.list.length
      for (let i = 3; i <= l; i = i + 3) {
        let list = []
        list.push(this.list[i - 3])
        list.push(this.list[i - 2])
        list.push(this.list[i - 1])
        list3.push(list)
      }
      return list3
    }
  },
  components: {
    'assemble-1': assemble1,
    'assemble-3': assemble3
  }
}
</script>
<style lang="scss" scoped>
.assemble-content{
  margin-bottom: 10px;
}
</style>
