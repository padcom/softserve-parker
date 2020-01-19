<template>
  <div class="password-field">
    <input
      :name="name"
      :type="type"
      :class="[
        'password-field__input',
        {
          'password-field--full-width': fullWidth,
          'password-field__input--empty': isEmpty,
          'password-field__input--invalid': isEmpty
        }
      ]"
      :placeholder="placeholder"
      :value="input"
      @input="$emit('input', $event.target.value)"
    />
    <img src="/img/password-lookup.png" @click="togglePasswordVisibility" class="password-field__icon" />
  </div>
</template>

<script>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component()
export default class PasswordField extends Vue {
  @Prop({ type: String, required: true }) value
  @Prop({ type: String, required: false, default: '' }) placeholder
  @Prop({ type: String, required: false, default: '' }) name
  @Prop({ type: Boolean, required: false, default: false }) fullWidth
  @Prop({ type: Boolean, required: false, default: false }) isValid

  input = ''
  type = 'password'

  @Watch('value')
  onValueChanged (newValue) {
    this.input = newValue
  }

  togglePasswordVisibility () {
    if (this.type === 'password') {
      this.type = 'text'
    } else {
      this.type = 'password'
    }
  }

  get isEmpty () {
    return this.input.length === 0
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.password-field {
  margin-bottom: 20px;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;

  &__input {
    padding: 16px;
    width: 100%;
    box-sizing: border-box;
    font-size: 16px;
    line-height: 24px;
    color: $color-black;
    border: 2px solid $color-black;
    font-family: $font-family-open-sans;

    &:focus {
      outline: none;
    }

    &--empty {
      border-color: gray;
    }

    &--invalid {
      border-color: red;
    }
  }

  &__icon {
    position: absolute;
    right: 1.3rem;
  }
}
</style>
