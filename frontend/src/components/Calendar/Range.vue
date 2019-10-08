<template>
  <div class="form-group range">
    <h2 class="range__header">Wybierz liczbę dni</h2>
    <div v-for="(value, index) in values" :key="value.range" class="range__item radio">
      <input type="radio" name="calendar-range-selector"
        :id="'calendar-range-selector-value' + index" :value="value.range" :disabled="!_isRangeEnabled(value.range)"
        v-model="selected" @input="select(value.range)" @click="select(value.range)">
      <label :for="'calendar-range-selector-value' + index"
        :class="{
          'range__label': true,
          'range__label--disabled': !_isRangeEnabled(value.range),
          'disabled': !_isRangeEnabled(value.range),
        }">
        {{ value.range | formatRange }}
      </label>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    ranges: {
      required: false,
      type: Array,
      default: () => [ ],
    },
    enabled: {
      required: false,
      type: Array,
      default () {
        return this.ranges.slice(0)
      },
    },
    value: {
      required: false,
      type: String,
      default: () => '',
    },
  },
  filters: {
    formatRange (value) {
      return value.split(':').join('-')
    },
  },
})
export default class Range extends Vue {
  values = this.ranges.map(range => ({ range, selected: range == this.value }))
  selected = this.value

  created () {
    log.debug('Range.created', 'enabled', this.enabled)
  }

  get isAtLeastOneRangeSelected () {
    return this.value != ''
  }

  _isRangeEnabled (range) {
    return this.enabled.length === 0 || this.enabled.some(x => x === range)
  }

  select (range) {
    if (this._isRangeEnabled(range))
      this.$emit('input', range)
  }
}
</script>

<style lang="scss">
.range {
  display: block;
  background-color: #22B6FB;

  &__header {
    font-weight: bold;
    font-size: 12px;
    line-height: 13.2px;
    text-transform: uppercase;
    color: white;
    text-align: left;
    margin: 21px 15px 20px 27px;
  }

  &__item {
    margin-left: 26px;
    padding: 0 !important;
    min-height: 26px !important;
  }

  &__label {
    display: flex;
    align-items: center;
    align-content: center;
    font-weight: 300;
    font-size: 12px;
    color: white;
    cursor: pointer;

    &--disabled {
      color: rgba(255, 255, 255, .5);
      cursor: default !important;
    }
  }

  &__selector {
    margin: 0 5px 0 0;
    padding: 0;
  }

  &__buttons {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  &__button {
    border: solid 2px white;
    text-transform: uppercase;
    font-size: 12px;
    font-weight:  bold;
    color: white;
    background-color: #22B6FB;
    width: 100px;
    height: 36px;
    cursor: pointer;

    &:focus {
      outline: none;
    }

    &:disabled {
      border: solid 2px #ddd;
      color: #ddd;
      cursor: not-allowed;
    }
  }

  &__button-label {
    align-self: flex-start;
    padding-right: 7px;
  }

  &__button-icon {
    align-self: flex-end;
    font-size: 10px;
  }

}
</style>
