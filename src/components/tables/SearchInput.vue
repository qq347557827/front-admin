<template>
  <div class="search-box">
    <Input
      clearable
      placeholder="输入关键字搜索"
      class="search-input"
      @input="inputEvent"
      :value="inputValue"
      v-if="searchInput.type==='input'"
    />
    <!--    时间选择-->
    <Row v-else-if="searchInput.type==='date'">
      <Col span="12">
        <DatePicker @on-change="onChange" type="daterange" show-week-numbers placement="bottom-end"
                    placeholder="Select date" style="width: 200px"></DatePicker>
      </Col>
      <!--      <Col span="12">-->
      <!--        <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>-->
      <!--      </Col>-->
    </Row>
    <RadioGroup v-else-if="searchInput.type==='radio'" @on-change="changeRadio">
      <Radio v-for="(item, index) in searchInput.searchList" :label="item.key" :value="item.value"
             :key="'radio' + index"

      ></Radio>
      <!--      <Radio label="爪哇犀牛"></Radio>-->
      <!--      <Radio label="印度黑羚"></Radio>-->
    </RadioGroup>
    <CheckboxGroup v-else-if="searchInput.type==='checkbox'" @on-change="checkboxEvent" v-model="checkboxValue">
      <Checkbox :label="item" v-for="(item, index) in searchInput.searchList" :key="'Checkbox' + index"></Checkbox>
      <!--      <Checkbox label="苹果"></Checkbox>-->
      <!--      <Checkbox label="西瓜"></Checkbox>-->
    </CheckboxGroup>
    <Select
      @on-clear="clearSelect"
      @on-change="changeSelect"
      clearable style="width:200px" v-else-if="searchInput.type==='select'">
      <Option :value="item.value" :key="'opiton' + item.value"
              v-for="item in searchInput.searchList"
      >{{ item.label }}
      </Option>
    </Select>
    <template v-else-if="searchInput.type==='number'">
      <Input
        style="width: 100px"
        clearable
        placeholder="输入开始"
        class="search-input"
        v-enterNumber2
        :value="numberValue.start"
        @input="startNumber"
        @on-clear="startClear"
      />
      <i>到</i>
      <Input
        style="width: 100px"
        clearable
        v-enterNumber2
        :value="numberValue.end"
        placeholder="输入结束"
        class="search-input"
        @input="endNumber"
        @on-clear="endClear"


      />
    </template>
    <!--    <input type="text" @input="startNumber" :value="numberValue.start" v-enterNumber2>-->
    <!--    <input type="text" @input="endNumber" :value="numberValue.end">-->
  </div>
</template>

<script>
export default {
  name: 'searchInput',
  props: ['searchInput', 'searchValue'],
  data () {
    return {
      inputValue: '',
      checkboxValue: [],
      radioValue: '',
      dateValue: [],
      numberValue: {
        start: '',
        end: ''
      },
      selectValue: ''
    }
  },
  methods: {
    init () {
      console.log('jinru init')
      this.$emit('input', '')
      this.inputValue = ''
      this.checkboxValue = []
      this.radioValue = ''
      this.dateValue = []
      this.numberValue = {
        start: '',
        end: ''
      }
      this.selectValue = ''
    },
    onChange (date) {
      console.log(' %c 🐱‍🏍 date: ', 'font-size:20px;background-color: #42b983;color:#fff;', date)
      this.dateValue = date
      this.$emit('input', date)
    },
    inputEvent (value) {
      this.inputValue = value
      console.log(' %c 🐱‍🏍 e.target: ', 'font-size:20px;background-color: #42b983;color:#fff;', value)
      this.$emit('input', value)
    },
    startNumber (value) {
      console.log(' %c 🐱‍🏍 e.target.value: ', 'font-size:20px;background-color: #42b983;color:#fff;', value)
      console.log(' %c 🐱‍🏍 typeof e.target.value: ', 'font-size:20px;background-color: #42b983;color:#fff;', typeof value)
      this.numberValue.start = !window.isNaN(value) ? parseInt(value) : ''
      this.$emit('input', this.numberValue)
      // console.log(' %c 🐱‍🏍 this.numberValue: ', 'font-size:20px;background-color: #42b983;color:#fff;', this.numberValue)
    },
    endNumber (value) {
      console.log(' %c 🐱‍🏍 e.target.value: ', 'font-size:20px;background-color: #42b983;color:#fff;', value)
      console.log(' %c 🐱‍🏍 typeof e.target.value: ', 'font-size:20px;background-color: #42b983;color:#fff;', typeof value)
      this.numberValue.end = !window.isNaN(value) ? parseInt(value) : ''
      this.$emit('input', this.numberValue)
      // console.log(' %c 🐱‍🏍 this.numberValue: ', 'font-size:20px;background-color: #42b983;color:#fff;', this.numberValue)
    },
    startClear () {
      this.numberValue.start = ''
      this.$emit('input', this.numberValue)

    },
    endClear () {
      this.numberValue.end = ''
      this.$emit('input', this.numberValue)

    },
    clearVal (val) {
      val = ''
      this.$emit('input', this.numberValue)
    },
    checkboxEvent (value) {
      this.$emit('input', this.checkboxValue)
    },
    changeSelect (value) {
      this.$emit('input', value)
    },
    clearSelect () {
      this.$emit('input', '')
    },
    changeRadio (value) {
      const val = value === '否' ? '0' : '1'
      console.log(' %c 🐱‍🏍 value: ', 'font-size:20px;background-color: #42b983;color:#fff;', val)
      this.$emit('input', val)
    }
  },
  watch: {
    // searchInput () {
    //   this.$emit('input', '')
    //   this.numberValue = {
    //     start: '',
    //     end: ''
    //   }
    //   this.checkboxValue = []
    // }
  }
}
</script>

<style scoped>
.search-box {
  padding: 0 10px;
  display: flex;
  align-items: center;
}
</style>
