
<template>
  <div class="logincontainer">
    <el-form
      ref="loginForm"
      class="loginform"
      :model="addModel"
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
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="addModel.password"
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input
          v-model="addModel.captcha"
          placeholder="请输入验证码"
        />
      </el-form-item>

      <el-form-item prop="token">
        <el-input
          v-model="addModel.token"
          style="display:none"
          placeholder=""
        />
      </el-form-item>

      <el-form-item prop="userType">
        <el-radio-group v-model="addModel.userType">
          <el-radio :label="0">学生</el-radio>
          <el-radio :label="1">管理员</el-radio>
        </el-radio-group>
        <img class="verifyCodeImg" alt="无法显示图片" :src="imgUrl" @click="resetImg()" @onload="generate()">
      </el-form-item>
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-button
              class="loginbtn"
              type="primary"
              @click="onSubmit"
            >登录</el-button>
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
import {
  getPic
} from '@/api/user'

export default {
  data() {
    return {
      // 表单数据
      addModel: {
        username: '',
        password: '',
        captcha: '',
        token: '',
        userType: ''
      },
      imgUrl: '',
      // 表单验证规则
      rules: {
        username: [
          {
            trigger: 'change',
            required: true,
            message: '请输入账户'
          }
        ],
        password: [
          {
            trigger: 'change',
            required: true,
            message: '请输入密码'
          }
        ],
        userType: [
          {
            trigger: 'change',
            required: true,
            message: '请选择用户类型'
          }
        ],
        captcha: [
          {
            trigger: 'change',
            required: true,
            message: '请输入验证码'
          }
        ],
        token: []
      }
    }
  },
  mounted() {
    this.generate()
  },
  methods: {
    onSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch('user/login', this.addModel).then(() => {
            // 登录成功
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          })
        }
      })
    },
    async resetImg() {
      const res = await getPic()
      if (res && res.code == 200) {
        this.imgUrl = 'data:image/png;base64,' + res.data.img
        this.addModel.token = res.data.token
      }
    },
    async generate() {
      const res = await getPic()
      if (res && res.code == 200) {
        this.imgUrl = 'data:image/png;base64,' + res.data.img
        this.addModel.token = res.data.token
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.verifyCodeImg {
  margin-left: 100px;
  cursor: pointer;
}
.logincontainer {
  height: 100%;
  background: #fff;
  background-image: url("../../assets/images/login_bg.png");
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: 100% 100%;
  .loginform {
    height: 430px;
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
