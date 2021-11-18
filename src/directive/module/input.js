export default {
  inserted: function (el) {
    el.addEventListener('keypress', function (e) {
      e = e || window.event
      let charcode = typeof e.keyCode == 'number' ? e.keyCode : e.charCode
      let re = /\d/
      console.log(' %c 🐱‍🏍 charcode: ', 'font-size:20px;background-color: #42b983;color:#fff;', charcode)
      if (charcode === 32) {
        console.log('kongge')
      }
      if (charcode == 46) {
        if (el.value.includes('.')) {
          e.preventDefault()
        }
        return
      } else if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          e.returnValue = false
        }
      }
    })
  }
}
