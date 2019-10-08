<template>
  <div class="month-navigator">
    <a type="button" @click="prevViewMonth" :class="{
      btn: true,
      'month-navigator__navigator': true,
      'month-navigator__navigator--left': true,
      'month-navigator__navigator--enabled': canNavigatePrevMonth,
    }">
      <span class="figure figure--v" />
    </a>
    <MonthName class="month-navigator__name month-navigator__name--left" :value="value.start" />
    <MonthName class="month-navigator__name month-navigator__name--right" :value="value.end" />
    <a type="button" @click="nextViewMonth" :class="{
      btn: true,
      'month-navigator__navigator': true,
      'month-navigator__navigator--right': true,
      'month-navigator__navigator--enabled': canNavigateNextMonth,
    }">
      <span class="figure figure--v" />
    </a>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import moment from 'moment'

import MonthName from './MonthName.vue'

@Component({
  props: {
    value: {
      type: Object,
      required: true,
    },
    valid: {
      type: Object, // moment.range
      required: false,
      default: () => moment.range(null, null),
    },
  },
  components: {
    MonthName,
  },
})
export default class MonthNavigator extends Vue {
  get monthViewStart () {
    return this.value.start.format('MMMM YYYY')
  }
  get monthViewEnd () {
    return this.value.end.format('MMMM YYYY')
  }

  get canNavigatePrevMonth () {
    return moment(this.value.start).subtract(1, 'day').isAfter(this.valid.start)
  }

  get canNavigateNextMonth () {
    return moment(this.value.end).add(1, 'day').isBefore(this.valid.end)
  }

  prevViewMonth () {
    this.$emit('previous')
  }
  nextViewMonth () {
    this.$emit('next')
  }
}
</script>

<style lang="scss">
@import '../consts';
@import './consts';

.month-navigator {
  display: flex;
  align-content: center;

  font-size: 14px;
  font-weight: 400;
  text-transform: uppercase;
  text-size-adjust: 100%;

  -webkit-tap-highlight-color: transparent;

  &__name {
    flex: 1 1 50%;

    &--left {
      margin-left: -$navigator-width;
      padding-right: $margin*$middle-section-scale;
    }

    &--right {
      margin-right: -$navigator-width;
      padding-left: $margin*$middle-section-scale;
    }
  }

  &__navigator {
    color: #A9A9A9;
    padding: 4px 2px;
    text-transform: uppercase;
    z-index: $dialog-z-index + 1;
    cursor: pointer;
    font-size: 12px;

    &:hover, &:visited {
      color: #A9A9A9;
    }

    &--left {
      margin: -5px -7px 0 14px;
      transform: rotate(90deg);
    }

    &--right {
      margin: -3px 16px 0 -6px;
      transform: rotate(-90deg);
    }

    &--enabled {
      color: #009FEA;
    }

    &--enabled:hover, &--enabled:visited {
      color: #009FEA;
    }
  }
}
</style>
