<template>
    <div class="user-info">
        <div class="info-box">
            <h2 class="title">修改密码</h2>
            <!-- form -->
            <el-form :model="userData" class="form-box">
                <el-form-item label="用户名">
                    <el-input v-model="userData.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="原密码">
                    <el-input type="password" v-model="userData.oldpwd"></el-input>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input type="password" v-model="userData.newpwd"></el-input>
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input type="password" v-model="userData.cfmpwd"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        @click="onSubmit"
                        type="primary"
                        :loading="loading"
                    >修改密码</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { hexMD5 } from "@/assets/js/md5";
export default {
    components: {},
    data() {
        return {
            userData: {
                username: "",
                oldpwd: "",
                newpwd:"",
                cfmpwd:'',
            },
            loading: false
        };
    },
    created() {
        this.userData.username = this.$getlocalStorage("userinfo").username;
    },
    mounted() {},
    computed: {},
    methods: {
        onSubmit() {
            var that = this;
            if(this.userData.oldpwd==''){
                that.$message.error('请填写原始密码');
                return false
            }
            if(this.userData.newpwd==''){
                that.$message.error('请填写新密码');
                return false
            }
            if(this.userData.cfmpwd==''){
                that.$message.error('请确认密码');
                return false
            }
            if(this.userData.newpwd!==this.userData.cfmpwd){
                that.$message.error('两次密码输入不一致');
                return false
            }
            this.$request({
                method: "post",
                data: {
                    oldPassword:hexMD5(this.userData.oldpwd),
                    password:hexMD5(this.userData.newpwd)
                },
                url: "/pwd/changePassword"
            })
                .then(res => {
                    console.log(res);
                    this.isLogin = false;
                    if (res.data.code == 0) {
                        that.$message({
                            message: "密码修改成功，请重新登录",
                            type: "success"
                        });
                        that.$request({
                            method:'get',
                            url:'/syslogin/logout',
                        }).then((res) => {
                            return true
                        }).catch((err) => {
                            console.log(err);
                        })
                        setTimeout(() => {
                            that.$store.commit('setuserinfo', '')
                            that.$store.commit('SET_PERMISSION', '')
                            that.$store.commit('SET_MENU', '')
                            localStorage.removeItem('userinfo')
                            window.location.reload()
                            that.$router.replace({name:"login"})
                        }, 3000);
                        
                    } else {
                        that.$message.error(res.data.msg);
                    }
                })
                .catch(err => {
                    this.isLogin = false;
                    that.$message.error("密码修改失败");
                    console.log(err);
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.user-info {
    height: calc(100% - 70px);
    display: flex;
    overflow: auto;
    color: #606266;
    .img-box,
    .info-box {
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        border: 1px solid #dcdfe6;
        background: #fff;
        .title {
            border-bottom: 1px solid #dcdfe6;
            padding: 10px;
            text-align: left;
            margin-bottom: 20px;
            font-size: 16px;
            font-weight: bold;
        }
    }
    .img-box {
        text-align: center;
        width: 30%;
        margin-right: 10px;
        img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
        }
        h4 {
            margin-top: 20px;
            font-size: 16px;
        }
    }
    .info-box {
        flex: 1;
        .form-box {
            padding: 10px;
        }
    }
}
</style>