<template>
    <div class="wrap">
        <div class="fifter">
            <el-row>
                <el-col :span="10">
                    <el-date-picker
                        v-model="dateval"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="datetime"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-col>
                <el-col :span="10">
                    <el-input placeholder="按账户名搜索" prefix-icon="el-icon-search" v-model="searchval"></el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" plain @click="selectfifter()">查询</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="table">
            <template>
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column fixed prop="mobile" label="手机号" width=""></el-table-column>
                    <el-table-column prop="email" label="邮箱" width=""></el-table-column>
                    <el-table-column prop="createTime" label="注册时间" width=""></el-table-column>
                    <el-table-column prop="status" label="冻结状态" width="">
                        <template scope="scope">
                            <b style="color:#67C23A"   v-if="scope.row.status=='0'">正常</b>
                            <b style="color:#F56C6C" v-if="scope.row.status=='1'">冻结</b>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="冻结操作" width="150">
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.status"
                                :active-value="'1'"
                                :inactive-value="'0'"
                                active-text="冻结"
                                inactive-text="默认"
                                @change="changeSwitch(scope.row)"
                            >
                            </el-switch>
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
            dateval:null,
            searchval:null,
            requestdata:{
                page: 1,
                rows: 10,
            },
            gutter:30,
        };
    },
    created() {
      this.creatrequest();  
    },
    mounted() {},
    computed: {
        status(){
           switch(this.userinfo.identityType)
            {
                case '1':
                    this.userinfo.identityType='身份证'
                    break;
                case '2':
                    this.userinfo.identityType='军官证'
                    break;
                case '3':
                    this.userinfo.identityType='士兵证'
                    break;
                case '4':
                    this.userinfo.identityType='护照'
                    break;
                case '5':
                    this.userinfo.identityType='港澳通行证'
                    break;
                case '6':
                    this.userinfo.identityType='台胞证'
                    break;
            }
            return this.userinfo.identityType
        }
    },
    methods: {
        creatrequest() {
            let that = this;
            this.$request({
                method: "post",
                headers: {
                    "content-type": "application/json;charset=UTF-8"
                },
                data:that.requestdata,
                url: "/syscustomer/selectAllCustomers"
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
        datetime(e){
            this.dateval=e
        },
        selectfifter(){
            this.requestdata={
                appStatus:1,
                page: 1,
                rows: this.pageSize,
                accountName:this.searchval,
                startTime:this.dateval?this.dateval[0]:'',
                endTime:this.dateval?this.dateval[1]:'',
            }
            if(!this.dateval){
                delete this.requestdata.startTime;
                delete this.requestdata.endTime;
            }
            if(!this.searchval){
                delete this.requestdata.realName;
            }
            this.creatrequest();
        },
        clickpage(e) {
            this.requestdata={
                appStatus:1,
                page: e,
                rows: this.pageSize,
                accountName:this.searchval,
                startTime:this.dateval?this.dateval[0]:'',
                endTime:this.dateval?this.dateval[1]:'',
            }
            if(!this.dateval){
                delete this.requestdata.startTime;
                delete this.requestdata.endTime;
            }
            if(!this.searchval){
                delete this.requestdata.accountName;
            }
            this.creatrequest();
        },
        changeSwitch(e){
            console.log(typeof(e.status));
            let that = this;
            this.$request({
                method: "post",
                headers: {
                    "content-type": "application/json;charset=UTF-8"
                },
                data:{
                    id:e.id,
                    status:e.status
                },
                url: "/syscustomer/frozen"
            })
            .then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    this.$message({
                        message: "操作成功",
                        type: "success"
                    });
                    this.creatrequest();
                } else {
                    that.$message.error(res.data.msg);
                }
            })
            .catch(err => {
                that.$message.error("请求数据出错，请刷新重试");
                console.log(err);
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

</style>