<template>
  <div>
    <div class="SITtitle">Auto Sync to Chain</div>
    <div style="width: 270px">
      <div class="SITbottom" style="padding: 10px">
        <div class="bsubtitle">
          <img
            src="../../assets/img/home/homeBottom1.png"
            alt=""
            class="arimg"
          />
          Latest
          <img
            src="../../assets/img/home/homeBottom2.png"
            alt=""
            class="fileimg"
          />
        </div>
        <div class="Bline">
          <p>Sync to Arweave</p>
          <div class="uptime">{{ uploadTime }}</div>
          <p>Sync to Filecoin（IPFS）</p>
          <div class="uptime">{{ uploadTime }}</div>
          <p>
            <el-button type="primary" round @click="winding"
              >Save on chain</el-button
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { postData } from "@/actions";
import { syncchain } from "@/actions/api";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import { useStore } from "vuex";
import {
  getCurrentTime,
  VerifyOperationPermissions,
  getCookie,
} from "@/assets/js/Common";
export default defineComponent({
  setup() {
    let store = useStore();
    let userInfo = store.state.userInfo;
    const apptoken = getCookie("apptoken");
    const address = store.state.userInfo?.walletAddress;
    const uploadTime = ref(
      store.state.userInfo?.uploadTime
        ? store.state.userInfo?.uploadTime
        : getCurrentTime()
    );
    const winding = () => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) {
        return;
      }
      try {
        postData(syncchain, { apptoken }).then((windingRes) => {
          if (windingRes.success) {
            OnlyMessage.success("Sync to chain successfully");
            uploadTime.value = getCurrentTime();
            userInfo.uploadTime = uploadTime.value;
            store.dispatch("set_userInfo", userInfo);
          } else {
            OnlyMessage.error(windingRes.msg);
          }
        });
      } catch (errorMessage) {
        OnlyMessage.error(errorMessage);
      }
    };
    return {
      winding,
      uploadTime,
    };
  },
});
</script>

<style scoped lang="scss">
/deep/.el-timeline-item__tail {
  height: auto !important;
}
/deep/.el-timeline-item {
  padding-bottom: 8px !important;
}

@import "../../assets/style/situation/situation.scss";
</style>