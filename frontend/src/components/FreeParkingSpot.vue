<template>
  <div class="free-parking-spot">
    <p class="free-parking-spot__text">
      There's <strong>free parking spot</strong> for <strong>tomorrow!</strong>
    </p>
    <Btn outlined @click="handleButtonClick" fullWidth text="I'm taking it!" />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import Btn from './Btn'

@Component({
  components: {
    Btn
  }
})
export default class FreeParkingSpot extends Vue {
  handleButtonClick () {
    this.$emit('take')
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.free-parking-spot {
  text-align: center;
  padding: 20px 0 0;

  &__text {
    text-align: center;
    max-width: 60%;
    margin: 0 auto 16px;

    strong {
      font-weight: $open-sans-bold;
    }
  }
}
</style>
