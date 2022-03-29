<template>
  <div class="Nav-container">
    <div class="nav-left">
      <router-link :to="{ path: '/dashboard/workbench' }">
        <img class="beat" src="../../assets/img/logo.png" />
      </router-link>
      <img class="beat" src="../../assets/img/beat.png" style="width: 47px" />
      <div class="nav-bar">
        <router-link exact :to="{ path: '/home' }">Home</router-link>
        <a href="https://w2e.wiki" target="_blank">Noteverse</a>
        <router-link :to="{ path: '/kols' }">Kols</router-link>
        <router-link :to="{ path: '/nft/home' }">NFT</router-link>
        <router-link :to="{ path: '/campaigns' }">Campaigns</router-link>
      </div>
    </div>
    <div class="nav-right default" v-if="!isLogin">
      <router-link :to="{ path: '/login' }"
        ><span class="singIn">Sign In</span></router-link
      >
      <router-link :to="{ path: '/sign' }"
        ><span class="signUp">Sing Up</span></router-link
      >
    </div>
    <div class="nav-right" v-if="isLogin">
      <div class="nav-tight-info" v-if="isDashboard">
        <span>
          <el-dropdown>
            <span
              class="el-dropdown-link newFile"
              style="margin-top: 10px; font-family: 'AvenirNext-DemiBold'"
            >
              <img src="../../assets/img/add.png" />
              New<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template v-slot:dropdown style="z-index: 99">
              <el-dropdown-menu class="newList">
                <el-dropdown-item @click="createFile('Word')"
                  ><img src="../../assets/img/home/homeIcon2.png" alt="" />
                  <span>New word</span>
                </el-dropdown-item>
                <el-dropdown-item @click="createFile('Excel')"
                  ><img src="../../assets/img/home/homeIcon4.png" alt="" />
                  <span>New Excel</span>
                </el-dropdown-item>
                <el-dropdown-item @click="publishArticle"
                  ><img src="../../assets/img/Group.png" alt="" />
                  <span>New Article</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </span>

        <span>
          <message />
        </span>

        <span class="user-photo">
          <el-dropdown trigger="hover" @command="command">
            <span class="el-dropdown-link">
              <img
                v-if="isDefalutAvatar"
                src="../../assets/img/avatar.png"
                style="margin-top: 5px; width: 36px; height: 36px"
              />
              <img
                v-else
                :src="headerImg"
                class="avatar"
                style="margin-top: 5px; width: 36px; height: 36px"
              />
            </span>
            <template v-slot:dropdown style="z-index: 99">
              <el-dropdown-menu class="newList">
                <el-dropdown-item command="homepage"
                  ><img src="../../assets/img/home-icon.png" alt="" />
                  <span>My homepage</span>
                </el-dropdown-item>
                <el-dropdown-item command="settings"
                  ><img src="../../assets/img/setting-icon.png" alt="" />
                  <span>Settings</span>
                </el-dropdown-item>
                <el-dropdown-item command="logout"
                  ><img src="../../assets/img/logout-icon.png" alt="" />
                  <span>Log out</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </span>
        <img
          v-if="!walletConnected"
          :src="walletImg_def"
          @click="connectWallet"
          style="width: 38px; height: 38px"
          @mouseover="Hover('w_d', 1)"
          @mouseout="Hover('w_d', 2)"
        />
        <el-tooltip
          class="box-item"
          effect="light"
          :content="walletAddr"
          placement="bottom"
          v-else
        >
          <img
            :src="walletImg_MM"
            style="width: 38px; height: 38px"
            @mouseover="Hover('w_c', 1)"
            @mouseout="Hover('w_c', 2)"
          />
        </el-tooltip>
      </div>
      <div v-else>
        <router-link :to="{ path: '/dashboard' }"
          ><span class="singIn">Enter the notes</span></router-link
        >
      </div>
    </div>
    <selectBlock
      v-show="dialogFormVisible"
      :fileType="fileType"
      :dialogFormVisible="dialogFormVisible"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  watch,
  computed,
  onMounted,
} from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import defwallet from "@/assets/img/default.png";
import MMwallet from "@/assets/img/default_w.png";
import Hoverdefwallet from "@/assets/img/default_hover.png";
import HoverMMwallet from "@/assets/img/hover_w.png";
import selectBlock from "@/components/addWord/SelectBlock.vue";
import { postData } from "@/actions";
import { getcustomer, baseURL } from "@/actions/api";
import { connectWallet } from "@/assets/js/ConnectWallet";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import {
  VerifyOperationPermissions,
  getCookie,
  setCookie,
  getUserUrl,
} from "@/assets/js/Common";
let headImg = require("../../assets/img/avatar.png");
import Message from "@/components/Message/Message.vue";
export default defineComponent({
  components: {
    selectBlock,
    Message,
  },

  setup() {
    let store = useStore();
    const routers = useRouter();
    const route = useRoute();
    const apptoken = getCookie("apptoken");
    const address = store.state.userInfo?.walletAddress;
    let headerImg = ref("");
    let isDefalutAvatar = ref(true);
    let isLogin = ref(true);
    let isDashboard = ref(store.state.isDashboard);

    watch(
      () => store.state.isDashboard,
      (n, o) => {
        isDashboard.value = n;
      }
    );

    if (!apptoken) {
      isLogin.value = false;
    } else {
      isLogin = true;
    }

    onMounted(() => {
      if (apptoken) {
        custInfo();
        if (
          route.path == "/home" ||
          route.path == "/campaigns" ||
          route.path.indexOf("/dashboard") != -1
        ) {
        } else {
          connectWallet(route.path);
        }
      }
    });
    const publishArticle = () => {
      routers.replace("/quill");
    };
    const custInfo = async () => {
      try {
        const updatedResource = await postData(getcustomer, {
          apptoken: apptoken,
        });
        if (updatedResource.success) {
          //console.log("customerInfo", updatedResource);
          let customerInfo = {
            hasInvited: updatedResource.data.hasInvited,
            headImg: updatedResource.data.headImg,
            intro: updatedResource.data.intro,
            inviteCode: updatedResource.data.inviteCode,
            inviteNum: updatedResource.data.inviteNum,
            twitter: updatedResource.data.twitter,
            userName: updatedResource.data.userName,
            privateUrl: updatedResource.data.privateUrl,
            definedHost: updatedResource.data.definedHost,
            nameservice: updatedResource.data.nameservice,
          };
          store.dispatch("set_customerInfo", customerInfo);
          if (store.state.customerInfo.headImg) {
            isDefalutAvatar.value = false;
            headerImg.value = baseURL + store.state.customerInfo.headImg;
          }
        } else {
          console.log(updatedResource.msg);
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        console.log(errorMessage);
        OnlyMessage.error(errorMessage);
      }
    };
    watch(
      () => store.state.customerInfo,
      (val) => {
        if (val) {
          if (store.state.customerInfo.headImg !== null) {
            isDefalutAvatar.value = false;
            headerImg.value = baseURL + val.headImg;
          }
        }
      }
    );

    const state = reactive({
      dialogFormVisible: false,
      fileType: null,
    });
    const command = (command) => {
      let wallerAddr = store.state.walletAddr;
      let definedHost = store.state.customerInfo.definedHost;
      let nameservice = store.state.customerInfo.nameservice;
      if (command == "logout") {
        store.dispatch("set_userInfo", null);
        store.dispatch("set_customerInfo", null);
        store.dispatch("set_email", false);
        store.dispatch("set_blockList", []);
        store.dispatch("set_userSetingDialog", false);
        store.dispatch("set_wallet", null);
        store.dispatch("set_walletAddr", null);
        setCookie("apptoken", "", -1);
        routers.replace({ name: "Lign" });
      } else {
        let V_O_P = VerifyOperationPermissions(address, wallerAddr);
        if (V_O_P) {
          switch (command) {
            case "settings":
              routers.replace({ path: "/setingUserInfo/myprofile" });
              break;
            case "homepage":
              let url = getUserUrl("", {
                definedHost,
                nameservice,
                walletAddress: wallerAddr,
              });
              window.open(url, "_blank");
              break;
          }
        }
      }
    };
    const value = ref("");
    const citiesList = reactive([
      {
        type: 0,
        value: "BeijingEveryone can see it",
        value1: "Visible to all",
      },
      {
        type: 1,
        value: "Only me can see it",
        value2: "Visible to me and block members",
      },
    ]);

    let walletImg_def = ref(defwallet);
    let walletImg_MM = ref(MMwallet);
    let wallet = reactive({
      walletConnected: store.state.wallet ? true : false,
      walletAddr: store.state.wallet
        ? store.state.wallet
        : "Link MetaMask wallet",
    });
    const Hover = (type, v) => {
      if (type == "w_c" && v == 1) {
        walletImg_MM.value = HoverMMwallet;
      } else if (type == "w_c" && v == 2) {
        walletImg_MM.value = MMwallet;
      } else if (type == "w_d" && v == 1) {
        walletImg_def.value = Hoverdefwallet;
      } else if (type == "w_d" && v == 2) {
        walletImg_def.value = defwallet;
      }
    };
    wallet.walletAddr = computed(() => {
      return store.state.wallet;
    });
    watch(
      () => store.state.walletAddr,
      (val) => {
        if (val) {
          wallet.walletConnected = true;
          wallet.walletAddr = val;
        } else {
          wallet.walletConnected = false;
        }
      }
    );
    const createFile = (fileType) => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (V_O_P) {
        state.dialogFormVisible = true;
        state.fileType = fileType;
      }
    };
    const closeDialog = () => {
      state.dialogFormVisible = false;
      state.fileType = null;
    };

    return {
      command,
      walletImg_def,
      walletImg_MM,
      ...toRefs(wallet),
      ...toRefs(citiesList),
      value,
      ...toRefs(state),
      connectWallet,
      createFile,
      closeDialog,
      headImg,
      headerImg,
      custInfo,
      isDefalutAvatar,
      Hover,
      isLogin,
      isDashboard,
      publishArticle,
    };
  },
});
</script>

<style lang="scss">
@import "../../assets/style/Nav/Nav.scss";
</style>