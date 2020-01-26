<template>
  <div class="calendar" :class="{
      'calendar--bottom': bottom
    }">
    <MonthNavigator
      :value="date"
      @close="closeCalendar"
      @next="nextMonth"
      @previous="previousMonth"
    />
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
      fullWidth
      @click="saveDate"
      :disabled="selectedDay === null"
    >
      add this date
    </Btn>
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
    MonthNavigator,
  },
})
export default class Calendar extends Vue {
  @Prop({ type: Boolean, required: false, default: false }) bottom
  @Prop({ type: Array, required: false, default: () => [] }) disabledDates
  @Prop({ type: Boolean, required: false, default: false })
  tomorrowWeekendOrAlreadyRequested

  date = moment().startOf('month')
  selectedDay = null

  mounted () {
    const defocuser = new Defocuser()
    let iteration = 0
    defocuser.addElement(this.$el, 'bubbling', () => {
      if (iteration > 0) this.closeCalendar()
      iteration++
    })

    if (!this.tomorrowWeekendOrAlreadyRequested) {
      this.selectedDay = moment.range(
        moment().add(1, 'day'),
        moment().add(1, 'day'),
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
@import '../../styles/variables';

.calendar {
  background-color: white;
  box-shadow: 0 8px 16px rgba(65, 64, 69, 0.3);
  padding: 16px;
  z-index: 3;

  @media (max-height: $sm-viewport) {
    max-height: 70vh;
    overflow: auto;
  }

  &--bottom {
    position: fixed;
    width: calc(100% - 60px);
    bottom: 15px;
    margin: 0 auto;
    left: 0;
    right: 0;
    max-width: $sm-viewport;
  }

  &__button {
    margin-top: 40px;
  }
}
</style>
