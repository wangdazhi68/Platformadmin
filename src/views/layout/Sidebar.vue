<template>
    <el-scrollbar class="el-scrollbar">
        <el-menu
            :default-active="$router.currentRoute.path"
            class="el-menu-vertical-demo"
            text-color="#A3B1BF"
            active-text-color="#3080FE"
            active-background="#000"
            background-color="#495060"
            router
        >
            <el-menu-item :index="item.path" v-for="item in $store.state.sidebarMenu" :key="item.name">
                <i :class="item.meta.ico"></i>
                <span slot="title">{{item.meta.name}}</span>
            </el-menu-item>
        </el-menu>
    </el-scrollbar>
</template>
<script>
export default {
    components: {},
    data() {
        return {};
    },
    created() {
       
    },
    mounted() {},
    computed: {},
    methods: {}
};
</script>
<style>

</style>