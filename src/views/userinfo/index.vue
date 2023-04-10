<template>
  <div class="wscn-http404-container">
    <h1>11111</h1>
  </div>
</template>

<script>
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
  }
}
</script>
