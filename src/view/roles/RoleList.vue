<template>
  <div class="role-list">
<!--    <div class="title">-->
<!--      -->
<!--    </div>-->
    <ul>
      <li v-for="(item, index) in rolelistData" :key="index">
        <span class="ivu-tree-title" @click="active(item, index)" :class="{'ivu-tree-title-selected':index === activeId}">{{item.title}}</span>
        <ButtonGroup class="btn-right">
          <Button type="text" ghost  @click="editEvent(item, index)">
            <Icon type="md-build" color="#2d8cf0"/>
          </Button>
          <Button type="text" ghost @click="deleteEvent(index)">
            <Icon type="md-trash"  color="#ed4014"/>
          </Button>
        </ButtonGroup>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'RoleList',
  props: {
    rolelistData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      activeId: undefined,
    }
  },
  methods: {
    active(item, index) {
      if (this.activeId === index) {
        this.activeId = undefined
        this.$emit('cancelSelect')
      } else {
        this.activeId = index
        this.$emit('onSelect', item, index)
      }
    },
    editEvent(item, index) {
      console.log(' %c 🐱‍🏍 item: ', 'font-size:20px;background-color: #42b983;color:#fff;', item)
      this.$emit('editEvent', item, index)
    },
    deleteEvent(index) {
      this.$emit('deleteEvent', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 16px;
}
li {
  height: 32px;
  //margin: 8px 0;
  display: flex;
  align-items: center;
  .btn-right {
    display: none;
    margin-left: auto;
  }
  &:hover {
    .btn-right {
      display: block;
    }
  }
}


.role-list {
  background-color: #fff;
}
.ivu-tree-title-selected {
  background-color: #d5e8fc;
}
</style>
