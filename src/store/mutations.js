import * as TYPES from "./types";
const mutations = {
	[TYPES.userSetingDialog](state, v) {
		state.userSetingDialog = v;
	},
	[TYPES.setWallet](state, v) {
		state.wallet = v;
	},
	[TYPES.setWalletAddr](state, v) {
		state.walletAddr = v;
	},
	[TYPES.setUserInfo](state, v) {
		state.userInfo = v;
	},
	[TYPES.setCustomerInfo](state, v) {
		state.customerInfo = v;
	},
	[TYPES.setBlockList](state, v) {
		state.blockList = v;
	},
	[TYPES.setEmail](state, v) {
		state.email = v;
	},
	[TYPES.setFilterGroupId](state, v) {
		state.filterGroupId = v;
	},
	[TYPES.refreshBlockList](state, v) {
		state.refreshBlockList = v;
	},
	[TYPES.isDashboard](state, v) {
		state.isDashboard = v;
	},
}
export default mutations