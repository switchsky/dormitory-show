<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width + 'px'"
    :before-close="onClose"
    :close-on-click-modal="false"
  >
    <div class="containner" :style="{ height: height + 'px' }">
      <slot name="content" />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="small" icon="el-icon-close" @click="onClose">取 消</el-button>
      <el-button type="primary" size="small" icon="el-icon-check" @click="onConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      // 弹框的标题
      type: String,
      default: '标题'
    },
    visible: {
      // 控制弹框的展示和影藏
      type: Boolean,
      default: false
    },
    width: {
      // 弹框宽度
      type: Number,
      default: 600
    },
    height: {
      // 弹框的高度
      type: Number,
      default: 250
    }
  },
  methods: {
    // 弹框的关闭
    onClose() {
      this.$emit('onClose')
    },
    // 弹框的展示
    onConfirm() {
      this.$emit('onConfirm')
    }
  }
}
</script>

<style lang="scss" scoped>
.containner {
  overflow-x: initial;
  overflow-y: auto;
}
//   ::v-deep 深度查找
.el-dialog__wrapper {
  ::v-deep .el-dialog {
    border-top-left-radius: 7px !important;
    border-top-right-radius: 7px !important;
    .el-dialog__header {
      border-top-left-radius: 7px !important;
      border-top-right-radius: 7px !important;
      background-color: #fff;
      margin-bottom: 20px;
      .el-dialog__title {
        font-size: 18px;
        color: #303133;
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
        padding-bottom: 4px;
        border-bottom: 2px solid #7ca7e3;
      }
      .el-dialog__close {
        color: #909399;
      }
    }
    .el-dialog__body {
      padding: 10px 10px !important;
    }
    .el-dialog__footer {
      border-top: 1px solid #e8eaec !important;
      padding: 10px !important;
    }
  }
}
</style>
