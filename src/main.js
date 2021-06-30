import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import '../css/mystyles.css';
//import '../s.css';
import '../css/fa/css/font-awesome.min.css';
import '../node_modules/@mdi/font/css/materialdesignicons.css'
import VueAnimXyz from '@animxyz/vue3'
import '@animxyz/core'
import '../node_modules/animate.css/animate.min.css'
createApp(App).use(store).use(router).use('Vue3TouchEvents').use(VueAnimXyz).mount('#app')