<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
<!--          <p class="login-tip">输入任意用户名和密码即可</p>-->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password, code, sid }) {
      const spin = this.$Spin
      spin.show();
      this.handleLogin({ userName, password, code, sid }).then(res => {
        spin.hide();
        if (res.data.code === 200) {
          this.$Message.info({
            background: true,
            content: `登录成功`
          })
          this.$router.push({
            name: this.$config.homeName
          })
        } else {
          this.$Message.error({
            background: true,
            content: `${res.data.code},${res.data.msg}`
          })
        }
      }).catch(err => {
        spin.hide();
        this.$Message.error({
          background: true,
          content: '连接服务器失败,请重试'
        })
      })
    }
  }
}
</script>

<style>
</style>
