<template>
  <div class="modify">
    <div class="ding-add-less">
      <span class="less" :class="{'no': isLess}" @click="lessOrder()"></span>
      <span class="change">{{ count }}</span>
      <span class="add" :class="{'no': isAdd}" @click="addOrder()"></span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      count: ''
    }
  },
  props: ['goodsData'],
  computed: {
    isLess () {
      return this.count === 0
    },
    isAdd () {
      return this.maxCount - this.count <= 0
    },
    maxCount () {
      if (this.goodsData.canReturnCount || this.goodsData.canReturnCount === 0) {
        return this.goodsData.canReturnCount
      } else {
        return this.goodsData.sendCount
      }
    }
  },
  mounted () {
    if (this.goodsData.setquantity > 0) {
      this.count = this.goodsData.setquantity
    } else {
      this.count = this.goodsData.canReturnCount || this.goodsData.sendCount || 0
    }
  },
  watch: {
    maxCount (val) {
      this.count = parseInt(val)
    }
  },
  methods: {
    lessOrder () {
      if (this.isLess) {
        return
      }
      this.count = this.count - 1
      let goods = {
        ...this.goodsData,
        count: this.count
      }
      this.$emit('modifyOrderEnd', goods)
    },
    changeOrder () {
      let orderCount = this.count || 0
      this.$messagebox.prompt('修改商品数量', '', {
        inputValue: orderCount
      }).then(({ value }) => {
        this.count = parseInt(value)
        if (this.count < 0) {
          this.count = 0
          this.isLess = true
          this.$messagebox.alert('请输入1-99999的整数')
        }
        if (this.count > this.goodsData.canReturnCount || this.count > this.goodsData.sendCount) {
          this.count = this.goodsData.canReturnCount || this.goodsData.sendCount
          this.isAdd = true
          if (this.goodsData.canReturnCount) {
            this.$messagebox.alert('可退数量不得大于实收数量')
          }
          if (this.goodsData.sendCount) {
            this.$messagebox.alert('实收数量不得大于发货数量')
          }
        }
        let goods = {
          ...this.goodsData,
          count: this.count
        }
        this.$emit('modifyOrderEnd', goods)
      }).catch(() => {
      })
    },
    addOrder () {
      if (this.isAdd) {
        return
      }
      this.count = this.count + 1
      let goods = {
        ...this.goodsData,
        count: this.count
      }
      this.$emit('modifyOrderEnd', goods)
    }
  }
}
</script>
<style lang="scss" scoped>
@import './modify.scss';
</style>
