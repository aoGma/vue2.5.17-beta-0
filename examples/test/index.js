import Vue from 'vue'
import App from './app.vue'
var vm = new Vue({
  components: { App },
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  render (h) {
    return h(App)
  }
})
console.log(vm)
