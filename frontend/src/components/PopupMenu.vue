<template>
  <div class="popup-menu">
    <Ranking :userRank="user.rank" :totalRank="5381" />
    <router-link v-for="link in links" :key="link.url" :to="link.url" @click.native.stop="closePopup">
      {{ link.title }}
    </router-link>
  </div>
</template>

<script>
import { Component, Vue, Prop } from 'vue-property-decorator'
import { AuthState } from '@/store/auth'
import Defocuser from 'defocuser'

import Ranking from '@/components/Ranking.vue'

@Component({
  components: {
    Ranking
  }
})
export default class PopupMenu extends Vue {
  @AuthState user

  @Prop({ type: Array, required: true }) links

  mounted () {
    const defocuser = new Defocuser()
    let iteration = 0
    defocuser.addElement(this.$el, 'bubbling', () => {
      if (iteration > 0) this.closePopup()
      iteration++
    })
  }

  closePopup () {
    this.$emit('close')
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.popup-menu {
  font-family: $proxima-nova;
  font-size: 12pt;
  box-shadow: 0 -8pt 20pt 0 rgba(0,0,0,0.1);
  height: auto;
  min-width: 120px;
  margin-right: 15px;
  margin-top: 5px;
  background-color: #fff;
  position: absolute;
  z-index: 1;
  right: 0;
  line-height: 20pt;
  padding: 12px 15px;
}
</style>
