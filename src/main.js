import 'babel-polyfill';
import Vue from "vue";
import SuiVue from 'semantic-ui-vue';
import './libs/ocap';

import 'semantic-ui-css/semantic.min.css';

import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;
Vue.use(SuiVue);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
