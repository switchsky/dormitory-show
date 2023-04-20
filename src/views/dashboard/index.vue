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
        <div class="show-header" style="background: rgb(236, 112, 99)">
          <div class="bottom-text">学生总数 <i class="el-icon-user-solid" /></div>
          <div class="show-num">{{ stuCount }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="show-header" style="background: rgb(93, 173, 226)">
          <div class="show-num">{{ classCount }}</div>
          <div class="bottom-text">班级总数 <i class="el-icon-school" /></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="show-header" style="background: rgb(82, 190, 128)">
          <div class="show-num">{{ repairCount }}</div>
          <div class="bottom-text">待维修数 <i class="el-icon-s-tools" /></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="show-header" style="background: rgb(244, 208, 63)">
          <div class="show-num">{{ buildCount }}
          </div>
          <div class="bottom-text">楼栋总数 <i class="el-icon-office-building" /></div>
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
    <!-- echarts -->
    <div style="display: flex">
      <!-- 为 ECharts 准备一个定义了高宽的 DOM 容器 -->
      <div id="main2" style="width: 800px; height: 300px; flex-grow: 1" />
    </div>
    <div class="noticetitle">
      <span>公告详情</span>
    </div>

    <div class="container">
      <!-- 第一个卡片 -->
      <el-card v-for="(item, index) in noticeList" :key="index" class="card" shadow="hover">
        <div class="content">
          <h3>{{
            item.noticeTitle
          }}</h3>
          <p>{{
            item.noticeText
          }}</p>
          <div class="time">{{
            item.createTime
          }}</div>
        </div>
      </el-card>
    </div>
  </el-main>
</template>

<script>
import { getTopListApi } from '@/api/notice.js'
import { getTotalApi } from '@/api/user.js'
import { getTotalBuildApi } from '@/api/build.js'
import { getStuNumBySex, getStuNumByClass } from '@/api/student.js'
import { getLeaveNumApi } from '@/api/leave.js'

export default {
  data() {
    return {
      noticeList: [],
      buildCount: 0,
      classCount: 0,
      repairCount: 0,
      stuCount: 0,
      date: []
    }
  },
  mounted() {
    this.getTotal()
    this.getTopList()
    this.myecharts1()
    this.myecharts2()
    this.myecharts3()
    this.myecharts4()
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
    },
    async myecharts4() {
      var myChart = this.$echarts.init(document.getElementById('main2'))
      var leaveNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      // 生成日期
      const date = new Date()
      const year = date.getFullYear() // 获取完整的年份(4位)
      let month = date.getMonth() + 1 // 获取当前月份(0-11,0代表1月)
      let strDate = date.getDate() // 获取当前日(1-31)
      if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
      if (strDate < 10) strDate = `0${strDate}` // 如果日是个位数，在前面补0
      var list = []
      for (let i = 10; i >= 1; i--) {
        const s = `${strDate - i}日`
        list.push(s)
      }
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        title: {
          text: '缺勤情况（近10天）'
        },
        xAxis: {
          type: 'category',
          data: list,
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: leaveNum,
            type: 'line',
            smooth: true,
            label: {
              show: true,
              position: 'top',
              textStyle: {
                fontSize: 10
              }
            }
          }
        ]
      }

      // 动态获取数据
      const res = await getLeaveNumApi()
      if (res && res.code == 200) {
        const leaveData = res.data
        for (var i = 0; i <= 9; i++) {
          if (leaveData[i]) { leaveNum[leaveData[i].time] = leaveData[i].num }
        }
      }
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
  padding-left: 5%;
  padding-top: 3%;
  top: 0;
  width: 100%;
  height: 25px;
  line-height: 25px;
  text-align: left;
  position: absolute;
  font-weight: 500;
  font-size: 20px;
}
.show-header {
  background: #00c0ef;
  color: #fff;
  height: 100px;
  border-radius: 15px;
  position: relative;
}
.show-num {
  font-size: 70px;
  font-weight: 600;
  padding-top: 35px;
  padding-right: 10%;
  text-align: right;
  line-height: 25px;
}
.noticetitle {
  padding-left: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #464646;
}
.container{
    position: relative;
    display: flex; /* flex容器（flex container） */
    justify-content: center;/* 定义项目在主轴上的对齐方式 */
    align-items: center;/* 定义项目在竖直方向上对齐方式 */
    max-width: 1200px;
    flex-wrap: wrap;/* 定义项目是否换行以及如何换行  */
    z-index: 1;
}
.container .card{
    position: relative;
    width: 280px;
    height: 400px;
    margin: 30px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

}
.container .card .content{
    padding: 20px;
    text-align: center;
    /* transform: translateY(100px); */
    /* opacity: 0; */
    /* transition: 0.5s; */
}
/* .container .card:hover .content{
    transform: translateY(0px);
    opacity: 1;
} */
.container .card .content h3{
    font-size: 1.8em;
    color: #000;
    z-index: 1;
}
.container .card .content p{
    font-size: 1em;
    color: #000;
    font-weight: 300;
}
.container .card .content .time{
    position: relative;
    display: inline-block;
    padding: 8px 20px;
    margin-top: 15px;
    background: #fff;
    color: #000;
    border-radius: 20px;
    text-decoration: none;
    font-weight: 500;
    font-size: 13px;
}
</style>
