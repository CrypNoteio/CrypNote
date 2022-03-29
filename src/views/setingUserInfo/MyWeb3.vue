<!-- author: nico -->
<!-- date: 2021-12-24 12:08:03 -->
<!-- description: seting myweb3 -->
<template>
  <div class="web3_cantainer">
    <div class="title">My Web3</div>
    <div class="web3_list">
      <div class="list_row">
        <div class="web3_item">
          <div class="item_top">
            <div class="top_left">
              <span>Brightid.org</span>
              <span>0% match</span>
            </div>
            <img class="web3_logo" src="../../assets/img/Brighid.png" />
          </div>
          <div class="web3_des">
            BrightID is a social identity network. Get verified by joining a
            BrightID verification party.
          </div>
          <div class="Verify" @click="coding">
            <span>Verify</span>
          </div>
        </div>
        <div class="web3_item">
          <div class="item_top">
            <div class="top_left">
              <span>Twitter</span>
              <span>{{ isTwitterbind ? "10%" : "0%" }} match</span>
            </div>
            <img class="web3_logo" src="../../assets/img/Twitter@2x.png" />
          </div>
          <div class="web3_des">
            Get verified by connecting your Twitter account.
          </div>
          <div class="Verify" v-if="!isTwitterbind">
            <span @click="Verify('twitter')">Verify</span>
          </div>
          <div class="Verifyed" v-else>
            <div class="Verified_left" @click="viewDetail('twitter')">
              <img src="../../assets/img/Verified.png" />
              <div>Verified</div>
            </div>
            <span @click="viewDetail('twitter')">Disconnect</span>
          </div>
        </div>
        <div class="web3_item">
          <div class="item_top">
            <div class="top_left">
              <span>DID.ID</span>
              <span>{{ isDAbind ? "10%" : "0%" }} match</span>
            </div>
            <img class="web3_logo" src="../../assets/img/DA.png" />
          </div>
          <div class="web3_des">
            Get verified by joining a DID.ID verification party.
          </div>
          <div class="Verify" v-if="!isDAbind">
            <span @click="Verify('das')">Verify</span>
          </div>
          <div class="Verifyed" v-else>
            <div class="Verified_left" @click="viewDetail('das')">
              <img src="../../assets/img/Verified.png" />
              <div>Verified</div>
            </div>
            <span @click="viewDetail('das')">Update</span>
          </div>
        </div>
        <div class="web3_item">
          <div class="item_top">
            <div class="top_left">
              <span>ENS</span>
              <span>{{ isENSbind ? "10%" : "0%" }} match</span>
            </div>
            <img class="web3_logo" src="../../assets/img/ENS.png" />
          </div>
          <div class="web3_des">
            Get verified through the Ethereum Naming Service.
          </div>
          <div class="Verify" v-if="!isENSbind">
            <span @click="Verify('ens')">Verify</span>
          </div>
          <div class="Verifyed" v-else>
            <div class="Verified_left" @click="viewDetail('ens')">
              <img src="../../assets/img/Verified.png" />
              <div>Verified</div>
            </div>
            <span @click="viewDetail('ens')">Update</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <BrightID />
  <Twitter
    v-if="TwitterVisiable"
    @TwitterDialog="closeDialog('twitter')"
    :isTwitterbind="isTwitterbind"
    :TwitterAccount="TwitterAccount"
  />
  <AD
    v-if="DAVisiable"
    @DADialog="closeDialog('das')"
    :nameservice="nameservice"
  />
  <ENS
    v-if="ENSVisiable"
    @ENSDialog="closeDialog('ens')"
    :nameservice="nameservice"
  />
</template>

<script>
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import BrightID from "@/components/SetingUserInfo/BrightID.vue";
import Twitter from "@/components/SetingUserInfo/Twitter.vue";
import AD from "@/components/SetingUserInfo/DA.vue";
import ENS from "@/components/SetingUserInfo/ENS.vue";
import { postData } from "@/actions";
import { useStore } from "vuex";
import { nsinfos, twitterinfo, twitterrevokeauth } from "@/actions/api";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import {
  getQueryVariable,
  VerifyOperationPermissions,
  getCookie,
} from "@/assets/js/Common";
export default defineComponent({
  name: "Language",
  components: { BrightID, Twitter, AD, ENS },
  setup(props, ctx) {
    let oauth_token = getQueryVariable("oauth_token");
    let oauth_verifier = getQueryVariable("oauth_verifier");

    let store = useStore();
    const apptoken = getCookie("apptoken");
    const address = store.state.userInfo?.walletAddress;
    let wallerAddr = store.state.walletAddr;

    let DAVisiable = ref(false);
    let ENSVisiable = ref(false);
    let TwitterVisiable = ref(false);
    let web3 = reactive({
      isDAbind: false,
      isENSbind: false,
      isTwitterbind: false,
      TwitterAccount: "",
      DAService: "",
      ENSService: "",
      nsinfosList: [],
      nameservice: "",
    });
    if (oauth_token && oauth_verifier) {
      TwitterVisiable.value = true;
      web3.isTwitterbind = true;
    }
    const Verify = (type) => {
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) return;
      if (type == "twitter") {
        TwitterVisiable.value = true;
      } else if (type == "das") {
        DAVisiable.value = true;
      } else if (type == "ens") {
        ENSVisiable.value = true;
      }
    };
    const getNsinfos = () => {
      postData(nsinfos, { apptoken })
        .then((nsinfosResult) => {
          //console.log("nsinfosResult", nsinfosResult);
          if (nsinfosResult.success) {
            if (nsinfosResult.data.length > 0) {
              let d = nsinfosResult.data;
              d.forEach((item) => {
                if (item.servicetype && item.servicetype == "das") {
                  web3.isDAbind = true;
                  web3.DAService = item;
                } else if (item.servicetype && item.servicetype == "ens") {
                  web3.isENSbind = true;
                  web3.ENSService = item;
                }
              });
            }
          } else {
            ElMessage.err(nsinfosResult.msg);
          }
        })
        .catch((nsinfosErrorMessage) => {
          console.log(nsinfosErrorMessage);
        });
    };
    const getTwitterInfo = () => {
      postData(twitterinfo, { apptoken })
        .then((twitterInfo) => {
          //console.log("twitterInfo", twitterInfo);
          if (twitterInfo.success) {
            web3.isTwitterbind = true;
            web3.TwitterAccount = twitterInfo.data.twitteraccount;
          } else {
            web3.isTwitterbind = false;
            web3.TwitterAccount = "";
          }
        })
        .catch((errorEessage) => {
          console.log(errorEessage);
        });
    };
    const viewDetail = (type) => {
      console.log("type", type);
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) return;
      if (type == "das") {
        web3.nameservice = web3.DAService.nameservice;
        DAVisiable.value = true;
      } else if (type == "ens") {
        web3.nameservice = web3.ENSService.nameservice;
        ENSVisiable.value = true;
      } else if (type == "twitter") {
        TwitterVisiable.value = true;
      }
    };
    //Disconnect twitter
    const Disconnect = () => {
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) return;
      postData(twitterrevokeauth, { apptoken })
        .then((disconnectRes) => {
          if (disconnectRes.success) {
            OnlyMessage.success("Disconnect successful.");
            getTwitterInfo();
          } else {
            OnlyMessage.error(disconnectRes.msg);
          }
        })
        .catch((errorMessage) => {
          console.log(errorMessage);
        });
    };
    onMounted(() => {
      getNsinfos();
      getTwitterInfo();
    });
    const closeDialog = (type) => {
      if (type == "das") {
        DAVisiable.value = false;
        getNsinfos();
      } else if (type == "ens") {
        ENSVisiable.value = false;
        getNsinfos();
      } else if (type == "twitter") {
        TwitterVisiable.value = false;
        getTwitterInfo();
      }
    };
    const coding = () => {
      OnlyMessage.info("Coding....");
    };
    return {
      Verify,
      DAVisiable,
      ENSVisiable,
      TwitterVisiable,
      closeDialog,
      ...toRefs(web3),
      viewDetail,
      Disconnect,
      coding,
    };
  },
});
</script>

<style scoped lang='scss'>
@import "../../assets/style/SetingUserInfo/Myweb3.scss";
</style>