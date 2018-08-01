<template>
  <div class="bq-pay-pwd">
    <div class="bq-pay-pwd-container" >
      <input class="bq-pay-pwd-container-trigger"
       name="pwd"
       type="tel"
       ref="input"
       v-model="currentValue"
       @focus="onFocus"
       @blur="onBlur"
       @input="onChange"
       :style="{marginLeft: active ? '-2500px' : 0}" >
    </div>
    <div class="bq-pay-pwd-modal" >
      <div class="bq-pay-pwd-modal-input">
        <span :class="{'dotted': active}"><i :class="{'dotted': len(0)}">&nbsp;</i></span>
        <span :class="{'dotted': active}"><i :class="{'dotted': len(1)}">&nbsp;</i></span>
        <span :class="{'dotted': active}"><i :class="{'dotted': len(2)}">&nbsp;</i></span>
        <span :class="{'dotted': active}"><i :class="{'dotted': len(3)}">&nbsp;</i></span>
        <span :class="{'dotted': active}"><i :class="{'dotted': len(4)}">&nbsp;</i></span>
        <span :class="{'dotted': active}"><i :class="{'dotted': len(5)}">&nbsp;</i></span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        active: false,
        currentValue: ''
      }
    },
    props: {
      value: {}
    },
    watch: {
      value(val) {
        this.currentValue = val
      },
      currentValue(val) {
        this.$emit('input', String(val))
      }
    },
    methods: {
      onFocus() {
        this.active = true
      },
      onBlur() {
        this.active = false
      },
      blur() {
        this.$refs.input.blur()
      },
      onChange(e) {
        let val = String(e.target.value)
        this.currentValue = val.length > 6 ? val.substr(0, 6) * 1 : val
      },
      len(index) {
        let val = String(this.currentValue)
        return val.substr(index, 1) !== ''
      }
    }
  }
</script>
<style lang="scss">
@import 'scss/variables';
@import 'scss/mixin';
.bq-pay-pwd{
  &-container {
    opacity: 0;
    position: absolute;
    z-index: 20000;
    width: 100%;
    height: 44px;
    &-trigger {
      display: block;
      width: 100%;
      height: 44px;
      -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
      border: 0;
      opacity: 0;
      text-indent: -1200px;
      color: #fff;
    }
  }
  &-modal {
    height: 43px;
    padding: 0 40px;
    text-align: center;
    &-input {
      height: 43px;
      display: flex;
      flex-wrap: wrap;
      border:1px solid rgb(248, 248, 248);
      align-content: space-between;
      span{
        &:first-child {
          margin-left: 0;
        }
        background: #fff;
        width: 45px;
        min-width: 45px;
        height: 45px;
        padding-bottom: 1px;
        margin-left: 0px;
        @include border-zero-5 ();
      }
      i {
        display: block;
        overflow: hidden;
        width: 100%;
        height: 100%;
        @include border-zero-5 ();
        &.dotted {
          background: url(../../../../assets/img/my/short-pwd-char.png) no-repeat center center;
          background-size: 17px 17px;
        }
      }
    }
  }
}

</style>
