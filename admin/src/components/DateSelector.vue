<template>
    <v-menu
      v-model="calendar"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="date"
          :label="label"
          readonly
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="date"
        :dark="true"
        :allowed-dates="getAllowedDates"
        first-day-of-week="1"
        @input="$emit('input', date)"
      />
    </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

import isWeekendDay from 'common/date/isWeekendDay'

@Component({})
export default class DateRangeSelector extends Vue {
  @Prop({ type: String, required: true }) value?: string
  @Prop({ type: String, required: false, default: 'Label' }) label?: string

  calendar = false
  date = this.value

  @Watch('value')
  onValueChanged (newValue: string) {
    this.date = newValue
  }

  getAllowedDates (date: string) {
    return !isWeekendDay(date)
  }
}
</script>
