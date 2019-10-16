<template>
  <div
    class="calendar"
    :class="{
      'calendar--bottom': bottom
    }"
  >
    <MonthNavigator :value="date" @next="nextMonth" @previous="previousMonth" />
    <WeekDays />
    <Month
      :date="date"
      @change="daySelected"
      :selected="selectedDay !== null ? selectedDay : undefined"
      :disabledDates="disabledDates"
    />

    <Btn
      class="calendar__button"
      icon="/img/plus.png"
      outlined
      text="add this date"
      fullWidth
      @click="saveDate"
    />
  </div>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import moment from 'moment'
import Defocuser from 'defocuser'

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
  @Prop({ type: Boolean, required: false, default: false }) bottom
  @Prop({ type: Array, required: false, default: () => [] }) disabledDates
  @Prop({ type: Boolean, required: false, default: false })
  tomorrowAlreadyRequested

  date = moment().startOf('month')
  selectedDay = null

  mounted () {
    const defocuser = new Defocuser()
    let iteration = 0
    defocuser.addElement(this.$el, 'bubbling', () => {
      if (iteration > 0) this.closeCalendar()
      iteration++
    })

    if (this.tomorrowAlreadyRequested === false) {
      this.selectedDay = moment.range(
        moment().add(1, 'day'),
        moment().add(1, 'day')
      )
    }
  }

  closeCalendar () {
    this.$emit('close')
  }

  saveDate () {
    this.$emit('save', this.selectedDay.start)
  }

  daySelected (day) {
    this.selectedDay = moment.range(day, day)
  }

  nextMonth () {
    this.date = moment(this.date).add(1, 'month')
  }

  previousMonth () {
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
    position: fixed;
    width: calc(100% - 60px);
    bottom: 15px;
    left: 15px;
  }

  &__button {
    margin-top: 40px;
  }
}
</style>
