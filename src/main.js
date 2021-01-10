import Vue from "vue";
import App from "./App.vue";
import dialog from "./dialogPlugin";
import fs from "./fsPlugin";

Vue.config.productionTip = false;
Vue.prototype.$dialog = dialog;
Vue.prototype.$fs = fs;
new Vue({
  render: (h) => h(App),
}).$mount("#app");
