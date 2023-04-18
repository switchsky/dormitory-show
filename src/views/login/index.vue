
<template>
  <div class="logincontainer">
    <div class="show">
      <div class="sysname">学生宿舍管理系统</div>
      <p class="detail">为高校宿舍管理问题提供解决方案</p>
    </div>
    <div class="right">
      <div class="welcome">欢迎使用！</div>
      <el-form
        ref="loginForm"
        class="loginform"
        :model="addModel"
        :rules="rules"
        :inline="false"
        size="medium"
      >
        <el-form-item>
          <span class="loginTitle">登录页面</span>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="addModel.username"
            prefix-icon="el-icon-user"
            placeholder="请输入账户"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="addModel.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input
            v-model="addModel.captcha"
            prefix-icon="el-icon-circle-check"
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
              <el-button class="loginbtn" @click="clearForm">重置</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div class="copyright">switchsky版权所有@2023</div>
    </div>

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
          },
          {
            type: 'string',
            message: '请输入不包含空格的字符',
            trigger: 'blur',
            transform(value) {
              if (value && value.indexOf(' ') === -1) {
                return value
              } else {
                return false
              }
            }
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
    },
    clearForm() {
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.show {
  width: 50%;
  height: 100%;
  margin-right: 100px;
  background: linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url("../../assets/images/bg-02.jpg") no-repeat;
  // background: url("../../assets/images/bg-02.jpg") no-repeat;
  background-size:cover;
  .sysname {
    font-size: 58px;
    color: #245dff;
    margin-left: 134px;
    margin-top: 163px;
  }
  .detail {
    font-size: 24px;
    color: #333;
    margin-left: 134px;
    margin-top: 27px;
  }
}
.verifyCodeImg {
  margin-left: 100px;
  cursor: pointer;
}
.logincontainer {
  .right {
    .welcome {
      margin-top:100px;
      font-size: 36px;
      color: #333;
      font-weight: 500;
      line-height: 33px;
      padding-left: 50px;

      font-weight: 550;
    }
    .loginform {
    height: 100%;
    width: 450px;
    background: #fff;
    padding-top: 50px;
    padding-left: 50px;
    .loginTitle {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #35b65e;
      font-weight: 600;
      margin-bottom: 10px;
      border-bottom: 1px solid #dbdbdb;
    }
    .loginbtn {
      width: 100%;
    }
    }
    .copyright {
      font-size: 14px;
      color: #7c8094;
      padding-left: 170px;
    }
  }
  height: 100%;
  // background: #fff;
  // background-image: url("../../assets/images/bg_01.jpg");
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-size: 100% 100%;

}
</style>
