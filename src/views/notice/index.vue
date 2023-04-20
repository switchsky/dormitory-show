<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form :model="searchModel" :inline="true" size="small">
      <el-form-item>
        <el-input
          v-model="searchModel.noticeTitle"
          placeholder="请输入公告标题"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button
          style="color: #ff7670"
          icon="el-icon-close"
          @click="resetBtn"
        >重置</el-button>
        <el-button
          v-permission="['sys:sysNotice:add']"
          type="primary"
          icon="el-icon-plus"
          @click="addBtn"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="noticeTitle" label="标题" />
      <el-table-column prop="noticeText" label="内容" />
      <el-table-column prop="createTime" label="发布时间" />
      <el-table-column
        v-if="$checkPermission(['sys:sysNotice:edit', 'sys:sysNotice:delete'])"
        label="操作"
        align="center"
        width="220"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['sys:sysNotice:edit']"
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="editBtn(scope.row)"
          >编辑</el-button>
          <el-button
            v-permission="['sys:sysNotice:delete']"
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="deleteBtn(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page.sync="searchModel.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="searchModel.total"
      background
      @size-change="sizeChange"
      @current-change="currentChange"
    />

    <!-- 弹框 -->
    <sys-dialog
      :title="addDialog.title"
      :height="addDialog.height"
      :width="addDialog.width"
      :visible="addDialog.visible"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          ref="addForm"
          :model="addModel"
          :rules="rules"
          label-width="80px"
          :inline="false"
          size="small"
        >
          <el-form-item prop="noticeTitle" label="标题">
            <el-input v-model="addModel.noticeTitle" />
          </el-form-item>
          <el-form-item prop="noticeText" label="公告内容">
            <el-input v-model="addModel.noticeText" type="textarea" />
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import { addApi, listApi, editApi, deleteApi } from '@/api/notice.js'
import SysDialog from '@/components/dialog/SysDialog.vue'
export default {
  components: {
    SysDialog
  },
  data() {
    return {
      tableHeight: 0,
      tableList: [],
      rules: {
        noticeTitle: [
          {
            trigger: 'blur',
            message: '请输入公告标题',
            required: true
          }
        ],
        noticeText: [
          {
            trigger: 'blur',
            message: '请输入公告内容',
            required: true
          }
        ]
      },
      addModel: {
        type: '',
        noticeId: '',
        noticeTitle: '',
        noticeText: ''
      },
      // 弹框属性
      addDialog: {
        title: '',
        height: 180,
        width: 650,
        visible: false
      },
      searchModel: {
        currentPage: 1,
        pageSize: 10,
        noticeTitle: '',
        total: 0
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220
    })
  },
  methods: {
    currentChange(val) {
      this.searchModel.currentPage = val
      this.getList()
    },
    sizeChange(val) {
      this.searchModel.pageSize = val
      this.getList()
    },
    async deleteBtn(row) {
      const confirm = await this.$myconfirm('确定删除该数据吗?')
      if (confirm) {
        const res = await deleteApi({
          noticeId: row.noticeId
        })
        if (res && res.code == 200) {
          this.$message.success(res.msg)
          this.getList()
        }
      }
    },
    editBtn(row) {
      // 清空表单
      this.$resetForm('addForm', this.addModel)
      this.$objCoppy(row, this.addModel)
      // 设置弹框属性
      this.addDialog.title = '编辑公告'
      this.addDialog.visible = true
      this.addModel.type = '1'
    },
    async getList() {
      const res = await listApi(this.searchModel)
      if (res && res.code == 200) {
        this.tableList = res.data.records
        this.searchModel.total = res.data.total
      }
    },
    onConfirm() {
      this.$refs.addForm.validate(async(valid) => {
        if (valid) {
          let res = null
          if (this.addModel.type == '0') {
            res = await addApi(this.addModel)
          } else {
            res = await editApi(this.addModel)
          }
          if (res && res.code == 200) {
            if (res.msg.trim() == 'sensitive') {
              this.$alert('<p>标题和内容含有以下敏感词：</p>' + '<p>标题：' + res.data.title + '</p>' + '<p>内容：' + res.data.passage + '</p>', '含有敏感词,请重新编辑', {
                confirmButtonText: '确定',
                dangerouslyUseHTMLString: true
              })
            } else {
              this.$message.success(res.msg)
              this.getList()
              this.addDialog.visible = false
            }
          }
        }
      })
    },
    onClose() {
      this.addDialog.visible = false
    },
    addBtn() {
      // 清空表单
      this.$resetForm('addForm', this.addModel)
      // 设置弹框属性
      this.addDialog.title = '新增公告'
      this.addDialog.visible = true
      this.addModel.type = '0'
    },
    searchBtn() {
      this.getList()
    },
    resetBtn() {
      this.searchModel.noticeTitle = ''
      this.searchModel.currentPage = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
