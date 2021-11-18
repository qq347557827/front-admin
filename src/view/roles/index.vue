<template>
  <div>
    <Row :gutter="10">
      <Col span="8">
        <Card :dis-hover="true" :shadow="true" icon="md-contacts" title="角色列表">
          <div slot="extra">
            <a href="#" v-if="editRoleIsActive" @click="editRoleCancel">
              <!--              <Icon type="md-close"/>-->
              <Icon type="ios-folder-outline"/>
            </a>
            <Button type="primary" v-else @click="addEditRole">新增</Button>
          </div>
          <edit-role ref="editRole" v-model="editRoleForm" v-if="editRoleIsActive" @submitEvent="submitRoleForm"
                     @cancelEvent="editRoleCancel"></edit-role>
          <role-list v-else @editEvent="editEvent" @deleteEvent="deleteEvent" :rolelistData="roleData"
                     @cancelSelect="roleCancelSelect" @onSelect="roleOnSelect"
          ></role-list>
        </Card>
      </Col>
      <Col span="4">
        <Card :dis-hover="true" :shadow="true" icon="md-menu" title="菜单列表">
          <Tree :disabled="!editRoleIsActive" :data="menuData" show-checkbox @on-select-change="menuTreeSelect"
                @on-check-change="menuTreeCheck"></Tree>
        </Card>
      </Col>
      <Col span="12">
        <Card :dis-hover="true" :shadow="true" icon="md-exit" title="接口列表">
          <Table :data="tableData" :columns="columns" border
                 @on-select="onSelect" @on-select-cancel="onSelectCancel"
                 @on-select-all="onSelectAll" @on-select-all-cancel="onSelectAllCancel"
          ></Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import Tables from '_c/tables'
import RoleList from '@/view/roles/RoleList'
import EditRole from '@/view/roles/EditRole'
import { getMenu, getRoles, addRole, updateRole, deleteRole } from '@/api/request'
import { getTreeIds, modifyNode, operationCheckChange } from '@/libs/util'

export default {
  name: 'index',
  components: {
    EditRole,
    RoleList,
    Tables
  },
  data () {
    return {
      editRoleIsActive: false,
      isEdit: false,
      isEditIndex: '',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '节点名称',
          key: 'name'
        },
        {
          title: '节点类型',
          key: 'type'
        },
        {
          title: '请求方式',
          key: 'method'
        },
        {
          title: '请求路径',
          key: 'path'
        },
        {
          title: '节点描述',
          key: 'regmark'
        },

      ],
      editRoleForm: {
        title: '',
        code: '',
        describe: '',
        menu: []
      },
      menuSelectNode: [],
      menuSelectIds: [],
      roleData: [],
      menuInitData: [],
      menuData: [],
      oldTableSelectRow: []
    }
  },
  computed: {
    tableData () {
      if (this.menuSelectNode.length > 0) {
        return this.menuSelectNode[0].operation
      } else {
        return []
      }
    }
  },
  methods: {

    // 菜单树事件
    menuTreeSelect (item, index) {
      this.menuSelectNode = item
      // if (item && item.length > 0) {
      //   this.tableData = item[0].operation
      // }
    },
    menuTreeCheck (CheckNode, item) {
      console.log(' %c 🐱‍🏍 item: ', 'font-size:20px;background-color: #42b983;color:#fff;', item)
      if (!this.editRoleIsActive) {
        this.$Modal.info({ title: '非编辑状态无法修改' })
        item.checked = false
      }
      let arr = []
      arr.push(item)
      if (CheckNode.some(o => o._id === item._id)) {
        operationCheckChange(item, '_checked', true)
        // modifyNode(arr, null, '_checked', true)
        // this.editRoleForm.menu = getTreeIds(this.editRoleForm.menu, item, 'add')

      } else {
        // this.editRoleForm.menu = getTreeIds(this.editRoleForm.menu, item, 'delete')
        // modifyNode(arr, null, '_checked', false)
        operationCheckChange(item, '_checked', false)
      }
    },
    // 角色列表事件
    roleOnSelect (item, index) {
      this.init()
      modifyNode(this.menuData, item.menu, 'checked', true)
      this.menuSelectNode = []
    },
    roleCancelSelect () {
      this.init()
      this.menuSelectNode = []
      // modifyNode(this.menuData, null, 'checked', false)
    },
    addEditRole () {
      this.editRoleIsActive = true
      // const menuData = JSON.stringify(modifyNode(this.menuData, null, 'checked', false))
      // localStorage.setItem('menuData', menuData)
      this.init()
    },
    editEvent (item, index) {
      this.editRoleIsActive = true
      this.isEdit = true
      this.isEditIndex = index
      this.editRoleForm = { ...this.roleData[index] }
      this.init()
      modifyNode(this.menuData, item.menu, 'checked', true)
    },
    deleteEvent (index) {
      this.$Modal.confirm({
        title: `确认删除${this.roleData[index].title}吗`,
        onOk: () => {
          deleteRole(this.roleData[index]).then(res => {
            this.roleData.splice(index, 1)
          })
        }
      })
    },
    // 角色表单事件
    // 表单取消 和 点击X
    editRoleCancel () {
      this.editRoleIsActive = false
      this.isEdit = false
      this.editRoleForm.title = ''
      this.editRoleForm.code = ''
      this.editRoleForm.describe = ''
      this.editRoleForm.menu = []
      this.init()
      // this.menuData = JSON.parse(localStorage.getItem('menuData'))
    },
    // 角色表单提交事件
    submitRoleForm () {
      this.$refs.editRole.$refs.ruleRoleForm.validate((valid) => {
        if (valid) {
          this.$Message.success('提交成功!')
          this.editRoleForm.menu = getTreeIds(this.menuData)
          const editRoleForm = JSON.parse(JSON.stringify(this.editRoleForm))
          if (this.isEdit) {
            updateRole(this.editRoleForm).then(res => {
              if (res.data.code === 200) {
                this.roleData.splice(this.isEditIndex, 1, editRoleForm)
              }
            })
          } else {
            // const tmp = JSON.parse(JSON.stringify(this.editRoleForm))
            addRole(this.editRoleForm).then(res => {
              if (res.data.code === 200) {
                this.roleData.push(editRoleForm)
              }
            })
          }
          setTimeout(() => {
            this.editRoleCancel()
          }, 0)
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    onSelect (selection, row) {
      console.log(' %c 🐱‍🏍 select: ', 'font-size:20px;background-color: #42b983;color:#fff;', selection)
      console.log(' %c 🐱‍🏍 row: ', 'font-size:20px;background-color: #42b983;color:#fff;', row)
      selection.forEach(item => item._checked = true)
      // this.editRoleForm.menu = getTreeIds(this.editRoleForm.menu, row, 'add')
    },
    onSelectCancel (selection, row) {
      row._checked = false
      this.tableData.forEach(item => (item._id === row._id) && (item._checked = false)
      )
      console.log(' %c 🐱‍🏍 select: ', 'font-size:20px;background-color: #42b983;color:#fff;', selection)
      // this.editRoleForm.menu = getTreeIds(this.editRoleForm.menu, row, 'delete')
      console.log(' %c 🐱‍🏍 row: ', 'font-size:20px;background-color: #42b983;color:#fff;', row)
    },
    onSelectAll (selection) {
      selection.forEach(item => item._checked = true)
      console.log(' %c 🐱‍🏍 selection: ', 'font-size:20px;background-color: #42b983;color:#fff;', selection)
      // this.editRoleForm.menu = getTreeIds(this.editRoleForm.menu, selection, 'add')
    },
    onSelectAllCancel (selection) {
      this.tableData.forEach(item => item._checked = false)
      console.log(' %c 🐱‍🏍 selection: ', 'font-size:20px;background-color: #42b983;color:#fff;', selection)
      // this.editRoleForm.menu = getTreeIds(this.editRoleForm.menu, this.tableData, 'delete')
    },
    _getMenu () {
      getMenu().then(res => {
        this.menuInitData = res.data.data
        this.init()
      })

    },
    _getRoles () {
      getRoles().then(res => {
        if (res.data.code === 200 && res.data.data && res.data.data.length > 0) {
          this.roleData = res.data.data
        }
      })
    },
    init () {
      this.menuData = JSON.parse(JSON.stringify(this.menuInitData))
    }
  },
  mounted () {
    this._getMenu()
    this._getRoles()
  },
  watch: {
    editRoleIsActive (val, oldval) {
      if (val) {
        // const menuData = JSON.stringify(modifyNode(this.menuData, null, 'checked', false))
        // console.log(' %c 🐱‍🏍 menuData: ', 'font-size:20px;background-color: #42b983;color:#fff;', menuData)
        // localStorage.setItem('menuData', menuData)
      }
    }
  }
}
</script>

<style scoped>

</style>
