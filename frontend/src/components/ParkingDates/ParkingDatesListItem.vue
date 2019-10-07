<template>
  <div class="date">{{ formattedDate }}</div>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component()
export default class ParkingDatesListItem extends Vue {
  @Prop({ type: Object, required: true }) date

  get formattedDate () {
    return new Date(this.date.date).toLocaleDateString('pl-pl')
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/variables';

.date {
  border-bottom: 1px solid rgb(216, 216, 216);
  padding: 12px 20px;
  width: 100%;
}
</style>
