<template>
  <table class="week-days">
    <tr class="week-days">
      <td v-for="day in weekdays" :key="day" class="week-days__day">
        <span>{{ day }}</span>
      </td>
    </tr>
  </table>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import moment from 'moment'

@Component({})
export default class WeekDays extends Vue {
  weekdays = this._getWeekdayNames()

  _rotateArrayLeft (a) {
    a.push(a.shift())
  }

  _getWeekdayNames () {
    const names = moment.localeData()._weekdaysMin.slice(0)
    this._rotateArrayLeft(names)
    return names
  }
}
</script>

<style lang="scss">
.week-days {
  border-collapse: collapse;

  &__day {
    text-align: center;
    color: #009FEA;
    line-height: 30px;
    text-align: center;
    cursor: default;
    padding: 0;
    text-transform: uppercase;
  }
}
</style>
