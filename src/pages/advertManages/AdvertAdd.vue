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
        <el-form-item label="广告标题" prop="title">
          <el-input class="input-txt" v-model="addInfo.title"></el-input>
        </el-form-item>
        <el-form-item label="广告内容" prop="content">
          <el-input class="input-txt" v-model="addInfo.content"></el-input>
        </el-form-item>
        <el-form-item label="奖励积分" prop="points">
          <el-input class="input-txt" v-model="addInfo.points"></el-input>
        </el-form-item>
        <el-form-item label="图片地址" prop="imgUrl">
          <el-upload
            ref="uploads"
            :action="upLoadUrl"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :before-upload="beforeUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="BigdialogVisible" :modal-append-to-body="false">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>

        <el-form-item label="广告排序" prop="sortNo">
          <el-input class="input-txt" v-model="addInfo.sortNo"></el-input>
        </el-form-item>
        <el-button
          class="btn"
          @click="
            dialogVisible = false;
            resetForm('addInfo');
          "
          >取消</el-button
        >
        <el-button type="primary" @click="addData('addInfo')">保存</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script scoped>
export default {
  data() {
    return {
      upLoadUrl: this.$store.state.url + "/common/upload",
      dialogImageUrl: "",
      uploads:"",
      dialogVisible: false,
      BigdialogVisible:false,
      fileList: [],
      dialogImg: "",
      imageUrl: "",
      addInfo: {
        title: "",
        content: "",
        points: "",
        imgUrl: "",
        sortNo: "",
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入正确的标题",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "请输入广告内容",
            trigger: "blur",
          },
        ],
        points: [
          {
            required: true,
            message: "请输入奖励积分",
            trigger: "blur",
          },
        ],
        imgUrl: [
          {
            message: "请上传正确的图片",
            trigger: "blur",
          },
        ],
        sortNo: [
          {
            required: true,
            message: "请输入排序",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    openDialog(flag) {
      this.dialogVisible = flag;
      this.$nextTick(() => {
        this.$refs.addInfo.resetFields();
      });
    },
    // 上传之前校验图片
    beforeUpload(file) {
      // console.log(file);
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      var imgSize = file.size / 1024 / 1024;
      console.log(testmsg);
      if (testmsg != "png" && testmsg != "jpg") {
        this.$message({
          message: "只能上传jpg、png格式",
          type: "error",
        });

        // 延时器，清空
        setTimeout(() => this.$refs.uploads.clearFiles(), 1000);
      } else if (testmsg < 10) {
        this.$message({
          message: "上传文件不能超过10M",
          type: "error",
        });
        setTimeout(() => this.$refs.uploads.clearFiles(), 1000);
      } else {
        let fd = new FormData();
        fd.append("file", file); //传文件
        console.log(fd);
        this.$axios({
          method: "post",
          url: this.upLoadUrl,
          data: fd,
        }).then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.dialogImageUrl = res.data.fileName;
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "success",
            });
            // setTimeout(() => this.$refs.uploads.clearFiles(), 8000);
          }
        });
      }
    },

    // 文件列表移出时的钩子
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.BigdialogVisible = true;
    },

    addData(forName) {
      this.$refs[forName].validate((valid) => {
        if (valid) {
          console.log(this.dialogImageUrl);
          let params = {
            title: this.addInfo.title,
            content: this.addInfo.content,
            imgUrl: this.dialogImageUrl,
            points: this.addInfo.points,
            sortNo: this.addInfo.sortNo,
          };
          this.$axios
            .post("/backend/advertisement/create", params)
            .then((res) => {
              if (200 == res.data.code) {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "success",
                });

                this.$parent.getData();
                this.dialogVisible = false;
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "error",
                });
              }
            });
        } else {
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>