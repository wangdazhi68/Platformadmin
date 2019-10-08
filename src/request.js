import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import store from './store'
import router from './router';
// 创建axios实例
const service = axios.create({
        baseURL: 'http://192.168.50.144:8088',
        timeout: 10000, // 请求超时时间
        //data:data,
        // transformRequest: [function (data) {
        //     return qs.stringify(data);
        // }],
        headers: {
            'token': '',
            //'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            'content-type': "application/json;charset=UTF-8"
        }

    })
    // request拦截器
service.interceptors.request.use(
    config => {
        let localdata = Vue.prototype.$getlocalStorage('userinfo')
        if (localdata) {
            config.headers.token = localdata.sessionId;
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// respone拦截器
service.interceptors.response.use(
    response => {
        if (response.status == 200) {
            if (response.data.code == -2) {
                store.commit('setuserinfo', '')
                store.commit('SET_PERMISSION', '')
                store.commit('SET_MENU', '')
                localStorage.removeItem('userinfo')
                window.location.reload()
                router.replace({ path: "/login/login" })

            }
        }
        return response
    },
    error => {
        return Promise.reject(error)
    }
)

export default service