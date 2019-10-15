<template>
  <div v-if="show" :class="['calendar', {
    'calendar--bottom': bottom
  }]">
    <MonthNavigator :value="date" @next="nextMonth" @previous="previousMonth" />
    <WeekDays />
    <Month :date="date" @change="daySelected" :selected="selectedDay" />

    <Btn outlined text="add this date" fullWidth @click="saveDate" />
  </div>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import moment from 'moment'

import WeekDays from './WeekDays'
import MonthNavigator from './MonthNavigator'
import Month from './Month'
import Btn from '../Btn'

@Component({
  components: {
    WeekDays,
    Month,
    Btn,
    MonthNavigator
  }
})
export default class Calendar extends Vue {
  @Prop({ type: Boolean, required: true }) show
  @Prop({ type: Boolean, required: false, default: false }) bottom

  date = moment().startOf('month')
  selectedDay = moment.range(moment().add(1, 'day'), moment().add(1, 'day'))

  saveDate() {
    this.$emit('save', this.selectedDay.start)
  }

  daySelected(day) {
    this.selectedDay = moment.range(day, day)
  }

  nextMonth() {
    this.date = moment(this.date).add(1, 'month')
  }

  previousMonth() {
    this.date = moment(this.date).subtract(1, 'month')
  }
}
</script>

<style lang="scss" scoped>
.calendar {
  background-color: white;
  box-shadow: 0 8px 16px rgba(65, 64, 69, 0.3);
  padding: 16px;

  &--bottom {
    position: absolute;
    width: calc(100% - 30px);
    bottom: 15px;
    left: 15px;
  }
}
</style>
