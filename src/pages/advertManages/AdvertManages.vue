<template>
    <div class="advert">
    <!-- 查询用户 -->
    <el-card class="box-card">
        <el-form :model="inform" ref="inform" style="display:inline-block" label-width="100px" :rules="rules">
            <el-form-item  prop="name" class="name">
                <el-input v-model="inform.name" class="nameBtn" placeholder="广告标题/奖励积分/图片地址">
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
         <el-table-column el-table-column 
        label="广告编号"
        :prop = 'columnList[0].prop'
        :width = 'columnList[0].width'
         ></el-table-column>
        <el-table-column 
        label='广告标题'
        :prop = 'columnList[1].prop'
        :width = 'columnList[1].width'
         ></el-table-column>
        <el-table-column 
        label='广告内容'
        :prop = 'columnList[2].prop'
        :width = 'columnList[2].width'
         ></el-table-column>
        <el-table-column 
        label='图片地址'
        :prop = 'columnList[3].prop'
        :width = 'columnList[3].width'
         >
         <template slot-scope="scope">
          <img :src="scope.row.imgUrl" style="height: 100px;width:100px;"/>
        </template>
        </el-table-column>
        <el-table-column 
        label='奖励积分'
        :prop = 'columnList[4].prop'
        :width = 'columnList[4].width'
         >
         </el-table-column>
        <el-table-column 
        label='广告状态'
        :prop = 'columnList[5].prop'
        :width = 'columnList[5].width'
         ></el-table-column>
        <el-table-column 
        label='删除状态'
        :prop = 'columnList[6].prop'
        :width = 'columnList[6].width'
         ></el-table-column>
        </sirui-table>
    </el-card>
    <!-- 新增弹出框 -->
    <Advert-add ref="addData"></Advert-add>
    <Advert-edit ref="editData"></Advert-edit>
    </div>
</template>
<script>
import SiruiTable from "../../components/SiruiTable/index";
import AdvertAdd from "../advertManages/AdvertAdd";
import AdvertEdit from "../advertManages/AdvertEdit";
export default {
   
    components : {
        SiruiTable,
        AdvertAdd,
        AdvertEdit
    },
    data(){
        var checkName = (rule, value, callback) => {
            var userName = /^[a-zA-Z][a-zA-Z0-9]{3,15}$/;
            var email =/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.(a-zA-Z]{2,4})$/;
             var phone=/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
            setTimeout(()=>{
                if (
                   !email.test(value)&&
                   !userName.test(value)&&
                   !phone.test(value)
                ){
                   callback(new Error("请输入正确的广告标题/奖励积分/图片地址"));
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
            rules:{
                name:{
                    validator:checkName
                }
            },
            columnList:[
                {num:1,name:'广告编号',prop:'id',width:100},
                {num:2,name:'广告标题',prop:'title',width:100},
                {num:3,name:'广告内容',prop:'content',width:300},
                {num:4,name:'图片地址',prop:'imgUrl',width:200},
                {num:5,name:'奖励积分',prop:'points',width:100},
                {num:6,name:'广告状态',prop:'isEnable',width:100},
                {num:7,name:'删除状态',prop:'delFlag',width:100},
            ],
            page:{
                pages:4,
                total:0,//共几页
                pageSize:10,//每页条数
                pageNum:1
            },
            tableData:[],
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
         this.handleCurrentChange(1);
         this.getData();
        },
         //查询数据列表
        getData(){
           this.$axios
           .get(
               this.$store.state.url +
               "/backend/advertisement/list?"+
               "pageNum="+
               this.page.pageNum+
               "&pageSize="+
               this.page.pageSize+
               "&searchValue="+
               this.inform.name
           )
           .then((res)=>{
               if(200== res.data.code){
                   this.tableData=res.data.rows;
                   this.page.total=res.data.total;
                   this.Words();
                   for(var i=0;i<this.tableData.length;i++){
                       this.tableData[i].imgUrl=
                       this.$store.state.url+this.tableData[i].imgUrl;
                   }
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
       
        //后台数字转换文字
        Words(){
            for(let i=0;i<this.tableData.length;i++){
                if(this.tableData[i].isEnable==1){
                    this.tableData[i].isEnable="停用";
                }
                else if(this.tableData[i].isEnable==0){
                    this.tableData[i].isEnable="启用";
                }
              
            }
        },
       
        //查询用户
        search(){
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
            this.getData();
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