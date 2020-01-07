<template>
  <div class="month">
    <table @mouseleave="$emit('clearHover')">
      <tr class="month__week" v-for="week in weeks" :key="week[0].format()">
        <td
          v-for="day in week"
          :key="day.format()"
          :data-day="day.format('YYYY-MM-DD')"
          tabindex="-1"
          @click="daySelected(day)"
          @mouseenter="dayHovered(day)"
          :class="{
            month__day: true,
            'month__day--disabled':
              day.isBefore(today) || isWeekend(day) || isInDisabledDates(day),
            'month__day--highlighted':
              day.within(highlighted) && day.isSame(date, 'month'),
            'month__day--selected':
              day.isSame(selected.start, 'day') ||
              day.isSame(selected.end, 'day'),
            'month__day--selected-start':
              day.isSame(selected.start, 'day') && day.isSame(date, 'month'),
            'month__day--selected-end':
              day.isSame(selected.end, 'day') && day.isSame(date, 'month'),
            'month__day--in-range':
              day.within(selected) && day.isSame(date, 'month')
          }"
        >
          <span>{{ day.format('D') }}</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import moment from 'moment'

import WeekDays from './WeekDays.vue'
import logger from '@/logger'

@Component({
  components: {
    WeekDays,
  },
})
export default class Month extends Vue {
  @Prop({ type: Object, required: true })
  date

  @Prop({
    type: Object,
    required: false,
    default: () => moment.range('0001-01-01', '9999-12-31'),
  })
  valid

  @Prop({
    type: Object,
    required: false,
    default: () => moment.range('0001-01-01', '0001-01-01'),
  })
  selected

  @Prop({
    type: Object,
    required: false,
    default: () => moment.range('0001-01-01', '0001-01-01'),
  })
  highlighted

  @Prop({
    type: Array,
    required: false,
    default: () => [],
  })
  disabledDates

  get today () {
    return moment()
  }

  get weeks () {
    const result = []
    const dayOfMonth = moment(this.date)
      .startOf('month')
      .startOf('week')

    while (this.isWeekWithinMonth(dayOfMonth, this.date)) {
      const week = []
      for (
        let dayOfWeek = moment(dayOfMonth);
        dayOfWeek.isSame(dayOfMonth, 'week');
        dayOfWeek.add(1, 'day')
      ) {
        week.push(moment(dayOfWeek))
      }
      result.push(week)
      dayOfMonth.add(1, 'week')
    }

    return result
  }

  isWeekWithinMonth (day, date) {
    return (
      this.isSameMonth(moment(day).endOf('week'), date) ||
      this.isSameMonth(moment(day).startOf('week'), date)
    )
  }

  isInDisabledDates (day) {
    return this.disabledDates.some(disabledDate => {
      return day.isSame(disabledDate, 'day')
    })
  }

  isSameMonth (day, date) {
    return moment(day).isSame(date, 'month')
  }

  isWeekend (date) {
    return date.day() === 6 || date.day() === 0
  }

  daySelected (day) {
    logger.debug('Month.daySelected', day.format('YYYY-MM-DD'))
    if (
      day.isAfter(this.today) &&
      day.within(this.valid) &&
      !this.isWeekend(day) &&
      !this.isInDisabledDates(day)
    ) {
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
@import '../../styles/variables';

.month {
  display: flex;
  flex: 1 0 auto;
  user-select: none;
  font-size: 20px;
  font-weight: $font-weight-normal;
  text-transform: uppercase;

  & table {
    border-collapse: collapse;
    width: 100%;
  }

  &__day {
    width: 14.7%;
    color: $color-black;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    padding: 0;
    outline: 0;
    padding: 8px;

    &--disabled {
      color: #e0e0e0;
      font-weight: 300;
      cursor: not-allowed;
    }

    &--in-range {
      background-color: #e5e5e5;
    }

    &--highlighted {
      background-color: #eee;
    }

    &--selected {
      color: white;
      background-color: $color-black;
    }

    &--selected-start {
      opacity: 1;
    }

    &--selected-end {
      opacity: 1;
    }
  }
}
</style>
