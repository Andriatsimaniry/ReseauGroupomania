import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from './plugins/font-awesome'
import { VueLikeDislikeButtons } from "vue-like-dislike-buttons"

// Vue.config.productionTip = false;
 
// new Vue({
//   render: h => h(App)
// }).$mount("#app");

createApp(App)
  .use(router)
  .use(store)
  .component("font-awesome-icon", FontAwesomeIcon, "vue-like-dislike-buttons", VueLikeDislikeButtons)

  .mount("#app");