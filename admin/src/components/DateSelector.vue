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
        @input="$emit('input', selectedValueAsDate)"
      />
    </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import format from 'date-fns/format'
import parse from 'date-fns/parse'

@Component({})
export default class DateRangeSelector extends Vue {
  @Prop({ type: Date, required: true }) value?: Date
  @Prop({ type: String, required: false, default: 'Label' }) label?: string

  calendar = false
  date = format(this.value || new Date(), 'YYYY-MM-DD')

  @Watch('value')
  onValueChanged (newValue: Date) {
    this.date = format(newValue, 'YYYY-MM-DD')
  }

  getAllowedDates (val: string) {
    return ![0, 7].includes(new Date(val).getDay())
  }

  get selectedValueAsDate () {
    return parse(this.date)
  }
}
</script>
