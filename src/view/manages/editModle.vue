<template>
  <div>
      <Form :model="formItem" :label-width="80">
        <FormItem label="文章标题">
          <Input v-model="formItem.title" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="分类">
          <Select v-model="formItem.catalog">
            <Option value="ask"></Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="时间">
          <Row>
            <Col span="11">
              <DatePicker type="date" placeholder="Select date" v-model="formItem.created"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <TimePicker type="time" placeholder="Select time" v-model="formItem.created"></TimePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="是否置顶">
          <RadioGroup v-model="formItem.isTop">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
<!--        <FormItem label="Checkbox">-->
<!--          <CheckboxGroup v-model="formItem.checkbox">-->
<!--            <Checkbox label="Eat"></Checkbox>-->
<!--            <Checkbox label="Sleep"></Checkbox>-->
<!--            <Checkbox label="Run"></Checkbox>-->
<!--            <Checkbox label="Movie"></Checkbox>-->
<!--          </CheckboxGroup>-->
<!--        </FormItem>-->
        <FormItem label="是否禁言">
          <i-switch v-model="formItem.status" size="large">
            <span slot="open">On</span>
            <span slot="close">Off</span>
          </i-switch>
        </FormItem>
        <FormItem label="积分">
          <Slider v-model="formItem.favs" :step="10"></Slider>
        </FormItem>
        <FormItem label="Text">
          <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
<!--        <FormItem>-->
<!--          <Button type="primary">Submit</Button>-->
<!--          <Button style="margin-left: 8px">Cancel</Button>-->
<!--        </FormItem>-->
      </Form>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object || Array
    }
  },
  data () {
    return {
      // formItem: null
    }
  },
  // watch: {
  //   data (newval, oldval) {
  //     console.log(' %c 🐱‍🏍 newval: ', 'font-size:20px;background-color: #42b983;color:#fff;', newval)
  //   }
  // },
  computed: {
    formItem: {
      get () {
        return this.data
      },
      set (val) {
        console.log(' %c 🐱‍🏍 val: ', 'font-size:20px;background-color: #42b983;color:#fff;', val)
      }
    }
  }

}
</script>

<style scoped>

</style>
