<template>
    <div class="view">
    <!-- 查询用户 -->
    <el-card class="box-card">
        <el-form :model="inform" style="display:inline-block" ref="inform" label-width="100px" :rules="rule1">
            <el-form-item  prop="name" class="name">
                <el-input v-model="inform.name" class="nameBtn" placeholder="提交人/意见标题">
                </el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="search()" class="addBtn">查询</el-button>
        <el-button @click="resetForm('inform')" class="resetBtn">重置</el-button>
    </el-card>
    <!-- 用户列表 -->
    <el-card>
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
    
    </div>
</template>
<script>
import SiruiTable from "../../components/SiruiTable/index";

export default {
    name:'ViewManages',
    components : {
        SiruiTable,
       
       
    },
    data(){
        var checkName = (rule, value, callback) => {
            var userName = /^[a-zA-Z][a-zA-Z0-9]{3,15}$/;
            var email =/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.(a-zA-Z]{2,4})$/;
            var name= /^([\*\"\'<>\/])+/;
            setTimeout(()=>{
                if (
                   !email.test(value)&&
                   !userName.test(value)&&
                   !phone.test(value)
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
                {prop:"sortNo",label:"编号",width:100,num:1 },
                {prop:"createBy",label:"提交人",width:180,num:2},
                {prop:"title",label:"意见标题",width:180,num:3},
                {prop:"content",label:"意见内容",width:180,num:4},
                {prop:"createTime",label:"提交时间",width:180,num:5},
                {prop:"delFlag",label:"删除状态",width:180,num:6},
            ],
            page:{
                pages:4,
                total:0,//共几页
                pageSize:10,//每页条数
                pageNum:1
            },
            tableData:[{
                sortNo: 1, 
                createTime: "2018-03-16 11:33:00",
                createBy: "wangdong",
                title: "优化app运行速度", 
                content: "优化appXXX模块的程序运行速度", 
                delFlag: 0
            }],
            multipleSelection:[],
            Ostatus:""
        };
    },
    
    methods: {
        //重置
        resetForm(formName){
         this.$refs[formName].resetFields();
        },
        resetPwd(){},
        //查询用户
        search(){
            //this.getData();
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
            //this.getDate();调用接口
        },
        //第几页
        handleCurrentChange(val){
            // console.log(val);
            this.page.pageNum=val;
            //this.getDate();
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
            if(1==this.multipleSelection.length){
                this.$refs.editData.openDialog(
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
        start(){},
        // 禁用
        forbid(){},
        //删除
        Delete(){},
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
}
.name,
.phone{
    width: 200px;
    top: 15px;
    position: relative;
    left:-40px;
    margin-right:80px;
}
.nameBtn
{
    width: 200px;
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