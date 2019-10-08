<template>
  <div v-if="show" :class="['calendar', {
    'calendar--bottom': bottom
  }]">
    <MonthNavigator :value="selectedDay" />
    <WeekDays />
    <Month :date="date" @change="daySelected" :selected="selectedDay" />

    <Btn outlined text="add this date" fullWidth />
  </div>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'

import WeekDays from './WeekDays'
import MonthNavigator from './MonthNavigator'
import Month from './Month'
import Btn from '../Btn'

import moment from 'moment'

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

  date = moment()
  selectedDay = moment.range(moment(), moment())

  daySelected(day) {
    const { selectedDay } = this

    if (!selectedDay.start.isSame(selectedDay.end)) {
      this.selectedDay = moment.range(day, day)
    } else if (selectedDay.start.isBefore(day)) {
      this.selectedDay.end = day
    } else {
      this.selectedDay.start = day
    }
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
