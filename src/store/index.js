import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store =new Vuex.Store({
    state:{
    url:"http://localhost:8081"
    }
})
export default store