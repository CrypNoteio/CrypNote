import * as TYPES from "./types"
const actions = {
  set_userSetingDialog(vuex, v) {
    vuex.commit(TYPES.userSetingDialog, v)
  },
  set_wallet(vuex, v) {
    vuex.commit(TYPES.setWallet, v)
  },
  set_walletAddr(vuex, v) {
    vuex.commit(TYPES.setWalletAddr, v)
  },

  set_userInfo(vuex, v) {
    vuex.commit(TYPES.setUserInfo, v)
  },
  set_customerInfo(vuex, v) {
    vuex.commit(TYPES.setCustomerInfo, v)
  },
  set_blockList(vuex, v) {
    vuex.commit(TYPES.setBlockList, v)
  },
  set_email(vuex, v) {
    vuex.commit(TYPES.setEmail, v)
  },
  set_filterGroupId(vuex, v) {
    vuex.commit(TYPES.setFilterGroupId, v)
  },
  set_refreshBlockList(vuex, v) {
    vuex.commit(TYPES.refreshBlockList, v)
  },
  set_isDashboard(vuex, v) {
    vuex.commit(TYPES.isDashboard, v)
  }
}
export default actions