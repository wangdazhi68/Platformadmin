<template>
    <div class="layout">
        <el-container>
            <!-- 头部 -->
            <el-header height="64px">
                <Header />
            </el-header>    
            <!-- 内容 -->
            <Content>
                <Sidebar slot="left"></Sidebar>
                <router-view slot="content"></router-view>
            </Content>
        </el-container>
    </div>
</template>
<script>
import Header from "@/views/layout/Header.vue";
import Content from "@/views/layout/Content.vue";
import Sidebar from "@/views/layout/Sidebar.vue";
export default {
    components: {
        Header,
        Content,
        Sidebar
    },
    data() {
        return {};
    },
    created() {},
    mounted() {},
    computed: {},
    methods: {}
};
</script>
<style src="../../assets/css/elcnt.css" scope></style>