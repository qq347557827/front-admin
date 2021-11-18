<template>
  <div>
    <Form :model="formItem" ref="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="用户名" prop="name">
        <Input v-model="formItem.name" placeholder="请输入用户名"></Input>
      </FormItem>
      <FormItem label="登录名" prop="username">
        <Input v-model="formItem.username" placeholder="请输入登录名"></Input>
      </FormItem>
      <FormItem label="密码" prop="pwd">
        <Input v-model="formItem.pwd" placeholder="请输入密码" type="password"></Input>
      </FormItem>
      <FormItem label="确认密码" prop="password">
        <Input v-model="formItem.password" placeholder="请确认密码" type="password"></Input>
      </FormItem>
      <FormItem label="积分"
      >
        <Slider v-model="formItem.favs" :step="10"></Slider>
      </FormItem>
      <FormItem label="所属权限"
      >
        <CheckboxGroup v-model="formItem.role">
          <Checkbox v-for="(item, index) in roles" :label="item.title" :key="index" :value="item.code"></Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="formItem.vip">
        <Select v-model="formItem.isVip">
          <Option v-for="item in vipList" :key="item.value" :value="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="时间">
        <Row>
          <Col span="11">
            <DatePicker type="date" placeholder="Select date" v-model="formItem.dateVal"></DatePicker>
          </Col>
          <Col span="2" style="text-align: center">-</Col>
          <Col span="11">
            <TimePicker type="time" placeholder="Select time" v-model="formItem.timeVal" @on-change="changeTime"></TimePicker>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="城市">
        <Input v-model="formItem.city" placeholder="请输入城市"></Input>
      </FormItem>
      <FormItem label="Text">
        <Input v-model="formItem.sign" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
               placeholder="请输入签名"></Input>
      </FormItem>
      <!--        <FormItem>-->
      <!--          <Button type="primary">Submit</Button>-->
      <!--          <Button style="margin-left: 8px">Cancel</Button>-->
      <!--        </FormItem>-->
    </Form>
    <div class="btn-box">
      <Button @click="closeEvent">取消</Button>
      <Button type="primary" @click="submitEvent">确认</Button>
    </div>
  </div>
</template>

<script>
import memont from 'dayjs'

export default {
  name: 'edit',
  props: {
    roles: {
      type: Array
    },
    data: {
      type: Object || Array
    }
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error('密码最小6位 最大16位'))
      } else {
        if (this.formItem.password !== '') {
          // 对第二个密码框单独验证
          this.$refs.formValidate.validateField('password')
          console.log(' %c 🐱‍🏍 this.$refs.formValidate.validateField: ', 'font-size:20px;background-color: #42b983;color:#fff;', this.$refs.formValidate.validateField)
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error('密码最小6位 最大16位'))
      } else if (value !== this.formItem.pwd) {
        callback(new Error('两次密码不对!'))
      } else {
        callback()
      }
    }
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
      formItem: {
        name: '',
        username: '',
        pwd: '',
        password: '',
        favs: 0,
        created: '',
        isVip: 0,
        city: '',
        sign: '',
        role: []
      },

      ruleValidate: {
        name: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
        pwd: [
          {
            validator: validatePass,
            trigger: 'blur'
          }
        ],
        password: [
          {
            validator: validatePassCheck,
            trigger: 'blur'
          }
        ]
      }
    }
  },

  methods: {
    changeTime (v) {
      const timeArr = v.split(':')
      // this.formItem.created.hour = parseInt(timeArr[0])
      this.formItem.created = memont(this.formItem.created).set('hour', parseInt(timeArr[0]))
      this.formItem.created = memont(this.formItem.created).set('minute', parseInt(timeArr[1]))
      this.formItem.created = memont(this.formItem.created).set('second', parseInt(timeArr[2]))
    },
    handleSubmit () {
      this.$refs.formValidate.validate((valid) => {
        if (!valid) {
          // this.$Message.success('Success!')
          this.$Message.error('请检查')
        }
      })
    },
    closeEvent () {
      this.$emit('closeEvent')
    },
    submitEvent () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          // this.$Message.success('Success!')
          this.$emit('submitEvent', this.formItem)
        } else {
          this.$Message.error('请检查')
        }
      })
    }
  },
  computed: {
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

<style lang="scss" scoped>
.btn-box {
  text-align: right;

  ::v-deep button {
    margin-left: 10px;
  }
}

</style>
