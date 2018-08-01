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
       :style="{marginLeft: active ? '-2500px' : 0}"
       >
    </div>
    <div class="bq-pay-pwd-modal" >
      <div class="bq-pay-pwd-modal-input">
        <span>{{len(0)}}</span>
        <span>{{len(1)}}</span>
        <span>{{len(2)}}</span>
        <span>{{len(3)}}</span>
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
        this.currentValue = val.length > 4 ? val.substr(0, 4) * 1 : val
      },
      len(index) {
        let val = String(this.currentValue)
        return val.substr(index, 1)
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
    margin-top: 10px;
    height: 43px;
    padding: 0 46px;
    text-align: center;
    &-input {
      height: 43px;
      display: flex;
      flex-wrap: wrap;
      border:1px solid rgb(248, 248, 248);
      align-content: space-between;
      span{
        display: inline-block;
        background: #fff;
        width: 45px;
        min-width: 45px;
        height: 45px;
        line-height: 45px;
        margin-left: 9px;
        font-size: 14px;
        border-radius: 4px;
        @include border-zero-5 ();
        &:after{
          content: '';
          width: 200%;
          height: 200%;
          position: absolute;
          top: 0;
          left: 0;
          border: 1px solid #999;
          border-radius: 4px;
        }
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
}

</style>
