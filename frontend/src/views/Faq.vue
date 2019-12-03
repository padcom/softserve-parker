<template>
  <div class="faq-page">
    <h5 class="faq-page__head">FAQ</h5>
    <h5 class="faq-page__header">1. How does Parker work?</h5>
    <p class="faq-page__paragraph">
      do user actually care how much parking space is available? probably not
      as long as he can park.
    </p>
    <h5 class="faq-page__header">2. Can I enroll for more than one parking date?</h5>
    <p class="faq-page__paragraph">
      Integer ut ultrices nunc. Maecenas quis molestie dolor.
      Phasellus id leo lacinia nunc rutrum sollicitudin ut a justo.
    </p>
    <h5 class="faq-page__header">3. How much parking space is available?</h5>
    <p class="faq-page__paragraph">
      Integer ut ultrices nunc. Maecenas quis molestie dolor.
      Phasellus id leo lacinia nunc rutrum sollicitudin ut a justo.
    </p>
    <h5 class="faq-page__header">3. How much parking space is available?</h5>
    <p class="faq-page__paragraph">
      Integer ut ultrices nunc. Maecenas quis molestie dolor.
      Phasellus id leo lacinia nunc rutrum sollicitudin ut a justo.
    </p>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
  }
})
export default class Faq extends Vue {}
</script>

<style lang="scss">
@import '../styles/variables';

.faq-page {
  font-family: $font-family-proxima-nova;
  padding: 0 15px 15px 20px;

  &__head {
    font-size: 14px;
    font-weight: $font-weight-extra-bold;
    margin-block-start: 16px;
  }

  &__header {
    font-size: 14px;
    margin-top: 0;
    margin-bottom: 0;
  }

  &__paragraph {
    font-size: 14px;
    font-family: $font-family-open-sans;
    line-height: 30px;
  }
}
</style>
