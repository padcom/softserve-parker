<template>
  <v-menu ref="dropdown" v-model="dropdown">
    <template #activator="{ on }">
      <v-text-field readonly :value="value" :label="label" v-on="on" />
    </template>
    <v-time-picker v-if="dropdown" :value="value" @input="update" />
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class TimePicker extends Vue {
  @Prop({ type: String, required: true }) value?: string
  @Prop({ type: String, default: 'Label' }) label?: string

  dropdown = false

  update (newValue: string) {
    this.$emit('input', newValue)
  }
}
</script>
