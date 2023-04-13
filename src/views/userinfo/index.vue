<template>
  <div>
    <el-row :gutter="20" style="margin-top:10px;">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>个人中心展示</span>
            </div>
            <div class="img">
              <img v-if="dataForm.img" :src="dataForm.img" class="show">
            </div>
            <div class="name-role">
              <span class="sender">用户名：{{ dataForm.username }}</span>
            </div>
            <div class="name-role">
              <span class="sender">昵称：{{ dataForm.nickName }}</span>
            </div>
            <div class="sex">
              <div class="sex">性别：<span v-if="dataForm.sex=='0'">男</span><span v-if="dataForm.sex=='1'">女</span></div>
            </div>
            <div class="age">
              <span class="age">年龄：{{ dataForm.age }}</span>
            </div>
            <div class="registe-info">
              <span class="registe-info">
                注册时间：
                <li class="fa fa-clock-o" />
                2020/4/10 9:40:33
              </span>
            </div>
            <el-divider />
            <div class="personal-relation">
              <div class="relation-item">手机号:  <div style="float: right; padding-right:20px;">{{ dataForm.phone }}</div></div>
            </div>
            <div class="personal-email">
              <div class="relation-item">邮箱:  <div style="float: right; padding-right:20px;">{{ dataForm.email }}</div></div>
            </div>
            <div class="personal-hobby">
              <div class="relation-item">个人爱好:  <div style="float: right; padding-right:20px;">{{ dataForm.hobby }}</div></div>
            </div>
            <div class="personal-signature">
              <div class="relation-item">个性签名:  <div style="float: right; padding-right:20px;">{{ dataForm.signature }}</div></div>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>基本资料</span>
            </div>
            <div>
              <el-form v-model="dataForm" label-width="80px" size="small" label-position="right">
                <el-form-item label="用户头像" prop="img">
                  <!--不使用action 符号#   用http-request实现自定义上传  :http-request="httpRequest"  :on-change="handleChange"-->
                  <el-upload
                    class="avatar-uploader"
                    action="lei"
                    :on-change="getFile"
                    :show-file-list="false"
                    :http-request="httpRequest"
                  ><!--覆盖默认上传-->
                    <img v-if="dataForm.img" :src="dataForm.img" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-form-item>
                <el-form-item label="用户昵称" prop="nickName">
                  <el-input v-model="dataForm.nickName" auto-complete="off" />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="dataForm.phone" auto-complete="off" />
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                  <el-input v-model="dataForm.age" maxlength="18" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="dataForm.email" maxlength="18" />
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                  <el-radio v-model="dataForm.sex" label="0">男</el-radio>
                  <el-radio v-model="dataForm.sex" label="1">女</el-radio>
                </el-form-item>
                <el-form-item label="爱好" prop="hobby">
                  <el-input v-model="dataForm.hobby" maxlength="50" />
                </el-form-item>
                <el-form-item label="个性签名" prop="signature">
                  <el-input
                    v-model="dataForm.signature"
                    type="textarea"
                    :rows="5"
                  />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click="search">查询信息</el-button>
                <el-button size="mini" type="primary" @click="submit">提交</el-button>
                <el-button size="mini" type="warning" @click="backToSys">返回系统</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import { getUserInfoDetail, updateUserDetail } from '@/api/user.js'
import { getUserType, getUserId } from '@/utils/auth.js'
export default {
  data() {
    return {
      dataForm: {
        userId: getUserId(),
        userType: getUserType(),
        img: '',
        username: '',
        nickName: '',
        phone: '',
        sex: '',
        age: '',
        email: '',
        hobby: '',
        signature: ''
      },
      userInfo: {
        userId: getUserId(),
        userType: getUserType()
      }
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      const res = await getUserInfoDetail(this.userInfo)
      if (res && res.code == 200) {
        this.dataForm = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    getBase64(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function() {
          imgResult = reader.result
        }
        reader.onerror = function(error) {
          reject(error)
        }
        reader.onloadend = function() {
          resolve(imgResult)
        }
      })
    },
    getFile(file) {
      const that = this
      // if(file.success){
      console.log(file)
      const isJPG = file.raw.type === 'image/jpeg'
      const isPNG = file.raw.type === 'image/png'
      const isLt5M = file.raw.size / 1024 / 1024 < 5
      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是JPG或者PNG格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      if ((isJPG || isPNG) && isLt5M) {
        this.getBase64(file.raw).then(res => {
          that.dataForm.img = res
          // 这里拿到base64的文件流，处理你自己的业务逻辑
        })
      }
    },
    // 实现图片上传功能
    httpRequest(item) {
    },
    async search() {
      const res = await getUserInfoDetail(this.userInfo)
      if (res && res.code == 200) {
        this.dataForm = res.data
        this.$message.success('查询成功')
      } else {
        this.$message.error(res.msg)
      }
    },
    async submit() {
      this.dataForm.userId = this.userInfo.userId
      this.dataForm.userType = this.userInfo.userType
      const res = await updateUserDetail(this.dataForm)
      if (res && res.code == 200) {
        this.$message.success('更新成功')
        this.getUserInfo()
      } else {
        this.$message.error(res.msg)
      }
    },
    backToSys() {
      this.$destroy()
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
//卡片样式
 .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }
//文本样式区
  .name-role {
    font-size: 16px;
    padding: 5px;
   text-align:center;
  }
   .sender{
      text-align:center;
    }
    .sex {
      margin-top: 5px;
      text-align:center;
    }
    .age {
      padding-top:10px;
      text-align:center;
    }
.registe-info{
  text-align: center;
  padding-top:10px;
}
.personal-relation {
  font-size: 16px;
  padding: 0px 5px 5px;
  margin-right: 1px;
    width: 100%
}

.relation-item {
  padding: 12px;

}
.dialog-footer{
  padding-top:10px ;
  padding-left: 10%;
}
//布局样式区
   .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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
  .show {
    margin-left: 130px;
    width: 200px;
    height: 200px;
  }
</style>
