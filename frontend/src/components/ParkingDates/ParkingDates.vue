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
      @action="onRemoveStart"
    />

    <Modal
      v-if="isModalVisible"
      :actions="actions"
      @close="closeModal"
      @remove="removeItem"
      >
      Do you want to revoke your parking request?
    </Modal>
  </div>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import { get } from 'lodash'
import {
  ReservationRequestsAction
} from '@/store/reservationRequests'
import Modal from '@/components/Modal.vue'
import ParkingDatesListItem from './ParkingDatesListItem'

@Component({
  components: {
    ParkingDatesListItem,
    Modal
  }
})
export default class ParkingDates extends Vue {
  @Prop({ type: Array, default: () => [] }) requests
  @ReservationRequestsAction cancelRequest

  activeElement = null
  isModalVisible = false
  actions = [
    {
      outlined: false,
      fullWidth: true,
      emitType: 'close',
      text: 'No'
    },
    {
      outlined: true,
      fullWidth: true,
      emitType: 'remove',
      text: 'Yes'
    }
  ]

  onRemoveStart(element) {
    this.activeElement = element
    this.isModalVisible = true
  }

  removeItem() {
    const id = get(this, 'activeElement.request.id')
    if (id) this.cancelRequest(id)
    this.isModalVisible = false
    this.activeElement = null
  }

  closeModal() {
    if (get(this, 'activeElement.leftPosition')) this.activeElement.leftPosition = 0
    this.isModalVisible = false
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
