<template>
  <div v-if="request !== null" class="request-information"
    :class="{
      'request-information--won': request.status === 'won',
      'request-information--lost': request.status === 'lost',
    }"
  >
    This is request information
    {{ request | json }}

    <Modal ref="confirmation" :actions="[
      { result: 'ok', text: 'Yes' },
      { result: 'cancel', text: 'No' }
    ]">
      Do you want to revoke your parking request?
    </Modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import Modal from '@/components/Modal.vue'

@Component({
  components: {
    Modal,
  },
})
export default class RequestInformation extends Vue {
  @Prop({ type: Object, required: false, default: () => ({}) }) request?: any
}
</script>

<style lang="scss">
@import '../styles/variables';

.request-information {
  &--won {
    background-color: $color-won;
  }

  &--lost {
    background-color: $color-lost;
  }
}
</style>
