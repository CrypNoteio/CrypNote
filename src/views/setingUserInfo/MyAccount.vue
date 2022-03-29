<!-- author: nico -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: seting -->
<template>
  <div class="MyAccount">
    <div class="title">
      <span>⚠️</span>
      <span
        >The security factor of your current account is low, Please improve the
        information</span
      >
    </div>
    <div class="box">
      <span class="user-name">
        <img src="../../assets/img/yes-icon.png" class="emoji" />
        E-mail</span
      >
      <div class="information">
        <p>{{ Email }}</p>
        <span class="change mouseHan" @click="changeEmail()">Update</span>
      </div>
    </div>
    <div class="box">
      <span class="user-name">
        <img src="../../assets/img/yes-icon.png" class="emoji" />
        Password</span
      >
      <div class="information">
        Already set, can login with account password
        <span class="change" @click="updaetPwd">Update</span>
      </div>
    </div>
    <div class="box">
      <span class="user-name">
        <img src="../../assets/img/yes-icon.png" class="emoji" />
        Personal domain name</span
      >
      <div class="information">
        {{ getURL() }}

        <span class="change" @click="updaetDomain" v-if="!definedURL"
          >Reset</span
        >
      </div>
    </div>
    <el-dialog
      v-model="dialogFormVisible"
      center
      width="36%"
      :before-close="closeChangeEmailDialog"
      title="Verify your identity"
      custom-class="Domain_dialog"
    >
      <div>
        <input
          placeholder="New  E-mail address"
          class="einput"
          style="width: 92%"
          :disabled="emailDisabled"
          v-model="Email"
        />
        <input
          placeholder="6 digit sms code"
          class="einput"
          style="width: 30%"
          v-model="EmailVcode"
        />
        <el-button
          style="margin-left: 14px"
          :disabled="isGetVcode"
          @click="getVcode()"
          >{{ vcodeText }}</el-button
        >
        <div class="ChanageDomainConfirm" @click="Verification()">Verify</div>
      </div>
    </el-dialog>
    <el-dialog
      v-model="changePwdVisible"
      center
      width="36%"
      :before-close="closeChangePwdDialog"
      custom-class="Domain_dialog"
      title="Verify your identity"
    >
      <div>
        <div class="chage_box">
          <input
            placeholder="Old Password"
            class="einput"
            style="width: 82%"
            maxlength="16"
            minlength="6"
            v-model="oldPwd"
            :type="isOpenEye1 ? 'text' : 'password'"
          />
          <img
            :src="isOpenEye1 ? open_eye : close_eye"
            @click="isOpenEye1 = !isOpenEye1"
          />
        </div>
        <div class="chage_box">
          <input
            placeholder="New Password"
            class="einput"
            style="width: 82%"
            maxlength="16"
            minlength="6"
            v-model="newPwd"
            :type="isOpenEye2 ? 'text' : 'password'"
          />
          <img
            :src="isOpenEye2 ? open_eye : close_eye"
            @click="isOpenEye2 = !isOpenEye2"
          />
        </div>
        <div class="chage_box">
          <input
            placeholder="New Confirm Password"
            class="einput"
            style="width: 82%"
            maxlength="16"
            minlength="6"
            v-model="newConfirmPwd"
            :type="isOpenEye3 ? 'text' : 'password'"
          />
          <img
            :src="isOpenEye3 ? open_eye : close_eye"
            @click="isOpenEye3 = !isOpenEye3"
          />
        </div>

        <div class="ChanageDomainConfirm" @click="chagePwd()">Verify</div>
      </div>
    </el-dialog>
    <el-dialog
      v-model="dialogDomainVisible"
      center
      width="40%"
      :before-close="closeChangeDomainDialog"
      destroy-on-close
      title="Change personal domain name"
      custom-class="Domain_dialog"
    >
      <div>
        <div class="domain_url">
          <span>https://</span>
          <input v-model="definedURL" maxlength="16" minlength="6" />
          <span>.crypnote.io/</span>
        </div>
        <div class="ChanageDomainConfirm" @click="VerifyReg">Confirm</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, toRefs } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElLoading } from "element-plus";
import { postData } from "@/actions";
import { VerifyOperationPermissions } from "@/assets/js/Common";
import {
  getemialvcode,
  checkemialvcode,
  customerEmail,
  customerPwd,
  savedefinedurl,
} from "@/actions/api";
import { useRouter } from "vue-router";
import { getCookie } from "@/assets/js/Common";
import OnlyMessage from "@/assets/js/onlyMsgbox";
export default defineComponent({
  name: "MyAccount",
  setup() {
    let store = useStore();
    const routers = useRouter();
    const apptoken = getCookie("apptoken");
    const address = store.state.userInfo?.walletAddress;
    let wallerAddr = store.state.walletAddr;
    let Email = ref(store.state.userInfo.Email);
    let EmailVcode = ref("");
    let isGetVcode = ref(false);
    let vcodeText = ref("Access authentication code");
    let dialogFormVisible = ref(false);
    let changePwdVisible = ref(false);
    let emailDisabled = ref(true);
    let close_eye = ref(require("../../assets/img/Close_eyes.png"));
    let open_eye = ref(require("../../assets/img/Open_eyes.png"));
    let isOpenEye1 = ref(false);
    let isOpenEye2 = ref(false);
    let isOpenEye3 = ref(false);
    let dialogDomainVisible = ref(false);
    let definedURL = ref(store.state.customerInfo.definedHost);
    let chagePwdForm = reactive({
      oldPwd: "",
      newPwd: "",
      newConfirmPwd: "",
    });
    /**Update email */
    const changeEmail = () => {
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) return;
      dialogFormVisible.value = true;
    };
    /**getVcode */
    const getVcode = () => {
      if (!EmailVcode) {
        OnlyMessage.error("The verification code cannot be empty");
        return;
      }
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      postData(getemialvcode, {
        Email: Email.value,
        type: 2,
      })
        .then((res) => {
          loading.close();
          OnlyMessage.success(
            "The verification code has been sent successfully"
          );
          Countdown();
        })
        .catch((error) => {
          loading.close();
          OnlyMessage.error(error);
        });
    };

    let Seconds = 60;
    let timer = null;
    const Countdown = () => {
      timer = setInterval(() => {
        Seconds--;
        if (Seconds <= 0) {
          clearInterval(timer);
          isGetVcode.value = false;
          vcodeText.value = "Access authentication code";
        } else {
          isGetVcode.value = true;
          vcodeText.value = `Get it again after ${Seconds}s`;
        }
      }, 1000);
    };
    /**Verification code */
    const Verification = () => {
      if (!Email.value) {
        OnlyMessage.error("The new E-mail address cannot be empty");
        return;
      }
      if (!EmailVcode.value) {
        OnlyMessage.error("The verification code cannot be empty");
        return;
      }
      if (!emailDisabled.value) {
        postData(customerEmail, {
          apptoken,
          Email: Email.value,
          vcode: EmailVcode.value,
        })
          .then((editEmailRes) => {
            if (editEmailRes.success) {
              OnlyMessage.success(
                "Mailbox modified successfully, please log in again"
              );
              setTimeout(() => {
                store.dispatch("set_userInfo", null);
                store.dispatch("set_customerInfo", null);
                store.dispatch("set_email", false);
                store.dispatch("set_blockList", []);
                store.dispatch("set_userSetingDialog", false);
                store.dispatch("set_wallet", null);
                store.dispatch("set_walletAddr", null);
                routers.replace("/login");
              }, 1500);
            } else {
              OnlyMessage.error(editEmailRes.msg);
            }
          })
          .catch((eror) => {
            OnlyMessage.error(eror);
          });
      } else {
        postData(checkemialvcode, {
          Email: Email.value,
          vcode: EmailVcode.value,
        })
          .then((verificationRes) => {
            if (verificationRes.success) {
              Email.value = "";
              EmailVcode.value = "";
              emailDisabled.value = false;
              clearInterval(timer);
              vcodeText.value = "Access authentication code";
              isGetVcode.value = false;
              Seconds = 60;
            } else {
              OnlyMessage.error(verificationRes.msg);
            }
          })
          .catch((eror) => {
            OnlyMessage.error(eror);
          });
      }
    };
    const closeChangeEmailDialog = () => {
      clearInterval(timer);
      Seconds = 60;
      EmailVcode.value = "";
      isGetVcode.value = false;
      vcodeText.value = "Access authentication code";
      dialogFormVisible.value = false;
      emailDisabled.value = true;
    };
    /** change pwd */
    const updaetPwd = () => {
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) return;
      changePwdVisible.value = true;
    };
    /**Update password */
    const chagePwd = () => {
      if (!chagePwdForm.oldPwd) {
        OnlyMessage.error("Old password cannot be empty");
        return;
      }
      if (!chagePwdForm.newPwd) {
        OnlyMessage.error("New password cannot be empty");
        return;
      }
      if (
        /[\u4E00-\u9FA5]/g.test(chagePwdForm.newPwd) ||
        chagePwdForm.newPwd.length < 6
      ) {
        OnlyMessage.error("Minimum password length 6");
        return;
      }
      if (!chagePwdForm.newConfirmPwd) {
        OnlyMessage.error("New confirm password cannot be empty");
        return;
      }
      if (chagePwdForm.newConfirmPwd !== chagePwdForm.newPwd) {
        OnlyMessage.error("The two passwords entered are not the same.");
        return;
      }
      postData(customerPwd, {
        apptoken,
        oldPwd: chagePwdForm.oldPwd,
        newPwd: chagePwdForm.newPwd,
        newConfirmPwd: chagePwdForm.newConfirmPwd,
      })
        .then((chagePwdRes) => {
          if (chagePwdRes.success) {
            OnlyMessage.success("Password modified successfully");
            setTimeout(() => {
              store.dispatch("set_userInfo", null);
              store.dispatch("set_customerInfo", null);
              store.dispatch("set_email", false);
              store.dispatch("set_blockList", []);
              store.dispatch("set_userSetingDialog", false);
              store.dispatch("set_wallet", null);
              store.dispatch("set_walletAddr", null);
              routers.replace("/login");
            }, 1500);
          } else {
            OnlyMessage.error(chagePwdRes.msg);
          }
        })
        .catch((error) => {
          OnlyMessage.error(error);
        });
    };
    const closeChangePwdDialog = () => {
      chagePwdForm.oldPwd = "";
      chagePwdForm.newPwd = "";
      chagePwdForm.newConfirmPwd = "";
      changePwdVisible.value = false;
    };
    /** Update domain */
    const updaetDomain = () => {
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) return;
      dialogDomainVisible.value = true;
    };
    const closeChangeDomainDialog = () => {
      dialogDomainVisible.value = false;
    };
    const VerifyReg = () => {
      if (definedURL.value == "") {
        OnlyMessage.error("Domain name cannot be empty");
        return;
      }
      var reg = /^(?!^\d+$)[0-9a-zA-Z]{6,16}$/;
      if (!reg.test(definedURL.value)) {
        OnlyMessage.error("6-16 digits of English letters and numbers");
        return;
      }
      postData(savedefinedurl, {
        apptoken,
        definedurl: definedURL.value,
      })
        .then((savedeRes) => {
          console.log("savedeRes", savedeRes);
          if (savedeRes.success) {
            OnlyMessage.success("Domain name set successfully");
            dialogDomainVisible.value = false;
          } else {
            OnlyMessage.error(savedeRes.msg);
          }
        })
        .catch((errorMessage) => {
          console.log(errorMessage);
        });
    };
    const getURL = () => {
      if (definedURL.value == null || definedURL.value == "") {
        return `https://crypnote.io/${address}`;
      } else {
        return "https://" + definedURL.value + ".crypnote.io/";
      }
    };
    return {
      Email,
      EmailVcode,
      vcodeText,
      dialogFormVisible,
      changePwdVisible,
      changeEmail,
      updaetPwd,
      Verification,
      getVcode,
      emailDisabled,
      isGetVcode,
      closeChangeEmailDialog,
      chagePwd,
      closeChangePwdDialog,
      ...toRefs(chagePwdForm),
      isOpenEye1,
      isOpenEye2,
      isOpenEye3,
      close_eye,
      open_eye,
      closeChangeDomainDialog,
      dialogDomainVisible,
      updaetDomain,
      definedURL,
      VerifyReg,
      getURL,
    };
  },
});
</script>

<style scoped lang='scss'>
input::-webkit-input-placeholder {
  color: #bbbbbb;
}
.el-dialog--center .el-dialog__body {
  padding: 0px !important;
}
@import "../../assets/style/SetingUserInfo/MyAccount.scss";
</style>