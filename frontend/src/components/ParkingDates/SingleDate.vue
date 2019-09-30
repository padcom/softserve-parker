<template>
  <div class="single-date">{{ parsedDate }}</div>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component()
export default class SingleDate extends Vue {
  @Prop({ type: Object, required: true }) date

  get parsedDate () {
    const { date } = this
    if (date.from === date.to) return date.from
    return `${date.from} - ${date.to}`
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/variables';

.single-date {
  border-bottom: 1px solid rgb(216, 216, 216);
  padding: 12px 20px;
}
</style>
