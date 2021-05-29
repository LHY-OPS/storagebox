<template>
<div>
      <!-- :visible指的是属性绑定，表示弹框的显示隐藏，当:visible的值为ture的时候，弹框显示，当为false的时候，弹框隐藏 -->
      <!-- close-on-click-modal 是否可以通过点击modal关闭dialog-->
      <!-- 只要想要在Vue中直接操作DOM元素，就必须用ref属性进行注册; -->
      <!-- autocomplete自动补全 -->
      <!-- prop属性设置需要校验的字段名 -->
      <!-- placeholder 属性提供可描述输入字段预期值的提示信息（hint）。
        该提示会在输入字段为空时显示，并会在字段获得焦点时消失。 -->
        <!-- :rules="rules"给表单统一设置验证规则 -->
        <!--   1.只有一条时，el-from-item 的属性rules绑定的变量的值为一个对象，对象中规定验证规则
        2.有多条时，el-from-item 的属性rules绑定的变量的值为一个对象数组，数组中的每一个对象元素都对应一条验证规则 -->


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
    <el-form-item label="用户名" prop="userName">
            <el-input v-model="addInfo.userName" autocomplete="off" width="10px" class="firPass"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
            <el-input v-model="addInfo.name" autocomplete="off" width="10px" class="firPass"></el-input>
        </el-form-item>
    <el-form-item label="邮箱" prop="email">
        <el-input v-model="addInfo.email" autocomplete="off" class="secPass"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="phone">
        <el-input v-model="addInfo.phone" autocomplete="off" class="secPass"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
        <el-select v-model="addInfo.sex" placeholder="请选择" class="selected">
            <el-option label="男" value="0"></el-option>
            <el-option label="女" value="1"></el-option>
        </el-select>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogadd = false;resetForm('addInfo')">取消</el-button>
        <!-- 保存的时候调用接口 -->
        <el-button type="primary" @click="addData('addInfo')">保存</el-button>
    </span>
    </el-dialog>
</div>
</template>
<script>

export default{
     name:'useradd',
    data(){
        
// 因为不使用return包裹的数据会在项目的全局可见，会造成变量污染
// 使用return包裹后数据中变量只在当前组件中生效，不会影响其他组件。
        return {
            dialogadd:false,
            addInfo:{userName:"",name:"",email:"",sex:"",phone:"",},
            rules:{
                userName:[
                {
                    required:true,
                    trigger:"blur",
                    pattern:/^([\w\@.]{1,14})$/g,
                    message:
                    "请输入正确的用户名:不能是纯数字,只能是数字,字母_@.区分大小写，1-14个字符",
                    trigger:"blur"
                }
            ],
            name:[
                {
                    required:true,
                    trigger:"blur",
                    pattern:/^([\u4e00-\u9fa5]){2,7}$/,
                    message:"请输入正确的名字",
                    trigger:"blur"
                }
            ],
            sex:[
                {
                    required:true,

                    message:"性别不能为空",
                    trigger:"blur"
                }
            ],
            email:[
                {
                    required:true,
                    pattern:/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
                    message:"请输入正确的邮箱",
                    trigger:"blur"
                }
            ],
            phone:[
                {
                    required:true,
                    min:11,
                    max:11,
                    pattern:/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
                    message:"请输入正确的手机号",
                    trigger:"blur"
                }
            ]
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
       
           
// $refs是在上面注册过的组件实例
// 会形成一个数组
// ref在form上面注册的
// 通过传参找到这个实例，然后调用validate这个方法
// 提交表单
            addData(formName){
            this.$refs[formName].validate(valid =>{
                if(valid){
                    //定义一个对象进行传值
                    let pamars={
                        //获取表单输入的内容
                        userName:this.addInfo.userName,
                        nickName:this.addInfo.name,
                        phonenumber:this.addInfo.phone,
                        email:this.addInfo.email,
                        sex:this.addInfo.sex,
                    };
                    this.$axios
                    .post(this.$store.state.url+"/backend/user/create",pamars)
                    .then((res)=>{
                        if(200 == res.data.code){
                            this.$message({
                                showClose:true,
                                message:res.data.msg,
                                type:"success",
                            });
                            // 调用查询的数据
                            this.$parent.getData();
                            // 关闭窗口
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
