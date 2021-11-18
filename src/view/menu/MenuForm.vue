<template>
  <div>
    <Form :model="formItem" ref="formItem" :label-width="100" :disabled="!isEdit" :rules="fromRules">
      <FormItem label="菜单标题" prop="title" class="ivu-form-item-required">
        <Input v-model="formItem.title" placeholder="请输入菜单标题"></Input>
      </FormItem>

      <FormItem label="菜单类型" prop="type">
        <Select v-model="formItem.type">
          <Option value="menu">菜单</Option>
          <Option value="resource">资源</Option>
          <Option value="link">资源</Option>
        </Select>
      </FormItem>
      <FormItem label="组件名称" prop="name">
        <Input v-model="formItem.name" placeholder="请输入组件名称"></Input>
      </FormItem>
      <template v-if="formItem.type !== 'link'">
        <FormItem label="路径" prop="path" class="ivu-form-item-required">
          <Input v-model="formItem.path" placeholder="请输入路径名称"></Input>
        </FormItem>
        <FormItem label="组件" prop="component">
          <Input v-model="formItem.component" placeholder="请输入组件名"></Input>
        </FormItem>
        <FormItem label="面包屑" prop="hideInBread">
          <i-switch v-model="formItem.hideInBread" size="large">
            <span slot="open">显示</span>
            <span slot="close">不显示</span>
          </i-switch>
        </FormItem>
        <FormItem label="菜单显示" prop="hideInMenu">
          <i-switch v-model="formItem.hideInMenu" size="large">
            <span slot="open">显示</span>
            <span slot="close">不显示</span>
          </i-switch>
        </FormItem>
        <FormItem label="是否使用缓存" prop="notCache">
          <i-switch v-model="formItem.notCache" size="large">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
      </template>
      <template v-else>
        <FormItem label="链接" prop="href">
          <Input v-model="formItem.href" placeholder="请输入链接"></Input>
        </FormItem>
      </template>

      <FormItem label="排序" prop="sort">
        <Input v-model.number="formItem.sort" placeholder="请输入排序, 从1开始,不输入默认在最后面"></Input>
      </FormItem>

      <FormItem label="图标" prop="icon">
        <Input v-model="formItem.icon" placeholder="请输入图标名称"></Input>
      </FormItem>
      <FormItem label="重定向" prop="redirect">
        <Input v-model="formItem.redirect" placeholder="重定向组件"></Input>
      </FormItem>
      <FormItem v-if="isEdit">
        <Button type="primary" @click="submit">确定</Button>
        <Button style="margin-left: 8px" @click="cancelForm">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'MenuForm',
  model: {
    prop: 'formItem',
    event: 'input'
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    formItem: {
      type: Object,
      default: () => {}
    },
    treeData: {
      type: Array
    }
  },
  data () {
    var validateIsVal = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('亲,这里必须填写哟'))
      } else {
        const key = rule.field
        // const isComponent = this.findMenu(this.treeData, key, value)
        // const isComponent = this.findMenuBfs(this.treeData, key, value)
        // 这里主要还是应对修改菜单时,提示处在。在findMenuBfs2找到值后, 通过回调函数传入对比两个的nodeKey是否一致来判断是否是在修改菜单
        const isComponent = this.findMenuBfs2(this.treeData, key, value, (parent) => {
          if (this.formItem.nodeKey !== parent.nodeKey) {
            return true
          }
        })
        if (isComponent) {
          callback(new Error('已处在,请检查'))
        } else {
          callback()
        }
      }
    }
    return {
      fromRules: {
        title: [{
          validator: validateIsVal,
          trigger: 'blur'
        }],
        path: [{
          validator: validateIsVal,
          trigger: 'blur'
        }],
        component: [{
          required: true,
          message: '请输入组件',
          trigger: 'blur'
        }]
      },
    }
  },
  methods: {
    // 采用深度优先查找
    findMenu (parent, key, value) {
      for (const item of parent) {
        if (item[key] === value) {
          return true
        } else {
          if (item.children && item.children.length > 0) {
            const flg = this.findMenu(item.children, key, value)
            if (flg) return flg
          }
        }
      }
    },
    // 采用广度优先查找
    findMenuBfs (parent, key, value) {
      const root = []
      root.push(...parent)
      while (root.length > 0) {
        const q = root.shift()
        if (q[key] === value) return true
        if (q.children && q.children.length > 0) {
          q.children.forEach(item => {
            root.push(item)
          })
        }
      }
    },
    findMenuBfs2 (parent, key, value, fn) {
      const root = []
      root.push(...parent)
      for (const rootElement of root) {
        if (rootElement[key] === value) {
          const flg = fn(rootElement)
          if (flg) return true
        }
        if (rootElement.children && rootElement.children.length > 0) {
          for (const child of rootElement.children) {
            root.push(child)
          }
        }
      }
    },
    submit () {
      this.$emit('submitEvent')
    },
    cancelForm () {
      this.$emit('cancelEvent')

    }
  }
}
</script>

<style scoped>

</style>
