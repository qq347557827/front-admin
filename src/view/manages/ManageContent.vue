<template>
  <div>
    <Card>
      <tables stripe border :key="3" ref="tables" editable searchable search-place="top" v-model="tableData"
              :columns="columns">
        <!--        <template v-slot:created="{ row }">-->
        <!--          <div>{{row}}}</div>-->
        <!--        </template>-->
        <!--        插槽模板语法只有在这个组件里面才可以,这个组件的封装出来的-->

      </tables>
      <div class="page-box">
        <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
        <page :total="pageFrom.total" show-total size="small" show-elevator show-sizer class="m-page"
              @on-change="pageChange" @on-page-size-change="limitChange"></page>
      </div>
    </Card>
    <!--    <div>-->
    <!--      <div>123265</div>-->
    <!--      <i-switch></i-switch>-->
    <!--    </div>-->
  </div>
</template>

<script>
import Tables from '_c/tables'
import editModle from '@/view/manages/editModle'
import { getLists, updatePost } from '@/api/request'

import moment from 'dayjs'

export default {
  name: 'manage_content',
  components: {
    Tables
  },
  data () {
    return {
      pageFrom: {
        total: 40,
        page: 1,
        limit: 10
      },
      columns: [
        {
          title: '文章标题',
          key: 'title',
          width: 260,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'uid',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.uid.name)
          }
        },
        {
          title: '等级',
          width: 100,
          key: 'isVip',
          align: 'center',
          render: (h, params) => {
            const vip = params.row.uid.isVip > 0 ? 'VIP' + params.row.uid.isVip : '普通用户'
            return h('div', vip)
          }
        },
        {
          title: '头像',
          // key: 'uid',
          width: 100,
          key: 'pic',

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
                      src: params.row.uid.pic
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
        },
        {
          title: '完结',
          width: 80,
          key: 'isEnd',

          align: 'center',
          render: (h, params) => {
            return h('div', params.row.isEnd === '0' ? '未结' : '已结')
          }
        },
        {
          title: '回答',
          key: 'answer',
          width: 80,
          align: 'center',
        },
        {
          title: '阅读',
          key: 'reads',
          width: 80,
          align: 'center',
        },
        // {
        //   title: '阅读',
        //   key: 'reads',
        //   width: 80,
        //   align: 'center',
        // },
        {
          title: '置顶',
          width: 120,
          key: 'isTop',

          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  size: 'large',
                  value: params.row.isTop === '1'
                },
                scopedSlots: {
                  open: () => {
                    return h('span', '开')
                  },
                  close: () => {
                    return h('span', '关')
                  }
                },
                on: {
                  'on-change': (flg) => {
                  }
                }
              })
            ])
          }

        },
        {
          title: '状态',
          key: 'status',

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
                      render: (childH) => {
                        return childH(editModle, {
                          props: {
                            data: currentItem
                          }
                        })
                      },
                      onOk: () => {
                        this.$Message.info('Clicked ok')

                        updatePost(currentItem).then(res => {
                          if (res.data.code === 200) {
                            this.tableData.splice(params.index, 1, currentItem)
                          }
                        })
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
    handleDelete (params) {
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    pageChange (page) {
      this.pageFrom.page = page
    },
    limitChange (limit) {
      this.pageFrom.limit = limit
    }
  },
  mounted () {
    getLists().then(res => {
      if (res.data.code === 200) {
        this.tableData = res.data.data
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.page-box {
  display: flex;
  align-items: center;

  .m-page {
    margin-left: auto;
  }
}
::v-deep.mg-L-R {
  margin: 0 5px;
}
</style>
<!--<style lang="scss">-->
<!--.page-box {-->
<!--  display: flex;-->
<!--}-->
<!--</style>-->
