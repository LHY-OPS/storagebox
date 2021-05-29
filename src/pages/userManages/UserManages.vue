<template>
    <div class="user">
    <!-- 查询用户 -->
    <el-card class="box-card">
        <el-form :model="inform" style="height:100px;display:inline-block" ref="inform" label-width="100px" :rules="rule1">
            <el-form-item  prop="name" class="name">
                <el-input v-model="inform.name" class="nameBtn"  placeholder="姓名/用户名/手机号/邮箱">
                </el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="search()" class="addBtn">查询</el-button>
        <el-button @click="resetForm('inform')" class="resetBtn">重置</el-button>
    </el-card>
    <!-- 用户列表 -->
    <el-card>
        <el-button type="primary" @click="addData()">新增</el-button>
        <el-button type="primary" @click="editData()">编辑</el-button>
        <el-button type="primary" @click="start()">启用</el-button>
        <el-button type="primary" @click="forbid()">停用</el-button>
        <el-button type="primary" @click="Delete()">删除</el-button>
        <el-button type="primary" @click="resetPwd()">重置密码</el-button>
        <sirui-table
        :data="tableData"
        :page="page"
        :tableHeight="tableHeight"
        :loading="load"
        @handleSelectionChange="handleSelectionChange"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
        v-for="item in columnList"
        :key="item.num"
        :label="item.label"
        :width="item.width"
        :prop="item.prop"
        ></el-table-column>
        </sirui-table>
    </el-card>
    <!-- 新增弹出框 -->
    <User-add ref="addData"></User-add>
    <User-edit ref="editData"></User-edit>
    </div>
</template>
<script>
import SiruiTable from "../../components/SiruiTable/index";
import UserAdd from "../userManages/UserAdd";
import UserEdit from "../userManages/UserEdit";
export default {
    name:'usermanages',
    components : {
        SiruiTable,
        UserAdd,
        UserEdit
    },
    data(){
        var checkName = (rule, value, callback) => {
            var userName = /^[a-zA-Z][a-zA-Z0-9]{3,15}$/;
            var email =/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.(a-zA-Z]{2,4})$/;
            var name= /^([\*\"\'<>\/])+/;
            var phonenumber=/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
            setTimeout(()=>{
                if (
                   !email.test(value)&&
                   !userName.test(value)&&
                   !phonenumber.test(value)
                ){
                   callback(new Error("请输入正确的用户名/客户名/手机号/邮箱"));
                }else{
                    callback();
                }
            },100);
        };
        return {
            tableHeight:400,
            load:false,
            dialogVisible:false,
            pwdForm: {
                pass:"",
                checkPass:""
            },
            inform: {
                name:""
            },
            rule1:{
                name:{
                    validator:checkName
                }
            },
            columnList:[
                {prop:"userName",label:"用户名",width:100,num:1 },
                {prop:"nickName",label:"姓名",width:180,num:2},
                {prop:"sex",label:"性别",width:100,num:7},
                {prop:"phonenumber",label:"手机号",width:180,num:3},
                {prop:"email",label:"邮箱",width:180,num:4},
                {prop:"status",label:"状态",width:180,num:5},
            ],
            page:{
                pages:4,
                total:0,//共几页
                pageSize:10,//每页条数
                pageNum:1
            },
            tableData:[{
                userName:'lauv',
                nickName:'lauvv',
                sex:'女',
                phonenumber:'13258887945',
                email:'123@qq.com',
                status:'1',

            }],
            multipleSelection:[],
            Ostatus:""
        };
    },
    mounted(){
           this.getData();
        },
    methods: {
        //重置
        resetForm(formName){
         this.$refs[formName].resetFields();
        },
        resetPwd(){
            //重置密码 调接口
            if(this.multipleSelection.length >= 1){
                this.$confirm("是否重置密码","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning",
                })
                .then(() => {
                    let params = {
                        userIds: [],
                    };

                    for(var i=0; i< this.multipleSelection.length;i++){
                        params.userIds.push(this.multipleSelection[i].userId);
                    }
                    params.userIds = params.userIds.join(",");

                    this.$axios
                        .put(
                            this.$store.state.url +
                            "/backend/user/reset/"+
                            params.userIds
                        )
                        .then((res)=>{
                            if(res.data.code == 200){
                                // this.getData();

                                this.$message({
                                    type:"success",
                                    message: res.data.msg,  
                                });
                            }else{
                                this.$message({
                                    type:"error",
                                    message: res.data.msg,
                                    
                                });
                            }
                        });

                })
                .catch(() => {
                    this.$message({
                        type:"info",
                        message: "已取消重置密码",  
                    });
                });
            }else{
               this.$message({
                    type:"info",
                    message: "请选择数据进行操作",  
                }); 
            }
        },
        //查询用户
        search(){
            //默认显示在第一页
            this.handleCurrentChange(1);
            this.getData();
        },
        //选中触发事件 将表格数据传给multipleSelection空数组
        handleSelectionChange(row){
            this.multipleSelection=row;
            console.log(this.multipleSelection);
            // alert(JSON.stringify(this.multipleSelection));
        },
        //每页条数
        handleSizeChange(val){
            this.page.pageSize=val;
            this.getData();调用接口
        },
        //第几页
        handleCurrentChange(val){
            // console.log(val);
            this.page.pageNum=val;
            this.getData();
        },
        addData(){
            this.$refs.addData.openDialog(
                true,
                JSON.parse(JSON.stringify(this.multipleSelection))
            );
        },
        // editData(){
        //      this.$refs.editData.openDialog(
        //         true,
        //         JSON.parse(JSON.stringify(this.multipleSelection))
        //     );
        // },
        // 显示修改弹出框
        editData(){
            //debugger;
            //编辑判断
            if(1==this.multipleSelection.length){
                this.$refs.editData.openDialog(
                    //显示或者隐藏
                    true,
                    JSON.parse(JSON.stringify(this.multipleSelection))
                );

            }else if(this.multipleSelection.lenght>1){

                this.$message({
                    type:"info",
                    message:"请选择数据进行操作",
                })}
                else{
                    this.$message({
                        type:"info",
                         message:"请选择数据进行操作",
                    })
                }
            },
        
        //启用
        start(){
            if(this.multipleSelection.length>=1){
                this.$confirm("是否启用","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning",
                })
                .then(()=>{
                    let params={
                        userIds:[],
                        operate:"enable",
                        flag:true,
                    };
                 for(var i=0;i<this.multipleSelection.length;i++){
                     params.userIds.push(this.multipleSelection[i].userId);
                     console.log("启用"+this.multipleSelection[i].status);
                     this.Ostatus=this.multipleSelection[i].status;
                    
                     if(this.Ostatus=="启用"){
                         params.flag=false;
                     this.$message({
                         type:"error",
                         message:"状态为启用的用户，不能启用",
                     })
                     }
                 }
                 
                  params.userIds=params.userIds.join(",");
                 if(params.flag==true){
                     this.$axios
                     .put(
                         this.$store.state.url+"/backend/user/"+
                         params.operate+"/"+
                         params.userIds
                     )
                     .then((res)=>{
                         if(res.data.code==200){
                             this.getData();
                             //this.Words();
                             this.$message({
                                 showClose:true,
                                 message:res.data.msg,
                                 type:"success",
                             })
                         }
                     })
                 }
                })
            }
        },
        // 禁用
        forbid(){
            if(this.multipleSelection.length>=1){
                this.$confirm("是否禁用","提示",{
                  confirmButtonText:"确定",
                  cancelButtonText:"取消",
                  type:"warning",
                })
                .then(()=>{
                    let params={
                        userIds:[],
                        operate:"disable",
                        flag:true,
                    };
                     for(var i=0;i<this.multipleSelection.length;i++){
                     params.userIds.push(this.multipleSelection[i].userId);
                     console.log("停用"+this.multipleSelection[i].status);
                     this.Ostatus=this.multipleSelection[i].status;
                    
                     if(this.Ostatus=="停用"){
                         params.flag=false;
                     this.$message({
                         type:"error",
                         message:"状态为停用的用户，不能停用",
                     });
                     }
                 }
                     params.userIds=params.userIds.join(",");
                 if(params.flag==true){
                     this.$axios
                     .put(
                         this.$store.state.url+"/backend/user/"+
                         params.operate+"/"+
                         params.userIds
                     )
                     .then((res)=>{
                         if(res.data.code==200){
                             this.getData();
                             //this.Words();
                             this.$message({
                                 showClose:true,
                                 message:res.data.msg,
                                 type:"success",
                             });
                         }
                     });
                 }  
                })
                .catch(()=>{
                    this.$message({
                        type:"info",
                        message:"已取消停用",
                    });
                });
            }else{
                this.$message({
                    type:"info",
                    message:"请选择数据进行操作",
                });
            }
        },
        //删除
         Delete(){
            if(this.multipleSelection.length>=1){
                this.$confirm("此操作会将数据永久删除，是否继续？","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning",
                })
                .then(()=>{
                    let params={
                        userIds:[],
                      
                    };
                 for(var i=0;i<this.multipleSelection.length;i++){
                     params.userIds.push(this.multipleSelection[i].userId);             
                 }
                 
                  params.userIds=params.userIds.join(",");
               
                     this.$axios
                     .delete(
                         this.$store.state.url+"/backend/user/delete/"+
                         params.userIds
                     )
                     .then((res)=>{
                         if(res.data.code==200){ 
                         this.$message({
                         type:"success",
                         message:res.data.msg,
                     });
                             this.getData();
                         }else{
                             //this.Words();
                             this.$message({
                                //  showClose:true,
                                type:"error",
                                 message:res.data.msg,
                             });
                         }
                     });
                })
                .catch(()=>{
                    this.$message({
                        type:"info",
                        message:"已取消删除",
                    });
                });
            }else{
                this.$message({
                    type:"info",
                    message:"请选择数据进行操作",
                });
            }
        },
        //查询用户
       search(){
       this.handleCurrentChange(1);
       this.getData();
        },
        //查询数据列表
        getData(){
           this.$axios
           .get(
               this.$store.state.url +
               "/backend/user/list?"+
               "pageNum="+
               this.page.pageNum+
               "&pageSize="+
               this.page.pageSize+
               "&searchValue="+
               //搜索框内输入的请求数据 绑定的内容
               this.inform.name
           )
           .then((res)=>{
               if(200== res.data.code){
                   //从后端请求数据
                   this.tableData=res.data.rows;
                   this.page.total=res.data.total;
                   //数字转文字
                   this.Words();
                   this.$message({
                       showClose:true,
                       message:"查询成功",
                       type:"success",
                   });
               }else{
                   this.$message({
                       showClose:true,
                       message:res.data.msg,
                       type:"error",
                   });
               }
           });
        },
       
        //后台数字在前台转换为文字
        // tableData后台返回的数据
        Words(){
            for(let i=0;i<this.tableData.length;i++){
                if(this.tableData[i].status==1){
                    this.tableData[i].status="停用";
                }
                else if(this.tableData[i].status==0){
                    this.tableData[i].status="启用";
                }
                if(this.tableData[i].sex==0){
                    this.tableData[i].sex="男";
                }
                else if(this.tableData[i].sex==1){
                    this.tableData[i].sex="女";
                }
            }
        },
        //启用
        // start(){
        //     if(this.multipleSelection.length>=1){
        //         this.$confirm("是否启用","提示",{
        //             confirmButtonText:"确定",
        //             cancelButtonText:"取消",
        //             type:"warning",
        //         })
        //     }
        // },
        //选中触发事件
        // handleSelectionChange(row){},
    },

};
</script>
<style scoped>
.user{
    margin:10px;
}
.box-card{
    height: 120px;
    margin-bottom: 10px;
    overflow: visible;
}
.name{
    width: 200px;
    position: relative;
    top:15px;
    height: 100px;
    left:-40px;
    margin-right:80px;
}
.nameBtn
{
    width: 200px;
    height: 20px;
    margin-top:15px;
}

.addBtn,
.resetBtn{
    position: relative;
    left:50px;
    top:15px;
    margin-right:50px;
}
.firPass,
.secPass{
    width: 200px;
    position: relative;
}
</style>