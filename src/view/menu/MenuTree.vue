<template>
  <div>
    <Row type="flex" align="middle" justify="center">
      <ButtonGroup class="m-btn">
        <Button size="small">
          <Dropdown trigger="hover" @on-click="addMenu">
            <Icon type="md-add"/>
            <span class="btn-val">新增</span>
            <DropdownMenu slot="list">
              <DropdownItem :disabled="selectTreeNode.length < 1 && treeData.length !== 0" name="bro"
                            :title="selectTreeNode.length < 1 ? '你还没有选中节点': '选中节点' +  selectTreeNode[0].title"
              >兄弟菜单
              </DropdownItem>
              <DropdownItem :disabled="selectTreeNode.length < 1" name="children"
                            :title="selectTreeNode.length < 1 ? '你还没有选中节点': '选中节点' + selectTreeNode[0].title"
              >子菜单
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Button>
        <Button size="small" type="primary" @click="updateMenu">
          <Icon type="ios-create-outline"/>
          <span class="btn-val">修改</span>
        </Button>
        <Button size="small" type="error" @click="deleteMenu">
          <Icon type="md-trash"/>
          <span class="btn-val">删除</span>
        </Button>
      </ButtonGroup>
    </Row>
    <Tree :data="treeData" @on-select-change="handleTreeChange"></Tree>
  </div>
</template>

<script>
export default {
  name: 'MenuTree',
  props: {
    selectTreeNode: {},
    treeData: {
      type: Array
    }

  },
  methods: {
    addMenu (name) {
      this.$emit('addMenu', name)
    },
    updateMenu () {
      this.$emit('updateMenu')
    },
    deleteMenu () {
      this.$emit('deleteMenu')
    },
    handleTreeChange (v) {
      this.$emit('handleTreeChange', v)
    }
  }
}
</script>

<style scoped>

</style>
