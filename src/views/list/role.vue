<template>
    <div class="wrap">
        <div class="fifter">
            <el-row>
                <el-col :span="2">
                    <el-button type="primary" @click="addrole()">添加角色</el-button>
                </el-col>
                <!-- <el-col :span="10">
                    <el-date-picker
                        v-model="dateval"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="aaa()"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-col>
                <el-col :span="10">
                    <el-input placeholder="请输入关键字搜索" prefix-icon="el-icon-search" v-model="searchval"></el-input>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" plain>查询</el-button>
                </el-col>-->
            </el-row>
        </div>
        <div class="table">
            <template>
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column prop="role" label="角色名称" width="150"></el-table-column>
                    <el-table-column prop="description" label="描述"></el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
                            <el-button @click="auth(scope.row)" type="text" size="small">权限</el-button>
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
                <el-form-item label="角色名称" label-width="70px">
                    <el-input v-model="rolename" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" label-width="70px">
                    <el-input type="textarea" v-model="roledesc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogadd = false">取 消</el-button>
                <el-button type="primary" @click="updataRole()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="分配权限" :visible.sync="dialogauth" width="45%">
            <el-form>
                <el-form-item>
                    <el-checkbox-group v-model="roleAuth">
                        <el-checkbox 
                            v-for="authitem in allAuth" 
                            :key="authitem.id"  
                            :label="authitem.permission" 
                        >
                            {{authitem.title}}
                        </el-checkbox>  
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogauth = false">取 消</el-button>
                <el-button type="primary" @click="updataAuth()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import qs from "qs";
export default {
    components: {},
    data() {
        return {
            dialogadd: false,
            dialogauth:false,
            rolename: "",
            roledesc: "",
            roleid: "",
            tableData: [],
            pageSize: 10,
            currentPage: 1,
            dialogtitle: "角色添加",
            totalCount: 10,
            updata: 1,
            roleAuth:[],
            allAuth:[],
        };
    },
    created() {
        this.creatrequest();
        this.authrequset();
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
                data: {
                    page: this.currentPage,
                    rows: this.pageSize
                },
                url: "/sysrole/selectAllRoles"
            })
            .then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    that.tableData = res.data.data,
                    that.totalCount = res.data.totalCount;
                } else {
                    that.$message.error("请求数据出错，请刷新重试");
                }
            })
            .catch(err => {
                that.$message.error("请求数据出错，请刷新重试");
                console.log(err);
            });
        },
        authrequset(){
            let that = this;
            this.$request({
                method: "post",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                data:qs.stringify({
                    roleId: 0,
                }),
                url: "/permission/selectAllPermission"
            })
            .then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    that.allAuth=res.data.data;
                } else {
                    that.$message.error("请求权限数据出错，请刷新重试");
                }
            })
            .catch(err => {
                that.$message.error("请求数据出错，请刷新重试");
                console.log(err);
            });
        },
        edit(e) {
            this.dialogadd = true;
            this.updata = 2;
            this.rolename = e.role;
            this.roledesc = e.description;
            this.roleid = e.id;
            this.dialogtitle = "角色编辑";
        },
        auth(e){
            this.roleid = e.id;
            this.dialogauth=true;
            let that = this;
            this.$request({
                method: "post",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                data:qs.stringify({
                    roleId:this.roleid,
                }),
                url: "/permission/selectAllPermission"
            })
            .then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    let array=[];
                    for (var i = 0; i < res.data.data.length; i++) {
                        array.push(res.data.data[i]['permission'])
                    }
                    that.roleAuth=array;
                    //console.log(that.roleAuth) 
                } else {
                    that.$message.error("请求权限数据出错，请刷新重试");
                }
            })
            .catch(err => {
                that.$message.error("请求数据出错，请刷新重试");
                console.log(err);
            });
        },
        updataAuth(){
            let that = this;
            this.$request({
                method: "post",
                headers: {
                    'content-type': "application/json;charset=UTF-8"
                },
                data:{
                    roleId:this.roleid,
                    permissionIds:this.roleAuth.join(',')
                },
                url: "/permission/updatePermission"
            })
            .then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    this.dialogauth = false;
                    this.$message({
                        message: "分配权限成功",
                        type: "success"
                    });
                    this.creatrequest();
                } else {
                    that.$message.error("请求权限数据出错，请刷新重试");
                }
            })
            .catch(err => {
                that.$message.error("请求数据出错，请刷新重试");
                console.log(err);
            });
        },
        addrole() {
            this.rolename = "";
            this.roledesc = "";
            this.dialogadd = true;
            this.updata = 1;
            this.dialogtitle = "角色添加";
        },
        clickpage(e) {
            this.currentPage = e;
            this.creatrequest();
        },
        updataRole() {
            if (this.updata == 1) {
                let that = this;
                this.$request({
                    method: "post",
                    headers: {
                        "content-type": "application/json;charset=UTF-8"
                    },
                    data: {
                        role: this.rolename,
                        description: this.roledesc
                    },
                    url: "/sysrole/addRole"
                })
                .then(res => {
                    //console.log(res);
                    if (res.data.code == 0) {
                        this.dialogadd = false;
                        this.$message({
                            message: "角色添加成功",
                            type: "success"
                        });
                        this.creatrequest();
                    } else {
                        that.$message.error("请求数据失败，请刷新重试");
                    }
                })
                .catch(err => {
                    that.$message.error("请求数据出错，请刷新重试");
                    console.log(err);
                });
            } else {
                let that = this;
                this.$request({
                    method: "post",
                    headers: {
                        "content-type": "application/json;charset=UTF-8"
                    },
                    data: {
                        role: this.rolename,
                        description: this.roledesc,
                        id: this.roleid
                    },
                    url: "/sysrole/updateRole"
                })
                .then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        this.dialogadd = false;
                        this.$message({
                            message: "角色编辑成功",
                            type: "success"
                        });
                        this.creatrequest();
                    } else {
                        that.$message.error("请求数据失败，请刷新重试");
                    }
                })
                .catch(err => {
                    that.$message.error("请求数据出错，请刷新重试");
                    console.log(err);
                });
            }
        },
        del(e){
            this.roleid = e.id;
            let that=this
            this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.$request({
                    method: "post",
                    data:{
                        id:that.roleid,
                    },
                    url: "/sysrole/deleteRoleById"
                })
                .then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        that.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        that.creatrequest();
                    } else {
                        that.$message.error("删除失败，请刷新重试");
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
.page {
    padding-top: 30px;
}
.table {
    padding-top: 30px;
}
</style>