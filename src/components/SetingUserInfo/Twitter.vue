<!-- author: nico -->
<!-- date: 2022-02-28 13:50:07 -->
<!-- description: Verifye -->
<template>
  <div id="verifye">
    <el-dialog
      v-model="dialogVisible"
      width="63%"
      :show-close="false"
      @close="closeDialog"
    >
      <div class="Verifye_cantainer">
        <div class="cantainer_left">
          <img src="../../assets/img/twitter.png" />
          <div v-if="!TwitterAccount">
            <span v-if="isTwitterbind" @click="sendTwitter"
              >Verify Twitter</span
            >
            <span v-else @click="Authorise">Authorise</span>
          </div>
          <span v-else @click="Disconnect">Disconnect</span>
        </div>
        <div class="cantainer_right" v-if="!isTwitterbind">
          <img
            src="../../assets/img/close_btn.png"
            class="close_btn"
            @click="closeDialog"
          />
          <div class="right_title">Verify with Twitter</div>
          <div class="des">
            <div class="des_one">
              We want to verify your Twitter account. To do so, you must
              authorise CrypNote to log in to your Twitter account, and we will
              automatically send an authentication tweet later, then we'll
              validate it's there. Please make sure that you have more than 100
              followers
            </div>
            <div class="des_two">The Tweet should say:</div>
            <div class="des_two">
              <i
                >I am verifying my identity as crypnote {{ userName }} on
                @crypnoteio https://crypnote.io</i
              >
            </div>
            <div class="des_three">I have already tweeted this</div>
          </div>
        </div>
        <div class="cantainer_right" v-else>
          <img
            src="../../assets/img/close_btn.png"
            class="close_btn"
            @click="closeDialog"
          />
          <div class="right_title">Verify with Twitter</div>
          <div class="des">
            <div class="des_one" v-if="!TwitterAccount">
              Now that you have completed the authorization, just click the
              verify button to bind the Twitter.
            </div>
            <div class="des_one" v-else>
              You have successfully verified your Twitter
            </div>
            <div class="des_input" v-if="TwitterAccount">
              <span>@</span>
              <input v-model="TwitterAccount" disabled />
            </div>
            <!-- <div class="des_three" v-if="!TwitterAccount">Go back</div> -->
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import { postData } from "@/actions";
import { useStore } from "vuex";
import {
  twitterauth,
  twitterauthcallback,
  twitterrevokeauth,
} from "@/actions/api";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import { getQueryVariable, getCookie } from "@/assets/js/Common";
export default defineComponent({
  name: "Twitter",
  emits: ["TwitterDialog"],
  props: {
    isTwitterbind: Boolean,
    TwitterAccount: String,
  },
  setup(props, ctx) {
    let oauth_token = getQueryVariable("oauth_token");
    let oauth_verifier = getQueryVariable("oauth_verifier");

    let store = useStore();
    const apptoken = getCookie("apptoken");
    let userName = ref(store.state.userInfo?.userName);
    const dialogVisible = ref(true);
    let twitterAccount = ref(props.TwitterAccount);
    console.log(twitterAccount.value);
    let twitterInfo = reactive({
      AuthorizationURL: "",
    });

    let isTwitterbind = props.isTwitterbind;
    const Authorise = () => {
      postData(twitterauth, { apptoken })
        .then((AuthorizationRes) => {
          console.log("AuthorizationRes", AuthorizationRes);
          if (AuthorizationRes.success) {
            twitterInfo.AuthorizationURL = AuthorizationRes.msg;
            window.open(AuthorizationRes.msg, "_blank");
          } else {
            OnlyMessage.error(AuthorizationRes.msg);
          }
        })
        .catch((errorMessage) => {
          console.log(errorMessage);
        });
    };
    const sendTwitter = () => {
      if (oauth_token && oauth_verifier) {
        postData(twitterauthcallback, {
          oauth_token,
          oauth_verifier,
          apptoken,
        })
          .then((sendTwitterRes) => {
            console.log("sendTwitterRes", sendTwitterRes);
            if (sendTwitterRes.success) {
              OnlyMessage.success("Verify successfully");
              ctx.emit("TwitterDialog");
            } else {
              OnlyMessage.error(sendTwitterRes.msg);
            }
          })
          .catch((errMessage) => {
            console.log(errMessage);
            OnlyMessage.error("Verification failed. Please try again later.");
          });
      } else {
        OnlyMessage.error("Please authorize Twitter first");
      }
    };
    const Disconnect = () => {
      postData(twitterrevokeauth, { apptoken })
        .then((disconnectRes) => {
          console.log("disconnectRes", disconnectRes);
          if (disconnectRes.success) {
            OnlyMessage.success("Disconnect successful.");
            setTimeout(() => {
              ctx.emit("TwitterDialog");
            }, 1000);
          } else {
            OnlyMessage.error(disconnectRes.msg);
          }
        })
        .catch((errorMessage) => {
          console.log(errorMessage);
        });
    };
    const closeDialog = () => {
      ctx.emit("TwitterDialog");
    };
    return {
      dialogVisible,
      userName,
      isTwitterbind,
      Authorise,
      sendTwitter,
      twitterAccount,
      Disconnect,
      closeDialog,
    };
  },
});
</script>

<style scoped lang='scss'>
@import "../../assets/style/SetingUserInfo/Twitter.scss";
</style>