import { createStore } from 'vuex'
import state from './state';
import getters from './getter';
import mutations from './mutations';
import actions from './actions';
import persistedState from "vuex-persistedstate"
export default createStore({
  state,
  mutations,
  getters,
  actions,
  plugins: [persistedState({ storage: window.localStorage })]
  // plugins: [createPersistedState({
  //   storage: window.sessionStorage,
  //   reducer(data) {
  //    return {
  //      userSetingDialog: data.userSetingDialog,
  //      userInfo: data.userInfo,
  //      customerInfo:data.customerInfo
  //   }
  //   }
  //  })]
})
