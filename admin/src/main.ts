import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './axios'

Vue.config.productionTip = false

store.dispatch('time/update').then(() => {
  setInterval(() => store.dispatch('time/update'), 10000)

  new Vue({
    router,
    store,
    vuetify,
    render: (h: any) => h(App),
  }).$mount('#app')
})
