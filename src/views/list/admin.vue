<template>
    <div class="wrap">
        <div class="fifter">
            <el-row>
                <el-col :span="2">
                    <el-button type="primary" @click="adduser()">添加用户</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="table">
            <template>
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column prop="username" label="用户名"></el-table-column>
                    <el-table-column prop="name" label="姓名"></el-table-column>
                    <el-table-column prop="role" label="角色"></el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
                            <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <div class="page">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="totalCount"
                :page-size="pageSize"
                @current-change="clickpage"
            ></el-pagination>
        </div>
        <el-dialog :title="dialogtitle" :visible.sync="dialogadd" width="45%">
            <el-form>
                <el-form-item label="用户名" label-width="70px">
                    <el-input v-model="username" autocomplete="off" :disabled="updata==1?false:true"></el-input>
                </el-form-item>
                <el-form-item label="姓名" label-width="70px">
                    <el-input v-model="name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色" label-width="70px">
                    <el-select v-model="role" placeholder="请选择角色" filterable>
                        <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.role" 
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogadd = false">取 消</el-button>
                <el-button type="primary" @click="updataUser()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    components: {},
    data() {
        return {
            tableData: [],
            pageSize: 10,
            currentPage: 1,
            totalCount: 10,
            username:'',
            name:'',
            role:'',
            options:[],
            updata:1,
            dialogadd:false,
            dialogtitle:'',
            userid:'',
        };
    },
    created() {
        this.creatrequest();
        this.rolerequest();
    },
    mounted() {},
    computed: {},
    methods: {
        creatrequest() {
            let that = this;
            this.$request({
                method: "post",
                headers: {
                    "content-type": "application/json;charset=UTF-8"
                },
                data:{
                    page: this.currentPage,
                    rows: this.pageSize
                },
                url: "/sysuser/selectAllUsers"
            })
            .then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    that.tableData = res.data.data,
                    that.totalCount = res.data.totalCount;
                } else {
                    that.$message.error(res.data.msg);
                }
            })
            .catch(err => {
                that.$message.error("请求数据出错，请刷新重试");
                console.log(err);
            });
        },
        rolerequest(){
            let that = this;
            this.$request({
                method: "post",
                headers: {
                    "content-type": "application/json;charset=UTF-8"
                },
                data: {
                    page: 1,
                    rows: 9999,
                },
                url: "/sysrole/selectAllRoles"
            })
            .then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    that.options = res.data.data;
                } else {
                    that.$message.error(res.data.msg);
                }
            })
            .catch(err => {
                that.$message.error("请求数据出错，请刷新重试");
                console.log(err);
            });
        },
        clickpage(e) {
            this.currentPage = e;
            this.creatrequest();
        },
        adduser(){
            this.username = "";
            this.name = "";
            this.role="";
            this.dialogadd = true;
            this.updata = 1;
            this.dialogtitle = "添加用户";
        },
        edit(e){
            this.dialogadd = true;
            this.updata = 2;
            this.name = e.name;
            this.username = e.username;
            this.role=parseInt(e.roleId);
            this.dialogtitle = "编辑用户";
            this.userid=e.id
        },
        updataUser(){
            if(!this.role){
                this.$message.error("请为管理员选择角色");
                return false
            }
            var that=this
            if(this.updata==1){
                let passreg = /^[a-zA-Z0-9_-]{6,16}$/
                let username=passreg.test(this.username)
                if(!username){
                    this.$message.error("请输入6到16位（字母，数字，下划线，减号组成的用户名）");
                    return false
                }
                this.$request({
                    method: "post",
                    headers: {
                        "content-type": "application/json;charset=UTF-8"
                    },
                    data: {
                        username: this.username,
                        name: this.name,
                        roleId:this.role,
                    },
                    url: "/sysuser/addUser"
                })
                .then(res => {
                    //console.log(res);
                    if (res.data.code == 0) {
                        that.dialogadd = false;
                        that.$message({
                            message: "用户添加成功",
                            type: "success"
                        });
                        that.creatrequest();
                    } else {
                        that.$message.error("添加失败，"+res.data.msg);
                    }
                })
                .catch(err => {
                    that.$message.error("请求数据出错，请刷新重试");
                    console.log(err);
                });
            }else{
                this.$request({
                    method: "post",
                    headers: {
                        "content-type": "application/json;charset=UTF-8"
                    },
                    data: {
                        id: this.userid,
                        name: this.name,
                        roleId:this.role,
                    },
                    url: "/sysuser/updateUser"
                })
                .then(res => {
                    //console.log(res);
                    if (res.data.code == 0) {
                        that.dialogadd = false;
                        that.$message({
                            message: "用户更新成功",
                            type: "success"
                        });
                        that.creatrequest();
                    } else {
                        that.$message.error("用户更新失败，"+res.data.msg);
                    }
                })
                .catch(err => {
                    that.$message.error("请求数据出错，请刷新重试");
                    console.log(err);
                });
            }
        },
        del(e){
            this.userid=e.id;
            let that=this
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.$request({
                    method: "post",
                    data:{
                        id:that.userid,
                    },
                    url: "/sysuser/deleteUserById"
                })
                .then(res => {
                    //console.log(res);
                    if (res.data.code == 0) {
                        that.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        that.creatrequest();
                    } else {
                        that.$message.error(res.data.msg);
                    }
                })
                .catch(err => {
                    that.$message.error("删除失败，请刷新重试");
                    console.log(err);
                });
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
    }
};
</script>
<style>
.page{
    padding-top:30px;
}
.table{
    padding-top:30px;
}
.el-select{
    width: 100%;
}
</style>