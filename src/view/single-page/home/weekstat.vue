<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import moment from 'dayjs'
import { on, off } from '@/libs/tools'

export default {
  name: 'weekstat',
  props: {
    weekData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    _series() {
      let series = []
      const labelOption = {
        show: true,
        position: 'top'
      };
      for (const i of Object.keys(this.weekData)) {
        let nameMap = {
          ask: '提问',
          share: '分享',
          advise: '建议',
          discuss: '讨论',
        }

        series.push({
          name: nameMap[i],
          type: 'bar',
          label: labelOption,
          data: this.weekData[i]
        })
      }
      console.log(' %c 🐱‍🏍 series: ', 'font-size:20px;background-color: #42b983;color:#fff;', series)
      return series
    },
    _dateArr() {
      let arr = []
      for (let i = 7; i >= 1; i--) {
        arr.push(moment().subtract(i-1, 'day').format('YYYY-MM-DD'))
      }
      console.log(' %c 🐱‍🏍 arr: ', 'font-size:20px;background-color: #42b983;color:#fff;', arr)
      return arr
    }
  },
  mounted () {
    const series = this._series()
    const dateArr = this._dateArr()
    const option = {
      title: {
        text: '最近7天数据'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      xAxis: {
        type: 'category',
        data: dateArr
      },
      series,
    };
    this.$nextTick(() => {

      const refDom = this.$refs.dom

      this.dom = echarts.init(refDom)
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>

<style scoped>
.m-echarts {
  width: 100%;
  height: 500px;
}
</style>
