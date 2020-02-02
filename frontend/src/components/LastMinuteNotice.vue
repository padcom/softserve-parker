<template>
  <div v-if="request !== null" class="last-minute-notice">
    <p class="last-minute-notice__text">
      There's a <strong>free parking spot</strong> for <strong>tomorrow</strong>
    </p>

    <Btn outlined fullWidth color="white"
      class="last-minute-notice__takeit"
      @click="takeit"
    >
      I'm taking it!
    </Btn>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import Btn from '@/components/Btn.vue'

@Component({
  components: {
    Btn,
  },
})
export default class LastMinuteNotice extends Vue {
  @Prop({ type: Object, required: false, default: () => null }) request?: any

  takeit () {
    this.$emit('takeit', this.request)
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.last-minute-notice {
  padding: 16px;

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

  &__takeit {
    margin-top: 16px;
  }
}
</style>
