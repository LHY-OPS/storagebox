<template>
  <div class="box">
    <!-- 查询用户 -->
    <el-card class="box-card">
      <el-form
        :model="inform"
        ref="inform"
        style="display: inline-block; width: 700px;margin-top:15px"
        label-width="100px"
        :rules="rule1"
      >
        <el-form-item label="箱子规格" style="display: inline-block; margin: 0">
          <el-select v-model="value" placeholder="请选择" class="nameBtn1">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.boxStandard"
              :value="item.boxStandard"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="search()" class="addBtn"
        >查询</el-button
      >
      <el-button @click="resetForm('inform')" class="resetBtn">重置</el-button>
    </el-card>
    <!-- 用户列表 -->
    <el-card>
      <el-button type="primary" @click="addData()">新增</el-button>
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
        <el-table-column type="selection" width="55px"></el-table-column>
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
    <Box-add ref="addData"></Box-add>
   
  </div>
</template>
<script>
import SiruiTable from "../../components/SiruiTable/index";
import BoxAdd from "../boxManages/BoxAdd";

export default {
  name: "boxmanages",
  components: {
    SiruiTable,
    BoxAdd,
  
  },
  data() {
    var checkName = (rule, value, callback) => {
      var userName = /^[a-zA-Z][a-zA-Z0-9]{3,15}$/;
      var email = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.(a-zA-Z]{2,4})$/;
      var name = /^([\*\"\'<>\/])+/;
      setTimeout(() => {
        if (
          !email.test(value) &&
          !userName.test(value)
          //    !phone.test(value)
        ) {
          callback(new Error("请输入正确的客户名/手机号/邮箱"));
        } else {
          callback();
        }
      }, 100);
    };
    return {
      options:[],
      value: "",
      tableHeight: 400,
      load: false,
      dialogVisible: false,
      pwdForm: {
        pass: "",
        checkPass: "",
      },
      inform: {
        name: "",
      },
      rule1: {
        name: {
          validator: checkName,
        },
      },
      columnList: [
        { prop: "boxStandard", label: "箱子规格", width: 100, num: 1 },
        { prop: "totalNumber", label: "总数量", width: 180, num: 2 },
        { prop: "usedNumber", label: "已用数量", width: 180, num: 3 },
        { prop: "inventoryNumber", label: "库存", width: 180, num: 4 },
        { prop: "useRatio", label: "使用比例", width: 180, num: 5 },
        { prop: "boxUnitPrice", label: "所需积分", width: 180, num: 6 },
      ],
      page: {
        pages: 4,
        total: 0, //共几页
        pageSize: 10, //每页条数
        pageNum: 1,
      },
      tableData: [],
      multipleSelection: [],
      Ostatus: "",
    };
  },
 mounted(){         
            this.standardDown();
            this.getData();
        },
  methods: {

    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.handleCurrentChange(1);
      // this.getData();
    },
    resetPwd() {},
    //查询用户
    search() {
        this.handleCurrentChange(1);
      this.getData();
      this.standardDown();
    },
    //箱子规格下拉列表
    standardDown(){
      this.$axios
      .get("/backend/box/standard/select")
      .then((res)=>{
        if(res.data.code==200){
      
          this.options=res.data.data;
        }else{
          this.$message({
            showClose:true,
            message:res.data.msg,
            type:"error",
          });
        }
      });
    },
    //选中触发事件 将表格数据传给multipleSelection空数组
    handleSelectionChange(row) {
      this.multipleSelection = row;
      console.log(this.multipleSelection);
      // alert(JSON.stringify(this.multipleSelection));
    },
    //每页条数
    handleSizeChange(val) {
      this.page.pageSize = val;
      //this.getData();调用接口
    },
    //第几页
    handleCurrentChange(val) {
      // console.log(val);
      this.page.pageNum = val;
      // this.getData();
    },
    addData() {
      this.$refs.addData.openDialog(
        true,
        JSON.parse(JSON.stringify(this.multipleSelection))
      );
    },
   
    editData() {
      //debugger;
      if (1 == this.multipleSelection.length) {
        this.$refs.editData.openDialog(
          true,
          JSON.parse(JSON.stringify(this.multipleSelection))
        );
      } else if (this.multipleSelection.lenght > 1) {
        this.$message({
          type: "info",
          message: "请选择数据进行操作",
        });
      } else {
        this.$message({
          type: "info",
          message: "请选择数据进行操作",
        });
      }
    },
 //查询数据列表
        getData(){
           this.$axios
           .get(
               this.$store.state.url +
               "/backend/box/standard/list?"+
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
                   console.log(res.data.rows);
                   this.page.total=res.data.total;
                  //  this.Words();
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
       
    //启用
    start() {},
    // 禁用
    forbid() {},
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
                        ids:[],
                      
                    };
                 for(var i=0;i<this.multipleSelection.length;i++){
                     params.ids.push(this.multipleSelection[i].id);             
                 }
                 
                  params.ids=params.ids.join(",");
               
                     this.$axios
                     .delete(
                         this.$store.state.url+"/backend/box/standard/delete/"+
                         params.ids
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
  },
};
</script>
<style scoped>
.box {
  margin: 10px;
}
.box-card {
  height: 120px;
  margin-bottom: 10px;
}

.name1 {
  width: 200px;
  top: 15px;
  position: relative;
  left: -40px;
  font-size: 20px;
  margin-right: 80px;
}
.nameBtn1 {
  width: 200px;
}

.addBtn,
.resetBtn {
  position: relative;
  left:-350px;
  margin-right: 50px;
}
.firPass,
.secPass {
  width: 200px;
  position: relative;
}
</style>