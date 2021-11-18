import { getSvg } from '@/api/request'
import { v4 as uuid } from 'uuid'

export default {
  data () {
    return {
      svg: ''
    }
  },
  created () {
    console.log('created: ')

    let sid = ''
    if (localStorage.getItem('sid')) {
      sid = localStorage.getItem('sid')
    } else {
      sid = uuid()
      localStorage.setItem('sid', sid)
    }
    console.log(sid)
    this.$store.commit('setSid', sid)
    this._getSvg()
  },
  methods: {
    _getSvg () {
      const sid = this.$store.state.sid
      console.log(sid)
      getSvg(sid).then((res) => {
        // console.log(res);
        this.svg = res.data.svg
        // console.log('this.svg', this.svg);
      })
    },
    getsvg () {
      this._getSvg()
    }
  }
}
