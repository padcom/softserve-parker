<template>
  <div class="modal" v-if="visible">
    <div class="modal__wrapper">
      <p class="modal__text">
        <slot />
      </p>
      <div class="modal__actions">
        <Btn
          v-for="(action, index) in actions"
          :key="index"
          v-bind="action"
          @click="close(action.result)"
        >{{ action.text }}</Btn>
      </div>
    </div>
  </div>
</template>

<script>
import { Prop, Component, Vue, Watch } from 'vue-property-decorator'
import Btn from './Btn'

@Component({
  components: {
    Btn,
  },
})
export default class Modal extends Vue {
  @Prop({ type: Array, required: true }) actions

  visible = false
  resolve = null

  close (result) {
    this.visible = false
    if (this.resolve) {
      this.resolve(result)
    }
  }

  async show () {
    this.visible = true
    return new Promise(resolve => {
      this.resolve = resolve
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.modal {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;

  &__text {
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    margin: 0 0 20px;
  }

  &__wrapper {
    padding: 16px;
    width: calc(100% - 62px);
    max-width: ($sm-viewport - 62px);
    background-color: $color-white;
    box-shadow: 0 8px 16px rgba(65, 64, 69, 0.3);
  }

  &__actions {
    display: flex;
    justify-content: center;

    button {
      margin: 0 10px 0 0;
      padding: 10px 30px;

      &:nth-last-of-type(1) {
        margin-right: 0;
      }
    }
  }
}
</style>
