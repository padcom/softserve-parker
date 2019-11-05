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
  margin: 15px;
  font-size: 18px;
  font-family: $font-family-proxima-nova;

  &__head {
    font-weight: $font-weight-extra-bold;
  }

  &__header {
    margin-top: 0;
    margin-bottom: 0;
  }

  &__paragraph {
    font-family: $font-family-open-sans;
    line-height: 30px;
  }
}
</style>
