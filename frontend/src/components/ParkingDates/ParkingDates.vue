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
      @action="remove(request)"
    />

    <Modal ref="confirmation" :actions="[ { result: 'ok', text: 'Yes' }, { result: 'cancel', text: 'No' }]">
      Do you want to revoke your parking request?
    </Modal>

    <Modal ref="information" :actions="[ { result: 'ok', text: 'OK' } ]">
      Do you want to revoke your parking request?
    </Modal>
  </div>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'

import Modal from '@/components/Modal.vue'
import ParkingDatesListItem from './ParkingDatesListItem'

@Component({
  components: {
    ParkingDatesListItem,
    Modal,
  },
})
export default class ParkingDates extends Vue {
  @Prop({ type: Array, default: () => [] }) requests

  async remove (request) {
    const action = await this.$refs.confirmation.show()
    if (action === 'ok') {
      this.$emit('revoke', request)
    }
  }
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
      color: $color-light-gray;
      text-align: center;
    }
  }
}
</style>
