<template lang="html">
  <div class="bq-g-s-tag">
    <div class="bq-g-s-tag__header bq-f-size-14">
      <span>{{ title }}</span>
      <i class="bq-icon-del" @click="onDel" v-if="del"></i>
    </div>
    <div class="bq-g-s-tag__content clearfix">
      <a v-if="list && list.length > 0 && item.length > 0"
        v-for="item in list"
        @click="selectHistory(item)"
        class="bq-f-size-14 active">
        {{ item }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {},
    list: {},
    del: false
  },
  methods: {
    selectHistory (item) {
      this.$emit('searchGoods', item)
    },
    onDel() {
      this.$emit('del')
    }
  }
}
</script>

<style lang="scss">
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
.bq-g-s-tag {
   width: 100%;
   height: 100%;
    background-color: #ffffff;
    // background: red;
    margin-top: 10px;
    .bq-icon-del{
      width: 15px;
      height: 15px;
      background: url('../../../assets/img/home/del.png') no-repeat;
      background-size: 100%;
      margin-right: 14px;
    }
    &__header {
      width: 100%;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      display: flex;
      span {
        padding-left: 14px;
        flex: 1;
      }
    }
    &__content {
      height: 500px;
      margin-bottom: 10px;
        // margin-left: -10px;
        a {
            &.active {
                border: 1px solid #D8D8D8;
                border-radius: 2px;
                background: #fff;
                // box-shadow: 0 2px 6px 0 rgba(221,203,117,0.50);
            }
            display: inline-block;
            margin: 0 0 10px 10px;
            height: 24px;
            line-height: 24px;
            padding: 4px 10px;
            color: #505050;
            border: 1px solid #D8D8D8;
            border-radius: 2px;
            max-width: 80%;
            white-space: nowrap;
            text-overflow:ellipsis;
            overflow: hidden;
            border-radius: 4px;
            font-size: 13px;
            // @include border-zero-5(#666) {
            //     border-radius: 4px;
            // };
        }
    }
}
</style>
