<template>
  <div class="month" >
    <table @mouseleave="$emit('clearHover')">
      <tr class="month__week" v-for="week in weeks" :key="week[0].format()">
        <td v-for="day in week" :key="day.format()" :data-day="day.format('YYYY-MM-DD')" 
            tabindex="-1" 
            @click="daySelected(day)"
            @mouseenter="dayHovered(day)"
            :class="{ 
              'month__day': true,
              'month__day--othermonth': !day.isSame(date, 'month'),
              'month__day--disabled': !day.within(valid),
              'month__day--highlighted': day.within(highlighted) && day.isSame(date, 'month'),
              'month__day--selected': (day.isSame(selected.start, 'day') || day.isSame(selected.end, 'day')) && day.isSame(date, 'month'),
              'month__day--selected-start': day.isSame(selected.start, 'day') && day.isSame(date, 'month'),
              'month__day--selected-end': day.isSame(selected.end, 'day') && day.isSame(date, 'month'),
              'month__day--in-range': day.within(selected) && day.isSame(date, 'month'),
              }">
            <span v-if="day.isSame(date, 'month')">{{ day.format('D') }}</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

import moment from 'moment'

import WeekDays from './WeekDays.vue'

@Component({
  props: {
    date: {
      type: Object,
      required: true,
    },
    valid: {
      type: Object,
      required: false,
      default: () => moment.range('0001-01-01', '9999-12-31'),
    },
    selected: {
      type: Object,
      required: false,
      default: () => moment.range('0001-01-01', '0001-01-01'),
    },
    highlighted: {
      type: Object,
      required: false,
      default: () => moment.range('0001-01-01', '0001-01-01'),
    },
  },
  components: {
    WeekDays,
  },
})
export default class Month extends Vue {
  get weeks () {
    const result = []
    const dayOfMonth = moment(this.date).startOf('month').startOf('week')
    while (this.isWeekWithinMonth(dayOfMonth, this.date)) {
      const week = []
      for (let dayOfWeek = moment(dayOfMonth); dayOfWeek.isSame(dayOfMonth, 'week'); dayOfWeek.add(1, 'day')) {
        week.push(moment(dayOfWeek))
      }
      result.push(week)
      dayOfMonth.add(1, 'week')
    }
    return result
  }

  isWeekWithinMonth (day, date) {
    return this.isSameMonth(moment(day).endOf('week'), date) || this.isSameMonth(moment(day).startOf('week'), date)
  }

  isSameMonth (day, date) {
    return moment(day).isSame(date, 'month')
  }

  daySelected (day) {
    log.debug('Month.daySelected', day.format('YYYY-MM-DD'))
    if (day.within(this.valid) && this.isSameMonth(day, this.weeks[2][0])) {
      this.$emit('change', day)
    }
  }

  dayHovered (day) {
    if (day.within(this.valid) && this.isSameMonth(day, this.weeks[2][0])) {
      this.$emit('hover', day)
    } else {
      this.$emit('clearHover')
    }
  }
}
</script>

<style lang="scss">
.month {
  display: flex;
  flex: 1 0 auto;
  user-select: none;

  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;

  & table {
    border-collapse: collapse;
  }

  &__day {
    color: #005CA9;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    padding: 0;
    outline: 0;

    &--othermonth {
      color: #787878;
      cursor: default;
    }

    &--disabled {
      color: #787878;
      font-weight: 300;
      cursor: not-allowed;
    }

    &--in-range {
      color: #337ab7;
      background-color: #eee;
    }

    &--highlighted {
      // background-color: #A0D5FE;
      background-color: #eee;
    }

    &--selected {
      font-weight: bold;
      color: white;
      background-color: #009fea;
    }

    &--selected-start {
      opacity: 1;
    }

    &--selected-end {
      opacity: 1;
    }

    &:hover:not(&--disabled):not(&--selected):not(&--othermonth) {
      background-color: #A0D5FE;
    }
  }
}
</style>
