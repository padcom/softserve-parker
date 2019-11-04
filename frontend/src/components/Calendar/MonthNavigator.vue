<template>
  <div class="month-navigator">
    <a
      type="button"
      @click="prevViewMonth"
      :class="{
        btn: true,
        'month-navigator__navigator': true,
        'month-navigator__navigator--left': true,
        'month-navigator__navigator--enabled': canNavigatePrevMonth
      }"
    >
      <img :src="icons.left" />
    </a>
    <MonthName class="month-navigator__name" :value="value" />
    <a
      type="button"
      @click="nextViewMonth"
      :class="{
        btn: true,
        'month-navigator__navigator': true,
        'month-navigator__navigator--right': true,
        'month-navigator__navigator--enabled': canNavigateNextMonth
      }"
    >
      <img :src="icons.right" />
    </a>
    <a
      type="button"
      class="month-navigator__close"
      @click="$emit('close')"
    >
      <img src="/img/close-black.png" alt="Close" />
    </a>
  </div>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import moment from 'moment'

import MonthName from './MonthName.vue'

@Component({
  components: {
    MonthName
  }
})
export default class MonthNavigator extends Vue {
  @Prop({ type: Object, required: true }) value
  @Prop({
    type: Object,
    required: false,
    default: () => moment.range(null, null)
  })
  valid

  icons = {
    left: '/img/chevron-left.png',
    right: '/img/chevron-right.png'
  }

  get canNavigatePrevMonth () {
    return moment(this.value)
      .subtract(1, 'day')
      .isAfter(this.valid.start)
  }

  get canNavigateNextMonth () {
    return moment(this.value)
      .add(1, 'day')
      .isBefore(this.valid.end)
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
.month-navigator {
  display: flex;
  align-content: center;
  font-size: 14px;
  font-weight: 400;
  text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;

  &__name {
    padding-top: 3px;
    flex: 1 1 50%;
  }

  &__navigator {
    color: #a9a9a9;
    padding: 4px 2px;
    cursor: pointer;
    font-size: 12px;

    &:hover,
    &:visited {
      color: #a9a9a9;
    }

    &--left {
      margin: -5px -7px 0 14px;
    }

    &--right {
      margin: -3px 16px 0 -6px;
    }

    &--enabled {
      color: #009fea;
    }

    &--enabled:hover,
    &--enabled:visited {
      color: #009fea;
    }
  }
}

.figure {
  &:before {
    content: '\F122';
  }
}
</style>
