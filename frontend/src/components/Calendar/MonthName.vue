<template>
  <div class="month-name">{{ month }}</div>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import moment from 'moment'

@Component()
export default class MonthName extends Vue {
  @Prop({ type: Object, required: false, default: () => moment() }) value

  get month () {
    return this.value.format('MMMM YYYY')
  }
}
</script>

<style lang="scss">
@import '../../styles/variables';

.month-name {
  color: $black;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
}
</style>
