<template>
  <div v-if="request !== null" class="request-information"
    :class="{
      'request-information--won': request.status === 'won',
      'request-information--lost': request.status === 'lost',
    }"
  >
    <p class="request-information__text">
      Your parking request for
      <strong>{{ day }} ({{ request.date }})</strong>
      has been {{ status }}.
    </p>

    <Btn v-if="request.status === 'won'" outlined fullWidth color="white"
      class="request-information__cancel"
      @click="cancel"
    >
      Cancel your parking
    </Btn>

    <Modal ref="confirmation" :actions="[
      { result: 'ok', text: 'Yes' },
      { result: 'cancel', text: 'No' }
    ]">
      Do you want to revoke your parking request?
    </Modal>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import { Vue, Component, Prop } from 'vue-property-decorator'

import Btn from '@/components/Btn.vue'
import Modal from '@/components/Modal.vue'
import { TimeState } from '../store/time'

@Component({
  components: {
    Btn,
    Modal,
  },
})
export default class RequestInformation extends Vue {
  @Prop({ type: Object, required: false, default: () => null }) request?: any

  @TimeState today?: string
  @TimeState now?: string
  @TimeState cancelHour?: string

  get day () {
    return this.request.date === this.today ? 'today' : 'tomorrow'
  }

  get status () {
    return this.request.status === 'won' ? 'confirmed' : 'rejected'
  }

  async cancel () {
    // @ts-ignore
    const result = await this.$refs.confirmation.show()

    if (result === 'ok') {
      this.$emit('cancel', this.request)
    }
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.request-information {
  padding: 16px;

  &--won {
    background-color: $color-won;
  }

  &--lost {
    background-color: $color-lost;
  }

  &__text {
    padding: 0 24px;
    text-align: center;
    margin: 0;
    font-family: $font-family-proxima-nova;
    font-weight: $font-weight-thin;

    strong {
      font-weight: $font-weight-extra-bold;
    }
  }

  &__cancel {
    margin-top: 16px;
  }
}
</style>
