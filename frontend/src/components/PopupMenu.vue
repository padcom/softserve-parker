<template>
  <div class="popup-menu">
    <Ranking :userRank="rank" :totalRank="total" />
    <router-link v-for="link in links" :key="link.url" :to="link.url" @click.native.stop="closePopup">
      {{ link.title }}
    </router-link>
  </div>
</template>

<script>
import { Component, Vue, Prop } from 'vue-property-decorator'
import { AuthState } from '@/store/auth'
import Defocuser from 'defocuser'

import { User } from '@/domain/User'
import Ranking from '@/components/Ranking.vue'

@Component({
  components: {
    Ranking,
  },
})
export default class PopupMenu extends Vue {
  @Prop({ type: Array, required: true }) links

  @AuthState user

  rank = this.$store.state.auth.user.rank + 1
  total = -1

  async loadUserRating () {
    const [ user, count ] = await Promise.all([
      User.getByEmail(this.user.email, [ 'rank' ]),
      User.getNumberOfUsers(),
    ])
    this.rank = user.rank + 1
    this.total = count
  }

  mounted () {
    this.loadUserRating()
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
  font-family: $font-family-proxima-nova;
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
  cursor: default;
}
</style>
