<template>
  <div class="header">
    <!-- header头部  v-model和form里面的字段需要和需求文档里一致-->
    <div class="systemTitle">储留箱后台管理系统</div>
    <div class="user_active">
      <img src="../assets/头像.png" />
      <!-- 用户下拉菜单 -->
      <el-dropdown @command="handleCommand" trigger="click">
        <span class="el-dropdown-link">
          {{ username }}
          <i class="el-icon-arrow-down"></i>
        </span>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="updatePW" @click="dialogVisible = true"
            >修改密码</el-dropdown-item
          >
          <el-dropdown-item command="quiteLogin" >退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 修改密码框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="400px"
      :close-on-click-modal="false"
      @close="resetForm('ruleForm')"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码" prop="oldPW">
          <el-input
            type="password"
            v-model="ruleForm.oldPW"
            autocomplete="off"
            width="10px"
            class="firPass"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPW">
          <el-input
            type="password"
            v-model="ruleForm.newPW"
            autocomplete="off"
            class="secPass"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="sureForm('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      var oldPW = /^[a-zA-Z0-9]{3,15}$/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (!oldPW.test(value)) {
          callback(new Error("请输入正确的密码"));
        }
        callback;
      }
    };
    return {
      username:"",
      dialogVisible: false,
      //name: "chenxiangyu",
      ruleForm: {
        oldPW: "",
        newPW: "",
        age:"",
      },
      rules: {
        oldPW: [{ require: true, validator: validatePass, trigger: "blur" }],
        newPW: [{ require: true, validator: validatePass, trigger: "blur" }],
      },
    };
  },
  mounted(){
    this.username = localStorage.getItem("username");

  },
  methods: {
    handleCommand(command) {
      if (command == "updatePW") {
        this.dialogVisible = true;
      }
      if (command == "quiteLogin") {
        this.$router.push("/");
        let PersonParms = {};
        this.$axios.post(this.$store.state.url + "/common/logout",PersonParms)
        .then((res) =>{
          if(200 == res.data.code) {
            this.$message({
              showClose:true,
              message:res.data.msg,
              type:"success",
            });
          }

        });

      }
    },

    resetForm(formName){
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },

    //修改密码
    sureForm(formName){
      this.$refs[formName].validate((valid) =>{
        if(valid){
          this.$$axios
            .put(this.$store.state.url + 
            "/backend/home/updatePassword/"+
            this.ruleForm.oldPW + 
            "/" +
            this.ruleForm.newPW)
            .then((res) =>{
              if(res.data.code == 200){
                // this.getData();
                this.$message({
                    showClose:true,
                    type:"success",
                    message: res.data.msg,  
                });
            }else if(res.data.code == 500){
                this.$message({
                  showClose:true,
                  type:"error",
                  message: res.data.msg,
                    
                });
            }
            });
            this.dialogVisible = false;
            this.$refs[formName].resetFields();

        }
      });
    }
  },
};
</script>
<style>
.header {
  position: absolute;
  box-sizing: border-box;
  top: Opx;
  width: 100%;
  height: 50px;
  background-color: rgb(255, 255, 255);
  padding-left: 20px;
  border-bottom: 1px solid#dadfe7;
}
.systemTitle {
  color: #116dbf;
  font-size: 30px;
  line-height: 60px;
  font-weight: bold;
}
.user_active {
  display: block;
  position: absolute;
  right: 60px;
  top: 0;
}
.el-dropdown-link {
  cursor: pointer;
  position: relative;
  top: -25px;
  right: 0px;
}
</style>