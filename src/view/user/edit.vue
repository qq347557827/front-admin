<template>
  <div>
    <Form :model="formItem"  ref="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="用户名" prop="name">
        <Input v-model="formItem.name" placeholder="请输入用户名"></Input>
      </FormItem>
      <FormItem label="登录名" prop="username">
        <Input v-model="formItem.username" placeholder="请输入登录名"></Input>
      </FormItem>
      <FormItem label="积分"
      >
        <Slider v-model="formItem.favs" :step="10"></Slider>
      </FormItem>
      <!--      <FormItem label="vip">-->
      <!--        <Input v-model="formItem.isVip" placeholder="Enter something..."></Input>-->
      <!--      </FormItem>-->
      <FormItem label="vip">
        <Select v-model="formItem.isVip">
          <Option v-for="item in vipList" :key="item.value" :value="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="时间">
        <Row>
          <Col span="11">
            <DatePicker type="date" placeholder="Select date" v-model="dateVal"></DatePicker>
          </Col>
          <Col span="2" style="text-align: center">-</Col>
          <Col span="11">
            <TimePicker type="time" placeholder="Select time" v-model="timeVal" @on-change="changeTime"></TimePicker>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="是否禁言">
        <i-switch v-model="formItem.status" size="large">
          <span slot="open">On</span>
          <span slot="close">Off</span>
        </i-switch>
      </FormItem>
      <FormItem label="Text">
        <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
               placeholder="Enter something..."></Input>
      </FormItem>
      <!--        <FormItem>-->
      <!--          <Button type="primary">Submit</Button>-->
      <!--          <Button style="margin-left: 8px">Cancel</Button>-->
      <!--        </FormItem>-->
    </Form>
  </div>
</template>

<script>
import memont from 'dayjs'

export default {
  name: 'edit',
  props: {
    data: {
      type: Object || Array
    }
  },
  data () {
    return {
      vipList: [
        {
          label: '普通用户',
          value: 0
        },
        {
          label: 'VIP1',
          value: 1
        },
        {
          label: 'VIP2',
          value: 2
        },
        {
          label: 'VIP3',
          value: 3
        },
        {
          label: 'VIP4',
          value: 4
        },
        {
          label: 'VIP5',
          value: 5
        },
        {
          label: 'VIP6',
          value: 6
        },
        {
          label: 'VIP7',
          value: 7
        },
        {
          label: 'VIP8',
          value: 8
        }
      ],
      ruleValidate: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
        ],
      }
    }
  },
  // watch: {
  //   data (newval, oldval) {
  //     console.log(' %c 🐱‍🏍 newval: ', 'font-size:20px;background-color: #42b983;color:#fff;', newval)
  //   }
  // },
  methods: {
    changeTime (v) {
      const timeArr = v.split(':')
      // this.formItem.created.hour = parseInt(timeArr[0])
      this.formItem.created = memont(this.formItem.created).set('hour', parseInt(timeArr[0]))
      this.formItem.created = memont(this.formItem.created).set('minute', parseInt(timeArr[1]))
      this.formItem.created = memont(this.formItem.created).set('second', parseInt(timeArr[2]))

    }

  },
  computed: {
    formItem: {
      get () {
        return this.data
      },
      set (val) {
        console.log(' %c 🐱‍🏍 val: ', 'font-size:20px;background-color: #42b983;color:#fff;', val)
      }
    },
    dateVal: {
      get () {
        return memont(this.formItem.created).format('YYYY-MM-DD')
      },
      set (val) {
        this.formItem.created = val
      }
    },
    timeVal: {
      get () {
        return memont(this.formItem.created).format('HH:mm:ss')
      },
      set (val) {
        // this.formItem.created = val
        // debugger
        // const timeArr = val.split(':')
        // memont(this.formItem.created).set('hour', timeArr[0]).set('minute', timeArr[1]).set('second', timeArr[2])
      }
    }
  }
}
</script>

<style scoped>

</style>
