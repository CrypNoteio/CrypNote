
<template>
  <div class="title">Inviting friends</div>
  <div class="Invite-block">
    <div class="Invite-top">
      <div class="My-codes">
        <div class="num">{{ hasInvited }}</div>
        <div class="My-code-text">Invited</div>
      </div>
      <div class="Invited">
        <div class="num">{{ inviteNum }}</div>
        <div class="My-code-text">My codes</div>
      </div>
    </div>
    <div class="Invite-bottom">
      <span>{{ inviteCode }}</span>
      <div @click="Generateinvitingcode">Generate inviting code</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import { postData } from "@/actions";
import { useStore } from "vuex";
import { createInvtieCode } from "@/actions/api";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import { VerifyOperationPermissions, getCookie } from "@/assets/js/Common";

export default defineComponent({
  name: "Invite",
  setup() {
    let store = useStore();
    const apptoken = getCookie("apptoken");
    let customerInfo = store.state.customerInfo;
    const address = store.state.userInfo?.walletAddress;
    const info = reactive({
      inviteNum: customerInfo?.inviteNum ? customerInfo?.inviteNum : 0,
      hasInvited: customerInfo?.hasInvited ? customerInfo?.hasInvited : 0,
      inviteCode: customerInfo?.inviteCode,
    });
    const Generateinvitingcode = () => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (V_O_P) {
        postData(createInvtieCode, { apptoken })
          .then((createRes) => {
            if (createRes.success) {
              OnlyMessage.success("Generate inviting code successfully.");
              info.inviteCode = createRes.msg;
              customerInfo.inviteCode = createRes.msg;
              store.dispatch("set_customerInfo", customerInfo);
            } else {
              OnlyMessage.error(createRes.msg);
            }
          })
          .catch((error) => {
            OnlyMessage.error(error);
          });
      }
    };
    return {
      ...toRefs(info),
      Generateinvitingcode,
    };
  },
});
</script>

<style scoped lang='scss'>
@import "../../assets/style/situation/Invite.scss";
</style>