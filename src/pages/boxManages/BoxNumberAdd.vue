<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      class="dialog1"
      :close-on-click-modal="false"
      @close="resetForm('addInfo')"
    >
      <el-form
        :model="addInfo"
        :rules="rules"
        label-width="140px"
        class="form1"
        ref="addInfo"
      >
        <el-form-item label="箱子规格" prop="boxStandard">
            <el-select v-model="addInfo.boxStandard"
            @change="jifen()"
             placeholder="请选择" 
             class="input-txt">
                <el-option 
                v-for="item in options" 
                :value="item.boxStandard"
                 :key="item.value" 
                 :label="item.boxStandard">

                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="所需积分" prop="boxUnitPrice">
          <el-input class="input-txt" v-model="addInfo.boxUnitPrice"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input class="input-txt" v-model="addInfo.remark"></el-input>
        </el-form-item>
        
        <el-button
          class="btn"
          @click="
            dialogVisible = false;
            resetForm('addInfo');
          "
          >取消</el-button
        >
        <el-button type="primary" @click="addData('addInfo')">确定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script scoped>
export default {
  name:"boxnumberadd",
  data() {
    var checkStandard = (rules, value, callback) => {
         var boxStandard = /\d+\*\d+\*\d+/;
         if(!value){
             callback(new Error("请输入箱子规格"));
         }setTimeout(()=>{
             if(!boxStandard.test(value)){
                 callback(new Error("请输入正确的箱子规格"))
             }else{
                 callback();
             }
         },100)
    };
    var checkNum = (rules, value, callback) => {
        var phoneNum = /^([0-9]\d*(\.\d+)?)$/g;
         if(!value){
             callback(new Error("请输入箱子数量"));
         }setTimeout(()=>{
             if(!phoneNum.test(value)){
                 callback(new Error("请输入正确的箱子数量"))
             }else{
                 callback();
             }
         },100)
    };
    return {
      dialogVisible: false,
      options:[],
      addInfo: {
        boxStandard: "",
        boxUnitPrice: "",
        remark: "",
              },
      
      rules: {
        boxStandard: [
          {
            required: true,
            validator: checkStandard,
            trigger: "blur",
          },
        ],
        totalNumber: [
          {
            required: true,
            validator: checkNum,
            trigger: "blur",
          },
        ],
        boxUnitPrice: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        remark: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        sex: [
          {
            required: true,
            trigger: "blur",
          },
        ],
      },
    };
  },
   mounted(){         
            this.standardDown();
        },
  methods: {
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
    //积分
    jifen(){
      for(var i in this.options){
       if(this.options[i].boxStandard==this.addInfo.boxStandard){
         this.addInfo.boxUnitPrice = this.options[i].boxUnitPrice;
       }
      }
    },
     //查询用户
    search() {
        this.handleCurrentChange(1);
      this.getData();
      this.standardDown();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    openDialog(flag) {
      this.dialogVisible = flag;
      this.$nextTick(() => {
        this.$refs.addInfo.resetFields();
      });
    },
    addData(formName){
            this.$refs[formName].validate(valid =>{
                if(valid){
                    let pamars={
                        boxStandard:this.addInfo.boxStandard,
                        boxUnitPrice:this.addInfo.boxUnitPrice,
                        remark:this.addInfo.remark,                       
                    };
                    this.$axios.post("/backend/box/info/create",pamars)
                    .then((res)=>{
                        if(200 == res.data.code){
                            this.$message({
                                showClose:true,
                                message:res.data.msg,
                                type:"success",
                            });
                            this.$parent.getData();
                            this.dialogadd=false;
                        }else{
                            this.$message({
                                showClose:true,
                                message:res.data.msg,
                                type:"error",
                            });
                        }
                    });
                    
                } else{
                    console.log("error submit!!");
                    return false;
                } 
            });
        },
  },
};
</script>

<style>
.input-txt {
  width: 181px;
}
.diglog1 {
  width: 400px;
}
.el-dialog {
  width: 450px;
}
.btn {
  margin-left: 240px;
  margin-top: 70px;
}
</style>