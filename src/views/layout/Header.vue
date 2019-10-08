<template>
    <div class="layout-header">
        <el-row>
            <el-col :xs="10" :sm="12" :md="14" :lg="16" :xl="18">
                <div class="system-info">
                    <img class="logo" src="@/assets/images/logo2.png" alt />
                    <span class="title">联合信任后台管理系统</span>
                </div>
            </el-col>
            <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
                <el-dropdown  class="system-user" @command="userCommand">
                    <span class="userinfo-inner">
                        <b>{{$getlocalStorage('userinfo').username}}</b> 
                        <img src="@/assets/images/visitor.jpg" alt />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="editpwd">修改密码</el-dropdown-item>
                        <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    components: {
        
    },
    data() {
        return {};
    },
    created() {},
    mounted() {},
    computed: {},
    methods: {
        userCommand(command){
            var that=this;
            if (command == "editpwd") {
                this.$router.push({name:'eidtpwd'})
            }
            if(command == "logout"){
                that.$request({
                    method:'get',
                    url:'/syslogin/logout',
                }).then((res) => {
                    return true
                }).catch((err) => {
                    console.log(err);
                })
                that.$store.commit('setuserinfo', '')
                that.$store.commit('SET_PERMISSION', '')
                that.$store.commit('SET_MENU', '')
                localStorage.removeItem('userinfo')
                window.location.reload()
                that.$router.replace({name:"login"})
            }
        }

    }
};
</script>
<style scoped>
.layout-header {
    background: #495060;
    line-height: 64px;
    height: 64px;
}
.system-info {
    text-align: left;
}
.logo {
    width: 130px;
    height: 40px;
    margin-top: 12px;
    margin-left: 20px;
    margin-right: 10px;
    float: left;
    position: relative;
    background:#fff;
}
.title {
    font-size: 18px;
    font-weight: bold;
    color: azure;
    line-height: 64px;
}
.system-user .userinfo-inner {
    color: #fff;
    font-size: 16px;
    cursor: pointer;
}
.userinfo-inner img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 10px 0px 10px 10px;
    float: right;
}
.userinfo-inner b{
    float: right;
    display:block;
    padding: 0 10px;
}
.system-user {
    text-align: right;
    float: right;
    padding-right: 16px;
}
</style>
<style>

</style>