<template>
  <label class="bq-checkbox-wrapper" :class="[type === 'radio' ? 'bq-radio-wrapper' : '']">
    <span class="bq-checkbox">
      <input class="bq-checkbox-input"
      v-if="type === 'radio' && !isCheckbox"
      type="radio"
      v-model="currentValue"
      :value="val"
      :id="id"
      :disabled="disabled">
      <input class="bq-checkbox-input"
      v-else
      type="checkbox"
      v-model="currentValue"
      :value="val"
      :id="id"
      :disabled="disabled">
      <span class="bq-checkbox-core"></span>
    </span>
    <span :for="id" class="bq-checkbox-label" v-if="label" >{{ label }}</span>
  </label>
</template>
<script>
/**
 * checkbox
 * @param {Boolean} disabled 禁用
 * @param {String} label 文本描述
 * @param {String} val val 值
 * @param {Boolean} isRadio val 值
 */
export default {
  name: 'bq-checkbox',
  data() {
    return {
      currentValue: this.value
    }
  },
  props: {
    disabled: Boolean,
    label: String,
    val: String,
    value: {},
    isCheckbox: {
      type: Boolean,
      default: true
    },
    id: String,
    type: {
      default: 'checkbox',
      type: String,
      validator(value) {
        return ['checkbox', 'radio'].indexOf(value) > -1
      }
    }
  },
  watch: {
    value(val) {
      this.currentValue = val
    },
    currentValue(val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  $checkbox-border-color:  #666666;
  .bq-checkbox-wrapper {
    // padding: 0 10px;
    .bq-checkbox {
      &-input{
        display: none;
        &:checked {
          + .bq-checkbox-core {
            background-color: $primary;
            // border-color: $primary;
             &::after {
              border-color: $checkbox-border-color;
              transform: rotate(45deg) scale(1);
            }
          }
        }
      }
      &-core {
        box-sizing: border-box;
        display: inline-block;
        background-color: #FFFFFF;
        border: 1px solid $checkbox-border-color;
        position: relative;
        width: 15px;
        height: 15px;
        vertical-align: middle;
        margin-top: -2px;
        &::after {
          border: 2px solid transparent;
          border-left: 0;
          border-top: 0;
          content: " ";
          position: absolute;
          top: 2px;
          left: 4px;
          width: 3px;
          height: 6px;
          transform: rotate(45deg) scale(0);
          transition: transform .2s;
        }
      }
      &-label {
        margin: 8px;
        margin-left: 6px;
      }
    }
  }

  .bq-radio-wrapper {
    .bq-checkbox-core {
      border-radius: 100%;
    }
  }

</style>
