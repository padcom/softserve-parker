<template>
  <div class="month-name">{{ month }}</div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import moment from 'moment'

@Component({
  props: {
    value: {
      type: Object,
      required: false,
      default: () => moment()
    }
  }
})
export default class MonthName extends Vue {
  get month() {
    return this.value.format('MMMM YYYY')
  }
}
</script>

<style lang="scss">
@import '../../styles/variables';

.month-name {
  color: $black;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
}
</style>
