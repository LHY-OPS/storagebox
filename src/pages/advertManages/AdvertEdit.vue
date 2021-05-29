<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      class="dialog1"
      :close-on-click-modal="false"
      @close="resetForm('editInfo')"
    >
      <el-form
        :model="editInfo"
        :rules="rules"
        label-width="140px"
        class="form1"
        ref="editInfo"
      >
        <el-form-item label="广告标题" prop="title">
          <el-input class="input-txt" v-model="editInfo.title"></el-input>
        </el-form-item>
        <el-form-item label="广告内容" prop="content">
          <el-input class="input-txt" v-model="editInfo.content"></el-input>
        </el-form-item>
        <el-form-item label="奖励积分" prop="points">
          <el-input class="input-txt" v-model="editInfo.points"></el-input>
        </el-form-item>
         <el-form-item label="原地址">
          <el-image style="width: 100px;height: 100px" :src="beforeImgUrl">
          </el-image>
        </el-form-item>
        <el-form-item label="图片地址" prop="imgUrl">
          <el-upload
            class="avatar-uploader"
             ref="uploads"
            :action="upLoadUrl"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :before-upload="beforeUpload"
          >
           <i class="el-icon-plus"></i>
            <!-- <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
          </el-upload>
          <el-dialog :visible.sync="BigdialogVisible" :modal-append-to-body="false">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="广告排序" prop="sortNo">
          <el-input class="input-txt" v-model="editInfo.sortNo"></el-input>
        </el-form-item>

        <el-button class="btn" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editData('editInfo')">确定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
 
  data() {
    return {
      upLoadUrl: this.$store.state.url + "/common/upload",
      uploads:"",
      dialogImageUrl: "",
      // dialogEdit:false,
      BigdialogVisible:false,
      dialogVisible: false,
      beforeImgUrl:"",
       fileList: [],
      editInfo: {
        id:"",
        title: "",
        content: "",
        points: "",
        imgUrl: "",
        sortNo: "",
        version:"",
      },

      rules: {
        title: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        points: [
          {
            required: false,
            trigger: "blur",
          },
        ],
        imgUrl: [
          {
            required: false,
            trigger: "blur",
          },
        ],
        adverSort: [
          {
            required: true,
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
    openDialog(flag, val) {
      this.dialogVisible = flag;
      this.beforeImgUrl=val[0].imgUrl;
      console.log(this.beforeImgUrl);
      this.$nextTick(() => {
        console.log(val);
        this.$refs.editInfo.resetFields();
         this.editInfo.id = val[0].id;
        this.editInfo.title = val[0].title;
        this.editInfo.content = val[0].content;
        this.editInfo.points = val[0].points;
        this.editInfo.imgUrl = val[0].imgUrl;
        this.editInfo.sortNo = val[0].sortNo;
        this.editInfo.version = val[0].version;
      });
    },
     editData(forName) {
      this.$refs[forName].validate((valid) => {
        if (valid) {
          console.log(this.dialogImageUrl);
          let params = {
            id: this.editInfo.id,
            title: this.editInfo.title,
            content: this.editInfo.content,
            imgUrl: this.dialogImageUrl,
            points: this.editInfo.points,
            sortNo: this.editInfo.sortNo,
            version: this.editInfo.version,
          };
          this.$axios
            .post("/backend/advertisement/update", params)
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

    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
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
  },
};
</script>

<style scoped>
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