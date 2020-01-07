<template>
  <div class="modal">
    <div class="modal__wrapper">
      <p class="modal__text"><slot /></p>

      <div class="modal__actions">
        <Btn
          v-for="(action, index) in actions"
          :key="index"
          v-bind="action"
          @click="$emit(action.emitType)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Prop, Component, Vue } from 'vue-property-decorator'
import Btn from './Btn'

@Component({
  components: {
    Btn,
  },
})
export default class Modal extends Vue {
  @Prop({ type: Array, required: true }) actions
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

    button {
      margin: 0 10px 0 0;

      &:nth-last-of-type(1) {
        margin-right: 0;
      }
    }
  }
}
</style>
