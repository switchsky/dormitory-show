
<template>
  <div class="logincontainer">
    <el-form
      class="loginform"
      :model="addModel"
      ref="loginForm"
      :rules="rules"
      :inline="false"
      size="medium"
    >
      <el-form-item>
        <span class="loginTitle">高校宿舍管理系统</span>
      </el-form-item>
      <el-form-item prop="username">
        <el-input
          v-model="addModel.username"
          placeholder="请输入账户"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="addModel.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="userType">
        <el-radio-group v-model="addModel.userType">
          <el-radio :label="0">学生</el-radio>
          <el-radio :label="1">管理员</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-button class="loginbtn" type="primary" @click="onSubmit"
              >登录</el-button
            >
          </el-col>
          <el-col :span="12" :offset="0">
            <el-button class="loginbtn">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表单数据
      addModel: {
        username: "",
        password: "",
        userType: "",
      },
      //表单验证规则
      rules: {
        username: [
          {
            trigger: "change",
            required: true,
            message: "请输入账户",
          },
        ],
        password: [
          {
            trigger: "change",
            required: true,
            message: "请输入密码",
          },
        ],
        userType: [
          {
            trigger: "change",
            required: true,
            message: "请选择用户类型",
          },
        ],
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch('user/login', this.addModel).then(() => {
            //登录成功
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          })
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.logincontainer {
  height: 100%;
  background: #fff;
  background-image: url("../../assets/images/login_bg.png");
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: 100% 100%;
  .loginform {
    height: 350px;
    width: 450px;
    background: #fff;
    padding: 35px 20px;
    border-radius: 10px;
    .loginTitle {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #409eff;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .loginbtn {
      width: 100%;
    }
  }
}
</style>