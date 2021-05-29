// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from "./store";

import axios from "axios";
Vue.prototype.$axios=axios;

Vue.config.productionTip = false
Vue.use(ElementUI);
/* eslint-disable no-new */

//请求拦截
axios.defaults.baseURL = "http://localhost:8081"
axios.interceptors.request.use(config => {
  if ("/common/login" != config.url) {
    if (localStorage.getItem("token")) {
      config.headers["Authorization"] =
        "Bearer " + localStorage.getItem("token");
      console.log(localStorage.getItem("token"));
    }
  }
  return config
}, err => {
  //todo待完善接口拦截
  return Promise.reject(err)
});
new Vue({
  el: '#app',
  router,
  store,
  ElementUI,
  components: { App },
  template: '<App/>'
})
