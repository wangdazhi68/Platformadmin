<template>
    <div class="wrap">
        <div class="fifter">
            <el-row>
                <el-col :span="8">
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
                <el-col :span="7">
                    <el-input class="search" placeholder="按姓名搜索" prefix-icon="el-icon-search" v-model="searchval"></el-input>
                </el-col>
                <el-col :span="7">
                    <el-select class="type" v-model="typeval" placeholder="审核状态" filterable>
                        <el-option label="全部" value="00"></el-option>
                        <el-option label="已审核" value="1"></el-option>
                        <el-option label="待审核" value="0"></el-option>
                    </el-select>
                 </el-col>
                <el-col :span="2">
                    <el-button type="primary" plain @click="selectfifter()">查询</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="table">
            <template>
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column prop="realName" label="姓名" width="80"></el-table-column>
                    <el-table-column prop="mobile" label="手机号" width="110"></el-table-column>
                    <el-table-column prop="email" label="邮箱"></el-table-column>
                    <el-table-column prop="appTime" label="申请时间"></el-table-column>
                    <el-table-column prop="appSource" label="认证方式"></el-table-column>
                    <el-table-column prop="identityId" label="身份证号"></el-table-column>
                    <el-table-column prop="approveStatus" label="状态" width="80">
                        <template scope="scope">
                            <b style="color:#F56C6C" v-if="scope.row.approveStatus==0">待审核</b>
                            <b style="color:#67C23A" v-if="scope.row.approveStatus==1">已审核</b>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button @click="look(scope.row)" type="text" size="small">
                                {{scope.row.approveStatus==1?'查看':'审核'}}
                            </el-button>
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
        <el-dialog title="认证详细" :visible.sync="dialogdetail" width="70%">
            <el-form>
                <el-row :gutter="gutter">
                    <el-col :span="12">
                        <el-form-item label="用户名" label-width="70px">
                            <el-input v-model="userinfo.username" autocomplete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="姓名" label-width="70px">
                            <el-input v-model="userinfo.realName" autocomplete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="gutter">
                    <el-col :span="12">
                        <el-form-item label="手机号" label-width="70px">
                            <el-input v-model="userinfo.mobile" autocomplete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱" label-width="70px">
                            <el-input v-model="userinfo.email" autocomplete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="gutter">
                    <el-col :span="12">
                        <el-form-item label="证件类型" label-width="70px">
                            <el-input v-model="identityType" autocomplete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="证件号码" label-width="70px">
                            <el-input v-model="userinfo.identityId" autocomplete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="gutter">
                    <el-col :span="12">
                        <el-form-item label="认证方式" label-width="70px">
                            <el-input v-model="userinfo.appSource" autocomplete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="提交时间" label-width="70px">
                            <el-input v-model="userinfo.appTime" autocomplete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <div class="demo-image__preview">
                        <el-image v-for="item in picdata" :key="item.id"
                            style="padding:20px; width: 200px; height: 200px"
                            :src="$baseURL+'permission/downloadFile?id='+item.id" 
                            :preview-src-list="[$baseURL+'permission/downloadFile?id='+item.id]"
                            >
                        </el-image>
                    </div>
                </el-row> 
                <el-row>
                    <el-radio-group v-model="pass"  :disabled="disabled" size="mini">
                        <el-radio label=1 border>认证通过</el-radio>
                        <el-radio label=2 border>认证驳回</el-radio>
                    </el-radio-group>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogdetail = false">取 消</el-button>
                <el-button type="primary" @click="uppass()">确 定</el-button>
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
            tableData: [],
            pageSize: 10,
            currentPage: 1,
            totalCount: 10,
            dateval:null,
            searchval:null,
            typeval:null,
            requestdata:{
                appStatus:1,
                page: 1,
                rows: 10
            },
            dialogdetail:false,
            gutter:30,
            userinfo:{
                username:'',
                realName:'',
                mobile:'',
                email:'',
                identityType:'1',
                identityId:'',
                appSource:'',
                appTime:''
            },
            pass:'1',
            picdata:[],
            disabled:false,
            approveId:'',
            
        };
    },
    created() {
        this.creatrequest();
    },
    mounted() {},
    computed: {
        identityType(){
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
                url: "/permission/selectAllUserPermission"
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
                realName:this.searchval,
                startTime:this.dateval?this.dateval[0]:'',
                endTime:this.dateval?this.dateval[1]:'',
                approveStatus:this.typeval
            }
            if(!this.dateval){
                delete this.requestdata.startTime;
                delete this.requestdata.endTime;
            }
            if(!this.searchval){
                delete this.requestdata.realName;
            }
            if(!this.typeval || this.typeval=="00"){
                delete this.requestdata.approveStatus;
            }
            this.creatrequest();
        },
        clickpage(e) {
            this.requestdata={
                appStatus:1,
                page: e,
                rows: this.pageSize,
                realName:this.searchval,
                startTime:this.dateval?this.dateval[0]:'',
                endTime:this.dateval?this.dateval[1]:'',
                approveStatus:this.typeval
            }
            if(!this.dateval){
                delete this.requestdata.startTime;
                delete this.requestdata.endTime;
            }
            if(!this.searchval){
                delete this.requestdata.realName;
            }
            if(!this.typeval || this.typeval=="00"){
                delete this.requestdata.approveStatus;
            }
            this.creatrequest();
        },
        look(e){
            let that = this;
            if(e.approveStatus=='1'){
                this.disabled=true
            }else{
                this.disabled=false
            }
            this.approveId=e.approveId;
            //console.log(e.id)
            this.dialogdetail=true;
            //个人信息接口
            this.$request({
                method: "post",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                data:qs.stringify({customerId:e.id}),
                url: "/syscustomer/cusDetail"
            })
            .then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    that.userinfo = res.data.data
                } else {
                    that.$message.error(res.data.msg);
                }
            })
            .catch(err => {
                that.$message.error("请求数据出错，请刷新重试");
                console.log(err);
            });
            //图片接口
            this.$request({
                method: "post",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                data:qs.stringify({customerId:e.id}),
                url: "/permission/selectAllPhotos"
            })
            .then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    that.picdata = res.data.data
                } else {
                    that.$message.error(res.data.msg);
                }
            })
            .catch(err => {
                that.$message.error("请求数据出错，请刷新重试");
                console.log(err);
            });
        },
        uppass(){
            //个人信息接口
            var that=this;
            this.$request({
                method: "post",
                data:{
                    approveStatus:parseInt(this.pass),
                    approveId:this.approveId
                },
                url: "/permission/approve"
            })
            .then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    that.$message({
                        message: "操作成功",
                        type: "success"
                    });
                    that.creatrequest();
                    that.dialogdetail=false;
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
.page {
    padding-top: 30px;
}
.table {
    padding-top: 30px;
}
.el-select{
    width: 100%;
}
.search{
    width:280px;
}
.type{
    width: 280px;
}
</style>