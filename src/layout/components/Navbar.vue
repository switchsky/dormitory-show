<template>
  <div>
    <div class="navbar">
      <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

      <breadcrumb class="breadcrumb-container" />

      <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <span class="user-show">您好，{{ userInfo.userName }}<i class="el-icon-caret-bottom" /></span>
            <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          </div>
          <el-dropdown-menu slot="dropdown" class="this.$refs">
            <!-- <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a> -->
            <el-dropdown-item v-if="userInfo.userType==1" divided @click.native="userinfo">
              <span style="display:block;">个人信息</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="changePass">
              <span style="display:block;">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 修改密码界面 -->
      <el-dialog title="修改密码" width="40%" :visible.sync="cgpwdVisible" :close-on-click-modal="false" :modal-append-to-body="false" class="titlec">
        <el-form
          ref="dataForm"
          :model="dataForm"
          label-width="80px"
          :rules="dataFormRules"
          :size="size"
          label-position="right"
        >
          <el-form-item label="旧密码" prop="oldpassword">
            <el-input v-model="dataForm.oldpassword" type="password" auto-complete="off" placeholder="请输入旧密码" show-password />
          </el-form-item>
          <el-form-item label="新密码" prop="newpassword">
            <el-input v-model="dataForm.newpassword" type="password" auto-complete="off" placeholder="请输入新密码,仅支持数字和大小写英文字母" show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="checkpassword">
            <el-input v-model="dataForm.checkpassword" type="password" auto-complete="off" placeholder="请再次输入密码" show-password />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top: 5px;">
          <el-button :size="size" type="danger" icon="el-icon-close" @click="onClose">取消</el-button>
          <el-button :size="size" type="primary" icon="el-icon-check" @click="onConfirm">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getUserType, getUserId, getUserName } from '@/utils/auth.js'
import { changePassword } from '@/api/user.js'
import { changeStuPassword } from '@/api/student.js'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      userInfo: {
        userId: getUserId(),
        userType: getUserType(),
        userName: getUserName()
      },
      size: 'small',
      cgpwdVisible: false, // 编辑界面是否显示
      editLoading: false, // 载入图标
      // 初始化数据
      dataForm: {
        oldpassword: '',
        newpassword: '',
        checkpassword: '',
        userId: ''
      },
      // 设置属性
      dataFormRules: {
        oldpassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
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
        newpassword: [
          { required: true, message: '请输入密码，仅支持数字和大小写英文字母', trigger: 'blur' },
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
          },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              var passwordreg = /^[a-z0-9]{6,16}$/
              if (!passwordreg.test(value)) {
                callback(new Error('仅支持数字和大小写英文字母,请输入6-16位'))
              } else {
                callback()
              }
            }
          }
        ],
        checkpassword: [
          {
            required: true, message: '请再输入一次密码', trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'))
              } else if (value !== this.dataForm.newpassword) {
                callback(new Error('两次输入密码不一致!'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  mounted() {
    console.log('用户类型' + this.userInfo.userType)
  },
  methods: {
    // 弹框的确定
    async onConfirm() {
      // 表单验证
      this.$refs.dataForm.validate(async(valid) => {
        if (valid) {
          this.dataForm.userId = this.userInfo.userId
          let res = null
          // 0是学生 1是管理员
          if (this.userInfo.userType == 1) { res = await changePassword(this.dataForm) } else res = await changeStuPassword(this.dataForm)
          if (res && res.code == 200) {
            // 信息提示
            this.$message({ type: 'success', message: res.msg })
            this.cgpwdVisible = false
            this.$refs.dataForm.resetFields()
          } else {
            this.$message({ type: 'error', message: '修改失败' })
          }
        }
      })
    },
    // 弹框的取消
    onClose() {
      this.cgpwdVisible = false
    },
    changePass() {
      this.cgpwdVisible = true
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    userinfo() {
      this.$router.push('/userinfo')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #7ca7e3;
  // box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {

    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .user-show {
          display: block;
          cursor:pointer;
          color:#fff;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          margin-bottom: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 18px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
