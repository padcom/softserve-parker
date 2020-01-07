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
      :touchedDevice="touchedDevice"
      @action="onRemoveStart"
    />

    <Modal
      v-if="showModalConfirm"
      :actions="confirmActions"
      @close="closeConfirmModal"
      @remove="removeItem"
      >
      Do you want to revoke your parking request?
    </Modal>

    <Modal
      :actions="infoActions"
      @revoke="closeInfoModal"
      v-if="showModalInfo"
      >
      {{infoMessage}}
    </Modal>
  </div>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import isTouchDevice from 'is-touch-device'
import { ReservationRequestsAction } from '@/store/reservationRequests'
import { APP_MESSAGES } from '@/app-statuses'
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
  @ReservationRequestsAction cancelRequest

  touchedDevice = false
  activeElement = null
  showModalConfirm = false
  confirmActions = [
    {
      outlined: false,
      fullWidth: true,
      emitType: 'close',
      text: 'No',
    },
    {
      outlined: true,
      fullWidth: true,
      emitType: 'remove',
      text: 'Yes',
    },
  ]

  showModalInfo = false
  infoMessage = ''
  infoActions = [
    {
      outlined: true,
      fullWidth: true,
      emitType: 'revoke',
      text: 'Ok',
    },
  ]

  mounted () {
    this.touchedDevice = isTouchDevice()
  }

  onRemoveStart (element) {
    this.activeElement = element
    this.showModalConfirm = true
  }

  async removeItem () {
    const id = this?.activeElement?.request?.id

    try {
      if (id) await this.cancelRequest(id)
      this.activeElement = null
      this.infoMessage = APP_MESSAGES.REVOKE_SUUCCESS
    } catch (e) {
      this.infoMessage = APP_MESSAGES.ERROR
    } finally {
      this.showModalConfirm = false
      this.showModalInfo = true
    }
  }

  closeConfirmModal () {
    if (this?.activeElement?.leftPosition) {
      this.activeElement.leftPosition = 0
    }
    this.showModalConfirm = false
  }

  closeInfoModal () {
    this.showModalInfo = false
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
