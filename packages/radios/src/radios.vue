<template>
  <bq-card class="bq-radios">
    <bq-card-item padding no-margin
      v-for="(option, index) in options"
      :class="{'is-right': align === 'right'}"
      :key="'ra' + index">
      <label class="bq-checkbox-wrapper" :class="[type === 'radio' ? 'bq-radio-wrapper' : '']">
        <span class="bq-checkbox">
          <input class="bq-checkbox-input"
          v-if="type === 'radio'"
          type="radio"
          v-model="currentValue"
          :value="option.value"
          :id="option.id || 'bqRadios' + index"
          :disabled="option.disabled">
          <input class="bq-checkbox-input"
          v-else
          type="checkbox"
          v-model="currentValue"
          :value="option.value"
          :id="option.id || 'bqRadios' + index"
          :disabled="option.disabled">
          <span class="bq-checkbox-core"></span>
        </span>
        <span v-if="option.rightText" class="bq-checkbox-right" >
          {{ option.rightText }}
        </span>
        <span :for="option.id || 'bqRadios' + index" class="bq-checkbox-label" v-if="option.text" >{{ option.text }}</span>
      </label>
    </bq-card-item>
  </bq-card>
</template>
<script>
import CardItem from '../../card.item'
export default {
  name: 'bq-radios',
  data() {
    return {
      currentValue: this.value
    }
  },
  props: {
    // disabled: Boolean,
    // title: String,
    // value: String,
    // id: String,
    value: {},
    options: {
      type: Array,
      require: true
    },
    type: {
      default: 'radio',
      type: String,
      validator(value) {
        return ['checkbox', 'radio'].indexOf(value) > -1
      }
    },
    align: {
      default: 'left',
      type: String,
      validator(value) {
        return ['left', 'right'].indexOf(value) > -1
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
  },
  components: {
    CardItem
  }
}
</script>
<style lang="scss">
  .bq-radios {
    .bq-card-item__right {
      display: none;
    }
    .is-right {
      .bq-checkbox-wrapper {
        display:  flex;
        .bq-checkbox {
          display: flex;
          align-items: center;
          justify-content: center;
          order: 2;
        }
        .bq-checkbox-label {
          flex: 1;
          margin: 0;
          margin-left: 6px;
        }
        .bq-checkbox-right {
          order: 1;
        }
      }
    }
  }
</style>
