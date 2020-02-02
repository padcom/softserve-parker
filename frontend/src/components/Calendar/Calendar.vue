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
      @change="selectDay"
      :selected="selected"
      :disabledDates="disabledDates"
      :maxDate="maxDate"
    />
    <Btn
      class="calendar__button"
      icon="/img/plus.png"
      outlined
      fullWidth
      transparent
      @click="saveDate"
      :disabled="selected === null"
    >
      add this date
    </Btn>
  </div>
</template>

<script>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import moment from 'moment'
import Defocuser from 'defocuser'

import WeekDays from './WeekDays'
import MonthNavigator from './MonthNavigator'
import Month from './Month'
import Btn from '../Btn'

window.moment = moment

@Component({
  components: {
    WeekDays,
    Month,
    Btn,
    MonthNavigator,
  },
})
export default class Calendar extends Vue {
  @Prop({ type: Object, required: false }) value // moment.range
  @Prop({ type: Boolean, required: false, default: false }) bottom
  @Prop({ type: Array, required: false, default: () => [] }) disabledDates
  @Prop({ type: String, required: false, default: '9999-12-31' }) maxDate

  date = moment().startOf('month')
  selected = null
  mode = 'start' // 'start' | 'end'
  htmlBody = document.querySelector('body')

  @Watch('value')
  onValueChanged (newValue) {
    logger.debug('Calendar.onValueChange(', newValue, ')')
    this.selected = this.value ? this.value.clone() : null
  }

  mounted () {
    this.selected = this.value ? this.value.clone() : null
    const defocuser = new Defocuser()
    let iteration = 0
    defocuser.addElement(this.$el, 'bubbling', () => {
      if (iteration > 0) this.closeCalendar()
      iteration++
    })
    this.htmlBody.classList.add('no-scroll')
  }

  beforeDestroy () {
    this.htmlBody.classList.remove('no-scroll')
  }

  closeCalendar () {
    this.$emit('close')
  }

  saveDate () {
    this.$emit('input', moment.range(this.selected.start, this.selected.end))
    this.$emit('close')
  }

  selectDay (day) {
    if (this.mode === 'start' || day.isBefore(this.selected.start)) {
      this.selected = moment.range(day, day)
      this.mode = 'end'
    } else {
      this.selected = moment.range(this.selected.start, day)
      this.mode = 'start'
    }
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
