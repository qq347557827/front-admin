<template>
  <div>
    <Card>
      <tables stripe border :key="3" ref="tables" editable searchable search-place="top" v-model="tableData"
              :columns="columns" @on-select="onSelect" @on-select-cancel="onSelectCancel" @on-select-all="onSelectAll"
              @on-select-all-cancel="onSelectAllCancel"
              @searchEvent="searchSubmit"
      >
        <!--        <template v-slot:created="{ row }">-->
        <!--          <div>{{row}}}</div>-->
        <!--        </template>-->
        <!--        插槽模板语法只有在这个组件里面才可以,这个组件的封装出来的-->

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
        <page :total="pageFrom.total" :current="pageFrom.page" show-total size="small" show-elevator show-sizer class="m-page"
              @on-change="pageChange" @on-page-size-change="limitChange"></page>
      </div>
    </Card>

    <Modal :value="isModal"  :mask-closable="false" width="360" footer-hide @on-visible-change="isModalChange">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>新增用户</span>
      </p>
      <add @closeEvent="closeModel" :roles="roles" @submitEvent="submitModle" ref="addUser"></add>

    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import editModle from './edit'
import add from './add'

import moment from 'dayjs'
import { addUser, deleteUser, getUserList, getRolesTitle } from '@/api/request'

export default {
  components: {
    Tables,
    add
  },
  name: 'user',
  data () {
    return {
      roles: [],
      isModal: false,
      pageFrom: {
        total: 40,
        page: 1,
        limit: 10
      },
      options: {},
      selectedArr: [],
      columns: [
        {
          type: 'selection',
          searchHidden: true,
          width: 60,
          align: 'center'
        },
        {
          title: '用户名',
          key: 'name',
          width: 150,
          align: 'center',
          search: {
            type: 'input'
          }
          // render: (h, params) => {
          //   return h('div', params.row.uid.name)
          // }
        },
        {
          title: '登录名',
          key: 'username',
          align: 'center',
          width: 260,
          search: {
            type: 'input'
          }
          // render: (h, params) => {
          //   return h('div', params.row.uid.name)
          // }
        },
        {
          title: '等级',
          width: 100,
          key: 'isVip',
          align: 'center',
          search: {
            type: 'select',
            searchList: [
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
            ]
          },
          render: (h, params) => {
            const vip = params.row.isVip > 0 ? 'VIP' + params.row.isVip : '普通用户'
            return h('div', vip)
          }
        },
        {
          title: '头像',
          // key: 'uid',
          width: 100,
          key: 'pic',
          searchHidden: true,
          align: 'center',
          render: (h, params) => {
            return h('div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              },
              [
                h(
                  'img',
                  {
                    style: {
                      width: '48px'
                    },
                    attrs: {
                      src: params.row.pic
                    }
                  }
                )
              ]
            )
          }
        },

        {
          title: '時間',
          width: 150,
          key: 'created',
          align: 'center',
          search: {
            type: 'date'
          },
          render: (h, params) => {
            const created = moment(params.row.created).format('YYYY-MM-DD')
            return h('div', [
              h('span', created),
              h('br'),
              h('span', moment(params.row.created).format('HH:mm:ss'))
            ])
          }
        },
        {
          title: '积分',
          key: 'favs',
          width: 80,
          align: 'center',
          search: {
            type: 'number'
          }
        },
        {
          title: '权限',
          key: 'roles',
          width: 200,
          align: 'center',
          search: {
            type: 'checkbox',
            searchList: ['user', 'admin', 'super_admin']
          },
          render: (h, params) => {
            const str = params.row.roles ? params.row.roles.join(',') : ''
            return h('div', str)
          }
        },
        // {
        //   title: '阅读',
        //   key: 'reads',
        //   width: 80,
        //   align: 'center',
        // },
        {
          title: '是否禁言',
          key: 'status',
          search: {
            type: 'radio',
            searchList: [{
              value: '0',
              key: '否'
            }, {
              value: '1',
              key: '是'
            }]
          },
          render: (h, params) => {
            return h('div', [
              h('Tag', {
                props: {
                  color: params.row.status === '0' ? 'success' : 'error'
                },
                style: {},
                domProps: {
                  innerText: params.row.status === '0' ? 'on' : 'off'
                },
                nativeOn: {
                  click: () => {
                    if (params.row.status === '0') {
                      params.row.status = '1'
                    } else {
                      params.row.status = '0'
                    }
                  },
                  'on-change': () => {
                  }
                }
              })
            ])
          }
        },
        {
          title: '操作',
          key: 'setting',
          searchHidden: true,
          minWidth: 120,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                nativeOn: {
                  click: () => {
                    const currentItem = { ...params.row }
                    this.$Modal.confirm({
                      icon: 'md-create',
                      title: '用户信息编辑',
                      render: (childH) => {
                        return childH(editModle, {
                          props: {
                            data: currentItem
                          }
                        })
                      },
                      onOk: () => {
                        this.$Message.info('Clicked ok')
                        this.tableData.splice(params.index, 1, currentItem)
                        // updatePost(currentItem).then(res => {
                        //   if (res.data.code === 200) {
                        //     this.tableData.splice(params.index, 1, currentItem)
                        //   }
                        // })
                      },
                      onCancel: () => {
                        this.$Message.info('Clicked cancel')
                      }
                    })
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                class: ['mg-L-R'],
                nativeOn: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '确认删除' + params.row._id + '吗',
                      onOk: () => {
                        this.$Message.info('Clicked ok')
                      },
                      onCancel: () => {
                        this.$Message.info('Clicked cancel')
                      }
                    })
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      tableData: []
    }
  },
  methods: {
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    pageChange (page) {
      this.pageFrom.page = page
      this._getUserList()
    },
    limitChange (limit) {
      this.pageFrom.limit = limit
      this._getUserList()
    },
    _getUserList () {
      console.log(' %c 🐱‍🏍 this.options: ', 'font-size:20px;background-color: #42b983;color:#fff;', this.options)
      getUserList({
        page: this.pageFrom.page,
        limit: this.pageFrom.limit,
        options:this.options
      }).then(res => {
        console.log(' %c 🐱‍🏍 res: ', 'font-size:20px;background-color: #42b983;color:#fff;', res)
        if (res.data.code === 200) {
          this.tableData = res.data.data
          console.log(' %c 🐱‍🏍 this.tableData: ', 'font-size:20px;background-color: #42b983;color:#fff;', this.tableData)
          this.pageFrom.total = res.data.total
        }
      })
    },
    searchSubmit (from) {
      console.log(' %c 🐱‍🏍 from: ', 'font-size:20px;background-color: #42b983;color:#fff;', from)
      // console.log(' %c 🐱‍🏍 typeof from.searchValue: ', 'font-size:20px;background-color: #42b983;color:#fff;', typeof from.searchValue)
      if (!from.searchValue) {
        this.options = {}
      } else {
        this.options = from
        this.$set(this.pageFrom, 'page', 1)

      }
      this._getUserList()
      console.log(' %c 🐱‍🏍 this.options: ', 'font-size:20px;background-color: #42b983;color:#fff;', this.options)
    },
    handleAddUser () {
      this.isModal = true

      // let currentItem = {}
      // let loading = true
      // this.$Modal.confirm({
      //   icon: 'md-create',
      //   title: '新增用户',
      //   loading: loading,
      //
      //   render: (h) => {
      //     // return h(add, {
      //     //   ref: 'addUser'
      //     // })
      //     return this.$createElement(add, {
      //       ref: 'addUser',
      //       props: {
      //
      //       }
      //     })
      //   },
      //   onOk: () => {
      //     // this.$Message.info('Clicked ok')
      //     console.log(' %c 🐱‍🏍 that: ', 'font-size:20px;background-color: #42b983;color:#fff;', that)
      //     console.log(' %c 🐱‍🏍 this.$refs.addUser: ', 'font-size:20px;background-color: #42b983;color:#fff;', this.$refs.addUser)
      //     this.$refs.addUser.handleSubmit(() => {
      //       this.$Modal.remove()
      //     })
      //     // this.tableData.splice(params.index, 1, currentItem)
      //     // updatePost(currentItem).then(res => {
      //     //   if (res.data.code === 200) {
      //     //     this.tableData.splice(params.index, 1, currentItem)
      //     //   }
      //     // })
      //   },
      //   onCancel: () => {
      //     this.$Message.info('Clicked cancel')
      //   }
      // })
    },
    isModalChange (flg) {
      flg || (this.isModal = flg)
    },
    closeModel () {
      this.isModal = false
    },
    submitModle (formItem) {
      addUser(formItem).then(res => {
        if (res.data.code === 200) {
          this.tableData.push(res.data.data)
          this.$refs.addUser.$refs.formValidate.resetFields()
          this.closeModel()
        } else if (res.data.code === 500) {
          // this.$Modal.info({content: res.data.msg})
          this.$Message.info(res.data.msg)
          this.$refs.addUser.$refs.formValidate.fields[1].error = '用户名存在'
        } else if (res.data.code === 400) {
          this.$Message.info(res.data.msg)
          // this.$Modal.info({content: res.data.msg})
        }
      })
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
    handleDeleteBatch () {
      let names = ''
      const idArr = []
      this.selectedArr.forEach(item => {
        names += item.name + '，'
        idArr.push(item._id)
      })
      this.$Modal.confirm({
        content: `请确定删除${names}等用户吗?`,
        onOk: () => {
          this.$Message.info('删除成功')
          deleteUser({ idArr }).then(res => {
            this._getUserList()
          })
        }
      })
    },
    _getRolesTitle () {
      getRolesTitle().then(res => {
        this.roles = res.data.data
        console.log(' %c 🐱‍🏍 this.roles: ', 'font-size:20px;background-color: #42b983;color:#fff;', this.roles)
      })
    }
  },
  created () {
    this._getUserList()
    this._getRolesTitle()
  }
}
</script>

<style lang="scss" scoped>
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
