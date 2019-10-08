import Vue from "vue";
import Vuex from "vuex";
import router from './router'
import { RoleRoutes } from "./router";
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userinfo: null,
        permissionList: null /** 所有路由 */ ,
        sidebarMenu: ''
    },
    mutations: {
        setuserinfo(state, userinfo) {
            state.userinfo = userinfo
                //Vue.prototype.$setlocalStorage('userinfo', userinfo)
        },
        SET_PERMISSION(state, routes) {
            state.permissionList = routes
                //Vue.prototype.$setlocalStorage('permissionList', routes)
        },
        SET_MENU(state, menu) {
            state.sidebarMenu = menu
        },
    },
    actions: {
        async FETCH_PERMISSION({ commit, state }) {
            /*  获取后台给的权限数组 */
            let permissionList = await Vue.prototype.$getlocalStorage('userinfo').permissionList;
            console.log(state)
                /*  根据后台权限跟我们定义好的权限对比，筛选出对应的路由并加入到path=''的children */
            let routes = recursionRouter(permissionList, authRoutes)
            let MainContainer = RoleRoutes.find(v => v.path === '/layout/Index')
            let children = MainContainer.children
            children.push(...routes)
                //console.log(children)
                /* 生成左侧导航菜单 */
            commit('SET_MENU', children)
                /*  初始路由 */
            let initialRoutes = router.options.routes

            /*  动态添加路由 */
            router.options.routes = [...initialRoutes, ...RoleRoutes]
            router.addRoutes(RoleRoutes)
                //console.log(router)
                /* 完整的路由表 */
            commit('SET_PERMISSION', [...initialRoutes, ...RoleRoutes])
        }
    },
    getters: {

    }
});

export function recursionRouter(userRouter = [], allRouter = []) {
    var realRoutes = []
    allRouter.forEach((v, i) => {
        userRouter.forEach((item, index) => {
            if (item.permission === v.meta.permission) {
                if (item.children && item.children.length > 0) {
                    v.children = recursionRouter(item.children, v.children)
                }
                realRoutes.push(v)
            }
        })
    })
    return realRoutes
};

export const authRoutes = [{
        path: '/list/user',
        name: 'user',
        meta: {
            name: '客户管理',
            permission: 'CUSTOMER_MANAGE',
            ico: 'el-icon-s-custom'
        },
        component: () =>
            import ('./views/list/user.vue')
    },
    {
        path: '/list/role',
        name: 'role',
        meta: {
            name: '角色管理',
            permission: 'ROLE_MANAGE',
            ico: 'el-icon-user-solid'
        },
        component: () =>
            import ('./views/list/role.vue')
    },
    {
        path: '/list/admin',
        name: 'admin',
        meta: {
            name: '用户管理',
            permission: 'USER_MANAGE',
            ico: 'el-icon-user'
        },
        component: () =>
            import ('./views/list/admin.vue')
    },
    {
        path: '/list/personal',
        name: 'personal',
        meta: {
            name: '个人认证',
            permission: 'PERSONAL_MANAGE',
            ico: 'el-icon-document-checked'
        },
        component: () =>
            import ('./views/list/personal.vue')
    },
    {
        path: '/list/enterprise',
        name: 'enterprise',
        meta: {
            name: '企业认证',
            permission: 'ENTERPRISE_MANAGE',
            ico: 'el-icon-folder-checked'
        },
        component: () =>
            import ('./views/list/enterprise.vue')
    },
];