<template>
    <div class="login">
        <LoginHeader>
            <el-form
                :rules="rules"
                :model="ruleForm"
                ref="ruleForm"
                label-position="left"
                label-width="0px"
                slot="container"
            >
                <div class="title">
                    <h3>账号密码登录</h3>
                </div>
                <!-- username -->
                <el-form-item prop="username">
                    <el-input
                        type="text"
                        v-model="ruleForm.username"
                        auto-complete="off"
                        placeholder="账号"
                    >
                        <i slot="prefix" class="el-icon-user"></i>
                    </el-input>
                </el-form-item>

                <!-- password -->
                <el-form-item prop="pwd">
                    <el-input
                        type="password"
                        v-model="ruleForm.pwd"
                        auto-complete="off"
                        placeholder="密码"
                    >
                        <i slot="prefix" class="el-icon-lock"></i>
                    </el-input>
                </el-form-item>

                <!-- 登录button -->
                <el-form-item>
                    <el-button
                        :loading="isLogin"
                        @click.native.prevent="handleSubmit"
                        type="primary"
                        style="width:100%;"
                    >登录</el-button>
                </el-form-item>
            </el-form>
        </LoginHeader>
    </div>
</template>
<script>
import { hexMD5 } from "@/assets/js/md5";
import LoginHeader from "@/views/login/loginHeader.vue";
export default {
    components: {
        LoginHeader
    },
    data() {
        return {
            isLogin: false,
            ruleForm: {
                username: "",
                pwd: ""
            },
            rules: {
                username: [
                    { required: true, message: "请输入账号", trigger: "blur" }
                ],
                pwd: [
                    { required: true, message: "请输入密码", trigger: "blur" }
                ]
            }
        };
    },
    created() {},
    mounted() {},
    computed: {},
    methods: {
        handleSubmit() {
            var that = this;
            this.$refs["ruleForm"].validate(valid => {
                if (valid) {
                    this.isLogin = true;
                    this.$request({
                        method: "post",
                        headers: {
                            "content-type": "application/json;charset=UTF-8"
                        },
                        data: {
                            username: this.ruleForm.username,
                            password: hexMD5(this.ruleForm.pwd)
                        },
                        url: "/syslogin/signOn"
                    })
                        .then(res => {
                            console.log(res);
                            this.isLogin = false;
                            if (res.data.code == 0) {
                                that.$store.commit(
                                    "setuserinfo",
                                    res.data.data
                                );
                                that.$setlocalStorage(
                                    "userinfo",
                                    res.data.data
                                );
                                if (that.$route.query.rediect) {
                                    // setTimeout(function() {
                                        that.$router.replace({
                                            path: that.$route.query.rediect
                                        });
                                    // }, 3000);
                                } else {
                                    // setTimeout(function() {
                                        that.$router.replace({
                                            path: "/layout/Index"
                                        });
                                    // }, 3000);
                                }
                            }else{
                                that.$message.error(res.data.msg);
                            }
                        })
                        .catch(err => {
                            this.isLogin = false;
                            that.$message.error("登录失败");
                            console.log(err);
                        });
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
}

i {
    font-size: 14px;
    margin-left: 8px;
}
.forget {
    float: right;
}
</style>