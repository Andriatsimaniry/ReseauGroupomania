import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "./plugins/font-awesome";
// import axios from "axios";

// Vue.config.productionTip = false;
// axios.interceptors.response.use (undefined, function (error) {
//   if (error) {
//     const originalRequest = error.config;
//     if (error.response.status === 401 &&! originalRequest._retry) {
  
//         originalRequest._retry = true;
//         store.dispatch ('LogOut')
//         return router.push ('/ login')
//     }
//   }
// })

createApp(App)
  .use(router)
  .use(store)
  .component("font-awesome-icon", FontAwesomeIcon)

  .mount("#app");
