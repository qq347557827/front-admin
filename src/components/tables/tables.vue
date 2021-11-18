<template>
  <div class="m-table">
    <div
      v-if="searchable && searchPlace === 'top'"
      class="search-con search-con-top"
    >
      <Select v-model="searchKey" class="search-col" clearable @on-change="changeSearchKey">
        <template v-for="item in columns">
          <Option
            :value="item.key"
            :key="`search-col-${item.key}`"
            v-if="item.search"
          >
            {{ item.title }}
          </Option>
        </template>

      </Select>
      <search-input :searchInput="searchInput" v-model="searchValue" ref="searchInput"></search-input>
      <Button @click="handleSearch" class="search-btn" type="primary"
      >
        <Icon type="search"/>&nbsp;&nbsp;搜索
      </Button
      >
      <slot name="headerCenter"></slot>
    </div>
    <Table
      ref="tablesMain"
      :data="insideTableData"
      :columns="insideColumns"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :width="width"
      :height="height"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
    >
      <slot name="header" slot="header"></slot>
      <slot name="footer" slot="footer"></slot>
      <slot name="loading" slot="loading"></slot>

      <!--      // 插槽模板语法只有在这里才行-->
      <!--      <template slot-scope="{ row, index }" slot="created">-->
      <!--        <div>{{ row}}-->
      <!--          <span>123</span>{{index}}</div>-->
      <!--      </template>-->
    </Table>
    <div
      v-if="searchable && searchPlace === 'bottom'"
      class="search-con search-con-top"
    >
      <Select v-model="searchKey" class="search-col">
        <Option
          v-for="item in columns"
          :value="item.key"
          :key="`search-col-${item.key}`"
        >
          <template v-if="item.key !== 'handle'"></template>
          {{ item.title }}
        </Option>
      </Select>
      <Input
        placeholder="输入关键字搜索"
        class="search-input"
        v-model="searchValue"
      />
      <Button class="search-btn" type="primary"
      >
        <Icon type="search"/>&nbsp;&nbsp;搜索
      </Button
      >
    </div>
    <a
      id="hrefToExportTable"
      style="display: none; width: 0px; height: 0px"
    ></a>
  </div>
</template>

<script>
import TablesEdit from './edit.vue'
import handleBtns from './handle-btns'
import './index.less'
import SearchInput from '_c/tables/SearchInput'

export default {
  name: 'Tables',
  components: { SearchInput },
  computed: {
    searchInput () {
      let val
      if (!this.searchKey) {
        val = {
          type: 'input'
        }
      } else {
        this.columns.map(item => {
          if (item.key === this.searchKey) {
            val = item.search
          }
        })
      }
      return val
    }
  },
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    size: String,
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default () {
        return ''
      }
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可搜索
     */
    searchable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 搜索控件所在位置，'top' / 'bottom'
     */
    searchPlace: {
      type: String,
      default: 'top'
    }
  },
  /**
   * Events
   * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
   * @on-cancel-edit 返回值 {Object} 同上
   * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
   */
  data () {
    return {
      insideColumns: [],
      insideTableData: [],
      edittingCellId: '',
      edittingText: '',
      searchValue: '',
      searchKey: ''
    }
  },
  methods: {
    changeSearchKey () {
      console.log(' %c 🐱‍🏍 this.$refs.searchInput: ', 'font-size:20px;background-color: #42b983;color:#fff;', this.$refs.searchInput)
      this.$refs.searchInput.init()
    },
    suportEdit (item, index) {
      item.render = (h, params) => {
        return h(TablesEdit, {
          props: {
            params: params,
            value: this.insideTableData[params.index][params.column.key],
            edittingCellId: this.edittingCellId,
            editable: this.editable
          },
          on: {
            input: val => {
              this.edittingText = val
            },
            'on-start-edit': (params) => {
              this.edittingCellId = `editting-${params.index}-${params.column.key}`
              this.$emit('on-start-edit', params)
            },
            'on-cancel-edit': (params) => {
              this.edittingCellId = ''
              this.$emit('on-cancel-edit', params)
            },
            'on-save-edit': (params) => {
              this.value[params.row.initRowIndex][params.column.key] = this.edittingText
              this.$emit('input', this.value)
              this.$emit('on-save-edit', Object.assign(params, { value: this.edittingText }))
              this.edittingCellId = ''
            }
          }
        })
      }
      return item
    },
    surportHandle (item) {
      const options = item.options || []
      const insideBtns = []
      options.forEach(item => {
        if (handleBtns[item]) insideBtns.push(handleBtns[item])
      })
      const btns = item.button ? [].concat(insideBtns, item.button) : insideBtns
      item.render = (h, params) => {
        params.tableData = this.value
        return h('div', btns.map(item => item(h, params, this)))
      }
      return item
    },
    handleColumns (columns) {
      this.insideColumns = columns.map((item, index) => {
        let res = item
        if (res.editable) {
          res = this.suportEdit(res, index)
        }

        if (res.key === 'handle') res = this.surportHandle(res)
        return res
      })
    },
    setDefaultSearchKey () {
      // this.searchKey = (this.columns[0].key && this.columns[0].key !== 'handle') ? this.columns[0].key : (this.columns.length > 1 ? this.columns[1].key : '')
    },
    handleClear (e) {
      if (e.target.value === '') this.insideTableData = this.value
    },
    // 点击搜索 和 watch(value)变化调用, 过滤搜索后的结果
    handleSearch () {
      // this.$Message.info(this.searchKey)
      // console.log(' %c 🐱‍🏍 this.searchKey: ', 'font-size:20px;background-color: #42b983;color:#fff;', this.searchKey)
      this.$emit('searchEvent', {
        searchKey: this.searchKey,
        searchValue: this.searchValue
      })
      // this.insideTableData = this.value.filter(item => {
      //   return item[this.searchKey].indexOf(this.searchValue) > -1
      // })
    },
    handleTableData () {
      this.insideTableData = this.value.map((item, index) => {
        const res = item
        res.initRowIndex = index
        return res
      })
    },
    exportCsv (params) {
      this.$refs.tablesMain.exportCsv(params)
    },
    clearCurrentRow () {
      this.$refs.talbesMain.clearCurrentRow()
    },
    onCurrentChange (currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow)
    },
    onSelect (selection, row) {
      this.$emit('on-select', selection, row)
    },
    onSelectCancel (selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    onSelectAll (selection) {
      this.$emit('on-select-all', selection)
    },
    onSelectionChange (selection) {
      this.$emit('on-selection-change', selection)
    },
    onSortChange (column, key, order) {
      this.$emit('on-sort-change', column, key, order)
    },
    onFilterChange (row) {
      this.$emit('on-filter-change', row)
    },
    onRowClick (row, index) {
      this.$emit('on-row-click', row, index)
    },
    onRowDblclick (row, index) {
      this.$emit('on-row-dblclick', row, index)
    },
    onExpand (row, status) {
      this.$emit('on-expand', row, status)
    }
  },
  watch: {
    columns (columns) {
      this.handleColumns(columns)
      this.setDefaultSearchKey()
    },
    value (val) {
      this.handleTableData()
      // if (this.searchable) this.handleSearch()
    },
    searchBtnClick () {
      this.$Message.info(this.searchKey + ',' + this.searchValue)
    }
  },
  mounted () {
    this.handleColumns(this.columns)
    this.setDefaultSearchKey()
    this.handleTableData()
  }
}
</script>

<style lang="scss" scoped>
.m-table {
  ::v-deep .ivu-card {
    display: flex;
  }
}
.search-con {
  display: flex;
}
</style>
