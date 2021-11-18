<template>
  <div>
    <Row :gutter="10">
      <Col span="5" :xs="12" :sm="8" :md="5" :lg="9">
        <Card :dis-hover="true" :shadow="true">
          <menu-tree :selectTreeNode="selectTreeNode" :treeData="treeData"
                     @addMenu="addMenu" @updateMenu="updateMenu" @deleteMenu="deleteMenu"
                     @handleTreeChange="handleTreeChange"
          ></menu-tree>
        </Card>
      </Col>
      <Col span="19" :xs="12" :sm="16" :md="19" :lg="15">
        <Card :dis-hover="true" :shadow="true" :title="$t('menu Options')" :icon="'ios-list'"
              style="margin-bottom: 10px;">
          <menu-form v-model="formItem" ref="menuForm" :isEdit="isEdit" :treeData="treeData" @submitEvent="submit"
                     @cancelEvent="cancelForm"></menu-form>
        </Card>
        <Card :dis-hover="true" :shadow="true" :title="$t('resources')" :icon="'ios-options'">
          <tables stripe border :key="3" ref="tables" editable searchable search-place="top" v-model="tableData"
                  :columns="columns" @on-select="onSelect" @on-select-cancel="onSelectCancel"
                  @on-select-all="onSelectAll"
                  @on-select-all-cancel="onSelectAllCancel"
                  @searchEvent="searchSubmit"
          >
            <template v-slot:headerCenter>
              <Button type="primary" class="add-user-btn" @click="handleAddUser">
                <Icon type="ios-add-circle-outline"/>
                新增用户
              </Button>
            </template>
          </tables>
          <div class="page-box">
            <Button type="primary" @click="exportExcel">导出为Csv文件
            </Button>
            <Button type="error" v-if="selectedArr.length>0"
                    @click="handleDeleteBatch"
            >批量删除
            </Button>
            <page :total="pageFrom.total" :current="pageFrom.page" show-total size="small" show-elevator show-sizer
                  class="m-page"
                  @on-change="pageChange" @on-page-size-change="limitChange"></page>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getNode, sortObj } from '@/libs/util'
import MenuForm from '@/view/menu/MenuForm'
import MenuTree from '@/view/menu/MenuTree'
import { addMenu, getMenu, updateMenu, deleteMenu } from '@/api/request'

export default {
  name: 'index',
  components: {
    MenuTree,
    MenuForm,
    Tables
  },
  data () {
    return {
      selectTreeNode: [],
      treeData: [],
      addMenuType: '',
      formItem: {
        title: '',
        path: '',
        type: 'menu',
        name: '',
        component: '',
        href: '',
        sort: '',
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        icon: '',
        redirect: ''
      },
      isEdit: false,
      pageFrom: {
        total: 40,
        page: 1,
        limit: 10
      },
      tableData: [],
      selectedArr: [],
      columns: []
    }
  },
  methods: {
    resetFormItem () {
      this.$refs.menuForm.$refs.formItem.resetFields()
      this.isEdit = false
      this.addMenuType = ''
      // 这是是在编辑菜单后,再新增菜单后会两个选中的情况.而formItem.selected是true,也就是选择的状态,会导致新增菜单后出现两个选中的情况
      this.formItem.selected = false
    },

    // 广度搜索不适合无法适用于当前增删改,只适合查找, 新增修改删除都需要得到节点的父节点,而广度搜索是拍扁的数组,无法找到父节点,只能使用深度查找
    // curdMenuBfs (parent, data, fn, key = 'nodeKey') {
    //   const root = []
    //   root.push(...parent)
    //   while (root.length > 0) {
    //     const q = root.shift()
    //     if (q[key] === data[key]) {
    //       fn(q)
    //       return parent
    //     }
    //     if (q.children && q.children.length > 0) {
    //       for (const item of q) {
    //         root.push(item)
    //       }
    //     }
    //   }
    // },
    curdMenu2 (parent, node, fn) {
      for (const index in parent) {
        if (parent[index].nodeKey === node.nodeKey) {

          fn && fn(parent, index)
          return parent
        } else {
          if (parent[index].children && parent[index].children.length > 0) {
            const result = this.curdMenu2(parent[index].children, node, fn)
            if (result) return parent
          }
        }
      }
      // return parent
    },
    curdMenu (parent, node, type, selectNode) {
      for (const index in parent) {
        const data = type === 'add' ? selectNode : node
        if (parent[index].nodeKey === data.nodeKey) {
          if (type === 'add') {
            parent.splice(node.sort, 0, node)
          } else if (type === 'update') {
            if (data.sort === index) {
              parent.splice(index, 0, data)
            } else {
              parent.splice(index, 1, data)
              parent.splice(data.sort, 0, data)
              this.selectTreeNode.splice(index, 1, data)
            }
          } else if (type === 'delete') {
            parent.splice(index, 1)
            this.selectTreeNode.splice(0, 1)
          }
          return parent
        } else {
          if (parent[index].children && parent[index].children.length > 0) {
            this.curdMenu(parent[index].children, node, type, selectNode)
          }
        }
      }
      return parent
    },
    async submit (ecModel, newSnapshot) {
      const valid = await this.$refs.menuForm.$refs.formItem.validate()
      if (!valid) {
        this.$Message.error('请检查表单!')
        return
      }
      const data = {
        ...this.formItem,
        expend: true
      }
      // 如果sort没有输入,那么就为 this.treeData的长度, 否则减一 最小为0
      data.sort = (data.sort === '' || typeof data.sort === 'undefined') ? this.treeData.length : (data.sort = data.sort - 1 >= 0 ? data.sort - 1 : 0)

      if (this.addMenuType === 'bro') {
        if (this.selectTreeNode.length === 0) {
          addMenu(data).then(res => {
          })
          this.treeData.push(data)

        } else {
          const select = this.selectTreeNode[0]
          const isRootNode = (node) => {
            for (let i = 0; i < node.length; i++) {
              if (node[i].nodeKey === select.nodeKey) {
                return true
              }
            }
          }
          if (isRootNode(this.treeData)) {
            addMenu(data).then(res => {
              if (data.sort >= parent.length) {
                this.treeData.push(res.data.data)
              } else {
                this.treeData.split(data.sort, 0, res.data.data)
              }
            })
          } else {
            this.treeData = this.curdMenu2(this.treeData, select, (parent, index) => {
              if (data.sort >= parent.length) {
                parent.push(data)
              } else {
                parent.split(data.sort, 0, data)
              }
            })
            const rootNode = getNode(this.treeData, this.selectTreeNode[0])
            updateMenu(rootNode).then(res => {
            })
          }
        }
      } else if (this.addMenuType === 'children') {
        if (typeof this.selectTreeNode[0].children === 'undefined') {
          this.$set(this.selectTreeNode[0], 'children', [data])
        } else {
          this.selectTreeNode[0].children.splice(data.sort, 0, data)
        }
        const rootNode = getNode(this.treeData, this.selectTreeNode[0])
        updateMenu(rootNode).then(res => {
        })
      } else {
        // 这是点击更新后 点击提交表单
        this.curdMenu2(this.treeData, data, (parent, index) => {
          if (data.sort === parent.sort) {
            parent.splice(index, 0, data)
          } else {
            parent.splice(index, 1)
            parent.splice(data.sort, 0, data)
          }
        })
        this.$set(this.selectTreeNode, 0, data)
      }
      this.resetFormItem()
    },
    cancelForm () {
      this.resetFormItem()
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    // drop 新增 修改 删除
    addMenu (name) {
      this.resetFormItem()
      this.isEdit = true
      this.addMenuType = name
    },
    updateMenu () {
      if (this.selectTreeNode.length > 0) {
        this.resetFormItem()
        this.isEdit = true
        /* 这里不能直接赋值 this.formItem = this.selectTreeNode[0]
        *   这是相当于this.formItem直接引用了this.selectTreeNode[0]的值
        * 否则在对this.formItem重置时, 也会重置this.selectTreeNode[0]的值
        * */
        this.formItem = { ...this.selectTreeNode[0] }
        // for (const key in this.formItem) {
        //   this.formItem[key] = this.selectTreeNode[0][key]
        // }
      } else {
        this.$Message.info('亲,你没有选择节点哦')
      }
    },
    deleteMenu () {
      if (this.selectTreeNode.length > 0) {
        this.resetFormItem()
        this.$Modal.info({
          title: '确认删除?',
          content: `确认删除 ${this.selectTreeNode[0].title} 的菜单吗?`,
          onOk: () => {
            const rootNode = getNode(this.treeData, this.selectTreeNode[0])
            if (rootNode.nodeKey === this.selectTreeNode[0].nodeKey) {
              deleteMenu(rootNode).then(res => {
              })
            } else {
              updateMenu(rootNode).then(res => {
              })
            }
            this.curdMenu2(this.treeData, this.selectTreeNode[0], (parent, index) => {
              parent.splice(index, 1)
              this.selectTreeNode.splice(0, 1)
            })
          }
        })
      } else {
        this.$Message.info('亲,你没有选择节点哦')
      }
    },
    // tree 选中事件
    handleTreeChange (item) {
      this.selectTreeNode = item
    },
    // 这是表格事件
    pageChange (page) {
      this.pageFrom.page = page
      this._getUserList()
    },
    limitChange (limit) {
      this.pageFrom.limit = limit
      this._getUserList()
    },
    onSelect (selection, row) {
      this.selectedArr = selection
    },
    onSelectCancel (selection) {
      this.selectedArr = selection
    },
    onSelectAll (selection) {
      this.selectedArr = selection
    },
    onSelectAllCancel (selection) {
      this.selectedArr = selection
    },
    handleAddUser () {
    },
    searchSubmit () {
    },
    _getMenu () {
      getMenu().then(res => {
        this.treeData = res.data.data
      })
    }
  },
  mounted () {
    window.vue = this
    this._getMenu()
  }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 991px) {
  .m-btn {
    ::v-deep .ivu-btn {
      .btn-val {
        display: none;
      }
    }

  }
}

.add-user-btn {
  margin-left: auto;
  //::v-deep .ivu-btn-primary {
  //  margin: 0 10px;
  //}
}

.page-box {
  padding: 10px 0;
  display: flex;

  .m-page {
    margin-left: auto;
  }

  ::v-deep button {
    margin-right: 20px;
  }
}

</style>
