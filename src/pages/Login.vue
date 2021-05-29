<template>
  <div class="bg" id="Login">
    <div class="head">
      <span class="logo">LOGO</span>
    </div>

    <div class="box">
      <div class="box-left">
        <span class="box-left-title">储留箱后台管理系统</span>
        <span class="box-left-text"
          >STORAGE BOX BACKGROUND MANZGEMENT SYSTEM</span
        >
      </div>

      <div class="box-right">
        <div class="WEL">
          <div class="welcome">欢迎登陆</div>
          <div class="name">储留箱后台管理系统</div>
        </div>

        <!-- ref一般写在el-form中，以作为验证表单时使用 ,rules验证是对model对象的验证  prop属性设置需要校验的字段名 -->
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item prop="username" class="username">
            <el-input v-model="form.username" placeholder="请输入用户名">
              <template slot="prepend">
                <img src="../assets/yonghu-2.png" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" class="password">
            <el-input
              placeholder="请输入密码"
              v-model="form.password"
              type="password"
            >
              <template slot="prepend">
                <img src="../assets/mima-2.png" />
              </template>
            </el-input>
          </el-form-item>
          <el-button
            type="primary"
            @click="submitForm('form')"
            class="login-btn"
            >登录</el-button
          >
          <a href="#" class="help" @click="help">忘记密码？请求帮助</a>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    var checkUserName = (rule, value, callback) => {
      var userName = /^[a-zA-Z][a-zA-Z0-9]{2,15}$/;
      var idCard = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
      var phone = /^1[3456789]\d{9}$/;
      // var userName=/^[a-zA][a-zA-Z0-9]{2,15}$/;
      // var idCard=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1]\d{3}$)/;
      // var phone=/^1[3456789]\d{9}$/;
      if (!value) {
        callback(new Error("请输入用户名/手机号/身份证号"));
      }
      setTimeout(() => {
        if (
          !idCard.test(value) &&
          !userName.test(value) &&
          !phone.test(value)
        ) {
          callback(new Error("请输入正确的用户名/手机号/邮箱"));
        } else {
          callback();
        }
      }, 100);
    };
    return {
      userType: "01",
      form: {
        username: "",
        password: "",
      },
      loginUrl: "http://localhost:8081/common/login",
      getLoginInfo: "http://localhost:8081/common/getLoginInfo",
      role: "",
      rules: {
        username: [
          { required: true, validator: checkUserName, trigger: "blur" },
        ],
        password: [
          {
            required: true,
            message: "请输入正确的密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    help: function () {},
    submitForm: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$router.push({ path: "/usermanages" });
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    // 清除登录人信息
    localStorage.clear();
  },
  methods: {
    // 获取登录人信息接口
    loginPerson() {
      let PersonParms = {};
      this.$axios.get(this.getLoginInfo, PersonParms).then((res) => {
        if (200 == res.data.code) {
          this.role = res.data.roles[0];
          if (this.role == "app") {
            this.$router.push("/");
            this.$message({
              showClose: true,
              message: "用户为手机端用户，无法登陆",
              type: "error",
            });
          } else if (this.role == "admin") {
            this.$router.push("/");
            this.$message({
              showClose: true,
              message: "用户为测试用户，无法登陆",
              type: "error",
            });
          }
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "success",
          });
        } else if (500 == res.data.code) {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error",
          });
        }
      });
    },
    // 忘记密码
    help() {
      this.$alert("请联系管理员13234567821", "忘记密码", {
        confirmButtonText: "确定",
        callback: (action) => {
          this.$message({
            type: "info",
            message: `action: ${action}`,
          });
        },
      });
    },

    // 登录
    submitForm(formName) {
      console.log(this.$refs[formName].validate);
     
// $refs是在上面注册过的组件实例 会形成一个数组
// 通过传参找到这个实例，然后调用validate这个方法

      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(valid);
          //定义一个对象 将这个对象传参取参数 key,value的值传递
          let paramForm = {
            username: this.form.username,
            password: this.form.password,
            userType: this.userType,
          };
          this.$axios.post(this.loginUrl, paramForm).then((res) => {
            if (200 == res.data.code) {
              this.loginPerson();
              console.log(res.data);
              localStorage.setItem("username", paramForm.username);
              localStorage.setItem("token", res.data.token); //存返回的token值
              console.log("******************");
              this.$router.push("/ordermanages");
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: "success",
              });
            } else if (500 == res.data.code) {
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: "error",
              });

              this.form.username = "";
              this.form.password = "";
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
#Login {
  position: relative;
  width: 100%;
  height: 930px;
  background: url(../assets/bg2.png) bottom left;
  overflow: hidden;
}
.logo {
  font-size: 40px;
  color: white;
  font-weight: bold;
  margin-top: 41px;
  display: block;
  margin-left: 20px;
}
.box {
  width: 904px;
  height: 404px;
  /* background: pink; */
  margin: 148px auto 0px;
  position: relative;
  /* top:150px;
  left:20%; */
}
.box-left {
  background: rgb(247, 244, 244, 0.1);
  width: 452px;
  height: 404px;
  float: left;
  border-radius: 10px;
}
.box-right {
  background: white;
  width: 452px;
  height: 404px;
  position: absolute;
  right: 0px;
  border-radius: 10px;
}
.box-left-title {
  color: white;
  font-size: 30px;
  position: absolute;
  top: 100px;
  left: 70px;
}
.box-left-text {
  font-size: 12px;
  color: white;
  position: absolute;
  top: 160px;
  left: 50px;
}
.help {
  position: relative;
  font-size: 13px;
  top: 230px;
  left: -80px;
}
.welcome {
  font: 25px bold;
  position: absolute;
  top: 30px;
  left: 42px;
}
.WEL {
  display: block;
}
.name {
  font-size: 18px;
  color: #878787;
  position: absolute;
  top: 85px;
  left: 42px;
}
.username {
  position: relative;
  left: 0px;
  top: 150px;
  width: 350px;
}
.password {
  margin-top: 20px;
  position: relative;
  left: 0px;
  top: 160px;
  width: 350px;
}
.login-btn {
  width: 250px;
  height: 40px;
  position: relative;
  font-size: 15px;
  top: 180px;
  left: 90px;
}
</style>
