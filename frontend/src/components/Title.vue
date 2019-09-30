<template>
  <h1 :class="[
    'title',
    {
      'title--border-bottom': borderBottom
    }
  ]">{{ text }}</h1>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component()
export default class Title extends Vue {
  @Prop({ type: String, default: '' }) text
  @Prop({ type: Boolean, default: false }) borderBottom
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.title {
  color: $black;
  font-family: $proxima-nova;
  font-weight: $proxima-nova-extra-bold;
  font-size: 14px;
  text-transform: uppercase;
  padding: 15px;
  margin: 0;

  &--border-bottom {
    border-bottom: 1px solid $gray;
  }
}
</style>
