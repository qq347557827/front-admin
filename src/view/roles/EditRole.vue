<template>
  <div>
    <Form :model="formItem" :rules="ruleRoleForm" ref="ruleRoleForm" label-colon label-position="top">
      <FormItem label="角色名称" prop="title">
        <Input v-model="formItem.title" placeholder="Enter something..."></Input>
      </FormItem>
      <FormItem label="角色编码" prop="code">
        <Input v-model="formItem.code" placeholder="Enter something..."></Input>
      </FormItem>
      <FormItem label="角色描述">
        <Input v-model="formItem.describe" placeholder="Enter something..."></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submitEvent">提交</Button>
        <Button style="margin-left: 8px" @click="cancelEvent">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'EditRole',
  model: {
    prop: 'formItem',
    event: 'input'
  },
  props: {
    formItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      ruleRoleForm: {
        title:[
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    cancelEvent() {
      this.$emit('cancelEvent')
    },
    submitEvent() {
      this.$emit('submitEvent')
    }
  }

}
</script>

<style scoped>

</style>
