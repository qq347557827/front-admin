<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`"
             style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="发帖统计" toolName="发帖统计"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <!-- <example style="height: 310px;"/> -->
        <weekstat></weekstat>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'

// import Example from './example.vue'
import Weekstat from './weekstat.vue'

export default {
  name: 'home',
  components: {
    Weekstat,
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,

    // Example,
    Weekstat
  },
  data () {
    return {
      inforCardData: [
        {
          title: '新增用户',
          icon: 'md-person-add',
          count: 803,
          color: '#2d8cf0'
        },
        {
          title: '发帖累积',
          icon: 'md-locate',
          count: 232,
          color: '#19be6b'
        },
        {
          title: '新增评论',
          icon: 'md-help-circle',
          count: 142,
          color: '#ff9900'
        },
        {
          title: '本周采纳',
          icon: 'md-share',
          count: 657,
          color: '#ed3f14'
        },
        {
          title: '本周签到',
          icon: 'md-chatbubbles',
          count: 12,
          color: '#E46CBB'
        },
        {
          title: '本周发帖',
          icon: 'md-map',
          count: 14,
          color: '#9A66E4'
        }
      ],
      pieData: [
        {
          value: 335,
          name: '提问'
        },
        {
          value: 310,
          name: '分享'
        },
        {
          value: 234,
          name: '建议'
        },
        {
          value: 135,
          name: '讨论'
        }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    }
  },
  mounted () {
    //
  }
}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
