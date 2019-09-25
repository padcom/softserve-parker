<template>
  <button
    :type="type"
    @click="$emit('click')"
    v-bind:class="[
      'btn',
      `btn--${color}`,
      {
        'btn--full-width': fullWidth
      },
    ]"
  >{{ text }}</button>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import { AuthAction } from '@/store/auth'

@Component()
export default class Button extends Vue {
  @Prop(String) text;
  @Prop({ type: String, default: 'button' }) type;
  @Prop({ type: String, default: 'black' }) color;
  @Prop({ type: Boolean, default: false }) fullWidth;
}
</script>

<style lang="scss" scoped>
@import "../styles/variables";

.btn {
  padding: 14px;
  font-family: $proxima-nova;
  font-weight: $proxima-nova-extra-bold;
  font-size: 16px;
  line-height: 20px;
  text-transform: uppercase;
  border: none;

  &:focus {
    outline: none;
  }

  &--black {
    color: $white-text;
    background-color: $black;
  }

  &--full-width {
    display: block;
    width: 100%;
  }
}
</style>
