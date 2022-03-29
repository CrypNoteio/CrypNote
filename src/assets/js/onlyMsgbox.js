import { ElMessage } from 'element-plus'
 
const showMessage = Symbol('showMessage')
 
class OnlyMessage {
    success (options, single = true) {
        this[showMessage]('success', options, single)
    }
 
    warning (options, single = true) {
        this[showMessage]('warning', options, single)
    }
 
    info (options, single = true) {
        this[showMessage]('info', options, single)
    }
 
    error (options, single = true) {
        this[showMessage]('error', options, single)
    }
 
    [showMessage] (type, options, single) {
        if (single) {
            if (document.getElementsByClassName('el-message').length === 0) {
              ElMessage[type](options)
            }
        } else {
          ElMessage[type](options)
        }
    }
}
 
export default new OnlyMessage()