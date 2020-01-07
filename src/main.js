import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import request from './request'
Vue.prototype.$request = request;
import './assets/css/common.css'
Vue.config.productionTip = false
Vue.prototype.$baseURL = process.env.VUE_APP_APIURL + '/';


Vue.prototype.$setlocalStorage = function set(key, value) {
    var curTime = new Date().getTime();
    window.localStorage.setItem(key, JSON.stringify({ data: value, time: curTime }));
}
Vue.prototype.$getlocalStorage = function get(key, exp = 86400000) {
    var data = localStorage.getItem(key);
    var dataObj = JSON.parse(data);
    if (dataObj) {
        if (new Date().getTime() - dataObj.time > exp) {
            console.log('信息已过期');
            store.commit('setuserinfo', '')
            localStorage.removeItem('userinfo')
            router.replace({ name: "login" })
        } else {
            //console.log("data="+dataObj.data);
            //console.log(JSON.parse(dataObj.data));
            var dataObjDatatoJson = dataObj.data;
            return dataObjDatatoJson;
        }
    } else {
        return null
    }

}

router.beforeEach((to, from, next) => {

    if (to.meta.name) {
        document.title = to.meta.name
    }
    //带token开发
    if (!Vue.prototype.$getlocalStorage('userinfo')) {
        if (to.matched.length > 0 &&
            !to.matched.some(record => record.meta.requiresAuth)) {
            next()
        } else {
            //console.log(to.fullPath)
            next({
                path: '/login/login',
                query: { rediect: to.fullPath }
            })
        }
    } else {
        if (!store.state.permissionList) {
            store.dispatch('FETCH_PERMISSION').then(() => {
                next({ path: to.path })
            }).catch(function(reason) {
                console.log(reason);
            });
        } else {
            if (to.path !== '/login/login') {
                next()
            } else {
                next({ path: "/layout/Index" })
            }
        }
    }

})


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')