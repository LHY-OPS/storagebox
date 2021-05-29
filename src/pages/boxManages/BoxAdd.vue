<template>
<div>
    <el-dialog
    :visible.sync="dialogadd"
     width="400px"
    :close-on-click-modal="false"
    @close="resetForm('addInfo')"
>
    <el-form
    :model="addInfo"
    status-icon
    :rules="rules"
    ref="addInfo"
    label-width="200px"
    class="demo-ruleForm"
    >
    <el-form-item label="箱子规格" prop="boxStandard">
            <el-input v-model="addInfo.boxStandard" autocomplete="off" width="10px" class="firPass"></el-input>
        </el-form-item>
        <el-form-item label="箱子积分单价" prop="boxUnitPrice">
            <el-input v-model="addInfo.boxUnitPrice" autocomplete="off" width="10px" class="firPass"></el-input>
        </el-form-item>
         <el-form-item label="库存数量" prop="inventoryNumber">
        <el-input v-model="addInfo.inventoryNumber" autocomplete="off" class="secPass"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
        <el-input v-model="addInfo.remark" autocomplete="off" class="secPass"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogadd = false;resetForm('addInfo')">取消</el-button>
        <el-button type="primary" @click="addData('addInfo')">保存</el-button>
    </span>
    </el-dialog>
</div>
</template>
<script>

export default{
    
    data(){
        return {
            dialogadd:false,
            addInfo:{boxStandard:"",boxUnitPrice:"",inventoryNumber:"",remark:"",},
            rules:{
                boxStandard:[
                {
                    required:true,
                    trigger:"blur",
                    pattern:/\d+\*\d+\*\d+/,
                    message:
                    "箱子规格格式错误",
                    trigger:"blur"
                }
            ],
            boxUnitPrice:[
                {
                    required:true,
                    trigger:"blur",
                    // pattern:/^([\u4e00-\u9fa5]){2,7}$/,
                    message:"所需积分不能为空",
                    trigger:"blur"
                }
            ],
            inventoryNumber:[
                {
                    required:true,
                    // pattern:/^([0-9]\d*(\.\d+)?)$/g,
                    message:"数量不能小于0或为空",
                    trigger:"blur"
                }
            ],
            remark:[
                {
                    required:true,
                    message:"备注不能为空",
                    trigger:"blur"
                }
            ],
           
        }
    };
    },
    methods:{
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        openDialog(flag,val){
            this.dialogadd = flag;
            this.$nextTick(() =>{
                //修改数据后用此方法可立即获得更新后的数据
                this.$refs.addInfo.resetFields();
            });
        },
        addData(formName){
            this.$refs[formName].validate(valid =>{
                if(valid){
                    let pamars={
                        boxStandard:this.addInfo.boxStandard,
                        boxUnitPrice:this.addInfo.boxUnitPrice,
                        inventoryNumber:this.addInfo.inventoryNumber,
                        remark:this.addInfo.remark,
                        
                    };
                    this.$axios.post("/backend/box/standard/create",pamars)
                    .then((res)=>{
                        if(200 == res.data.code){
                            this.$message({
                                showClose:true,
                                message:res.data.msg,
                                type:"success",
                            });
                            // this.$parent.getData();

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
<style scoped>
.demo-ruleForm{
    position: relative;
    left: -70px;
}
</style>
