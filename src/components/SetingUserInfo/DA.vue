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
          <img src="../../assets/img/DA@96.png" />
          <span @click="VerifyAccount">Verify account</span>
        </div>
        <div class="cantainer_right">
          <img
            src="../../assets/img/close_btn.png"
            class="close_btn"
            @click="closeDialog"
          />
          <div class="right_title">Verify with DID.ID</div>
          <div class="des">
            <div class="des_one">Use DID account to verify</div>
            <div class="des_two">
              TAfter binding the DID account, the second-level domain name on
              the first page will be changed to the third-level domain name (for
              example, xxx.crypnote.io will be changed to xxx.bit.crypnote.io)
            </div>
            <div class="des_two">
              <span>Step 1:</span>fill in the DID domain name of the wallet
              address device
            </div>
            <div class="des_three">
              <input placeholder="for example: xxx.bit" v-model="domainName" />
            </div>
            <div class="des_two">
              <span>Step 2:</span>click the verify button
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { postData } from "@/actions";
import { useStore } from "vuex";
import { boundnameservice } from "@/actions/api";
import { ElMessage, ElLoading } from "element-plus";
import { getCookie } from "@/assets/js/Common";
import OnlyMessage from "@/assets/js/onlyMsgbox";
export default defineComponent({
  name: "DA",
  emits: ["DADialog"],
  props: {
    nameservice: String,
  },
  setup(props, ctx) {
    let store = useStore();
    const dialogVisible = ref(true);
    const apptoken = getCookie("apptoken");

    let domainName = ref(props.nameservice);
    const VerifyAccount = () => {
      if (domainName.value == "") {
        OnlyMessage.error("domain name can not be enpty");
        return;
      }
      if (domainName.value.indexOf(".bit") == -1) {
        OnlyMessage.error("domain name Incorrect format");
        return;
      }
      if (domainName.value.split(".")[0].length < 4) {
        OnlyMessage.error("domain name Incorrect format");
        return;
      }
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      postData(boundnameservice, { apptoken, p1: domainName.value, p2: "das" })
        .then((serviceRes) => {
          loading.close();
          //console.log("serviceRes", serviceRes);
          if (serviceRes.success) {
            OnlyMessage.success("Bind successfully.");
            domainName.value = "";
            ctx.emit("DADialog");
          } else {
            OnlyMessage.error(serviceRes.msg);
          }
        })
        .catch((serviceErrorMessage) => {
          loading.close();
          console.log("serviceErrorMessage", serviceErrorMessage);
        });
    };
    const closeDialog = () => {
      domainName.value = "";
      ctx.emit("DADialog");
    };
    return {
      dialogVisible,
      domainName,
      VerifyAccount,
      closeDialog,
    };
  },
});
</script>

<style scoped lang='scss'>
@import "../../assets/style/SetingUserInfo/DA.scss";
</style>