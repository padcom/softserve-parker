<template>
  <div
    class="parking-dates"
    :class="{ 'parking-dates--empty': requests.length === 0 }"
  >
    <div v-if="requests.length === 0" class="parking-dates__empty-box">
      <p class="parking-dates__empty-box__text">
        Parking dates picked by you, will appear here.
      </p>
    </div>

    <ParkingDatesListItem
      v-for="request in requests"
      :key="request.id"
      :request="request"
    />
  </div>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import ParkingDatesListItem from './ParkingDatesListItem'

@Component({
  components: {
    ParkingDatesListItem
  }
})
export default class ParkingDates extends Vue {
  @Prop({ type: Array, default: () => [] }) requests
}
</script>

<style lang="scss" scoped>
@import '../../styles/variables';

.parking-dates {
  display: flex;
  height: 100%;
  flex-direction: column;
  width: 100%;
  overflow: hidden;

  &--empty {
    justify-content: center;
  }

  &__empty-box {
    margin: 0 auto;
    max-width: 70%;

    &__text {
      font-size: 16px;
      line-height: 24px;
      color: $light-gray;
      text-align: center;
    }
  }
}
</style>
