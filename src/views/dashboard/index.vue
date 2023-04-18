<template>
  <el-main>
    <!-- 统计 -->
    <el-row
      :gutter="20"
      type="flex"
      class="row-bg"
      justify="center"
      style="margin-bottom: 80px"
    >
      <el-col :span="6">
        <div class="show-header" style="background: rgb(45, 183, 245)">
          <div class="show-num">{{ stuCount }}</div>
          <div class="bottom-text">学生总数</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="show-header" style="background: rgb(237, 64, 20)">
          <div class="show-num">{{ classCount }}</div>
          <div class="bottom-text">班级总数</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="show-header">
          <div class="show-num">{{ repairCount }}</div>
          <div class="bottom-text">待维修数</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="show-header" style="background: rgb(255, 153, 0)">
          <div class="show-num">{{ buildCount }}</div>
          <div class="bottom-text">楼栋总数</div>
        </div>
      </el-col>
    </el-row>

    <!-- echarts -->
    <div class="bing">
      <!-- 为 ECharts 准备一个定义了高宽的 DOM 容器 -->
      <div id="info1" style="width: 50%; height: 300px;" />
      <div id="info2" style="width: 50%; height: 300px;" />
    </div>
    <!-- echarts -->
    <div style="display: flex">
      <!-- 为 ECharts 准备一个定义了高宽的 DOM 容器 -->
      <div id="main" style="width: 800px; height: 300px; flex-grow: 1" />
    </div>
    <el-card class="box-card" style="margin-top: 30px">
      <div slot="header" class="clearfix">
        <span style="color: #000000; font-weight: 600">公告列表</span>
      </div>
      <div v-for="(item, index) in noticeList" :key="index" class="text item">
        <span style="font-weight: 600; font-size: 14px">{{
          item.noticeTitle
        }}</span>
        <span style="margin-left: 30px; font-size: 14px">{{
          item.noticeText
        }}</span>
        <span style="margin-left: 30px; font-size: 14px">{{
          item.createTime
        }}</span>
        <el-divider />
      </div>
    </el-card>
  </el-main>
</template>

<script>
import { getTopListApi } from '@/api/notice.js'
import { getTotalApi } from '@/api/user.js'
import { getTotalBuildApi } from '@/api/build.js'
import { getStuNumBySex, getStuNumByClass } from '@/api/student.js'
export default {
  data() {
    return {
      noticeList: [],
      buildCount: 0,
      classCount: 0,
      repairCount: 0,
      stuCount: 0
    }
  },
  mounted() {
    this.getTotal()
    this.getTopList()
    this.myecharts1()
    this.myecharts2()
    this.myecharts3()
  },
  methods: {
    // 获取公告列表
    async getTotal() {
      const res = await getTotalApi()
      if (res && res.code == 200) {
        console.log(res)
        this.classCount = res.data.classCount
        this.buildCount = res.data.buildCount
        this.repairCount = res.data.repairCount
        this.stuCount = res.data.stuCount
      }
    },
    // 获取公告列表
    async getTopList() {
      const res = await getTopListApi()
      if (res && res.code == 200) {
        this.noticeList = res.data
        console.log(this.noticeList)
      }
    },
    async myecharts1() {
      // 初始化echarts
      var myChart = this.$echarts.init(document.getElementById('main'))
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '学生住宿'
        },
        tooltip: {},
        legend: {
          data: ['分类']
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [
          {
            name: '人数',
            type: 'bar',
            data: [],
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)'
            }
          }
        ]
      }
      // 动态获取数据
      const res = await getTotalBuildApi()
      if (res && res.code == 200) {
        option.xAxis.data = res.data.names
        option.series[0].data = res.data.counts
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    async myecharts2() {
      var myChart = this.$echarts.init(document.getElementById('info1'))
      var option = {
        title: {
          text: '学生来源'
        },
        series: [
          {
            type: 'pie',
            data: [],
            radius: ['40%', '70%'],
            label: {
              normal: {
                show: true,
                formatter: '{b}: {c}人' // 自定义显示格式(b:name, c:value, d:百分比)
              }
            }
          }
        ]
      }

      // 动态获取数据
      const res = await getStuNumByClass()
      if (res && res.code === 200) {
        option.series[0].data = res.data
        // option.series[0].data = res.data.counts
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    async myecharts3() {
      var myChart = this.$echarts.init(document.getElementById('info2'))
      var option = {
        title: {
          text: '男女比例'
        },
        series: [
          {
            type: 'pie',
            data: [
              {
                value: 0,
                name: '男'
              },
              {
                value: 0,
                name: '女'
              }
            ],
            label: {
              normal: {
                show: true,
                formatter: '{b}: {c}人 ({d}%)' // 自定义显示格式(b:name, c:value, d:百分比)
              }
            }
          }
        ]
      }
      // 动态获取数据
      const res = await getStuNumBySex()
      if (res && res.code === 200) {
        option.series[0].data[0].value = res.data.man
        option.series[0].data[1].value = res.data.woman
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.bing {
  display: flex;
  justify-content: flex-start;
}
.bottom-text {
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
  height: 25px;
  line-height: 25px;
  text-align: center;
  position: absolute;
  font-weight: 600;
}
.show-header {
  background: #00c0ef;
  color: #fff;
  height: 80px;
  border-radius: 5px;
  position: relative;
}
.show-num {
  font-size: 38px;
  font-weight: 600;
  padding: 5px;
}
</style>
