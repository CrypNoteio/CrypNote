<!-- author: nico -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: WrokBench -->
<template >
  <router-view></router-view>
  <div class="domeright">
    <div class="rightLeft inline-block">
      <div class="rightText textNoclick">Document</div>
      <div
        class="allIcon"
        style="
          margin-top: 15px;
          margin-bottom: 60px;
          display: flex;
          flex-wrap: wrap;
        "
      >
        <div class="rightIcon inline-block" @click="createFile('Word')">
          <img src="../../assets/img/home/homeIcon1.png" alt="" />
          <p style="color: #666; font-family: AvenirNext-DemiBold">Word</p>
        </div>
        <div class="rightIcon inline-block" @click="createFile('Excel')">
          <img src="../../assets/img/home/homeIcon4.png" alt="" />
          <p style="color: #666; font-family: AvenirNext-DemiBold">Excel</p>
        </div>
      </div>
      <div>
        <Invite />
        <Situation class="situation" />
      </div>
    </div>
  </div>

  <selectBlock
    v-show="dialogFormVisible"
    :fileType="fileType"
    :dialogFormVisible="dialogFormVisible"
    @closeDialog="closeDialog"
  />
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import Situation from "@/components/situation/situation";
import Invite from "@/components/situation/Invite";
import { VerifyOperationPermissions } from "@/assets/js/Common";
import selectBlock from "@/components/addWord/SelectBlock.vue";
export default defineComponent({
  name: "Home",
  components: {
    Situation,
    Invite,
    selectBlock,
  },
  setup() {
    let store = useStore();
    const address = store.state.userInfo?.walletAddress;

    /**create new file */
    const newfile = reactive({
      dialogFormVisible: false,
      fileType: null,
    });
    const createFile = (fileType) => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) {
        return;
      }

      newfile.dialogFormVisible = true;
      newfile.fileType = fileType;
    };
    const closeDialog = () => {
      newfile.dialogFormVisible = false;
      newfile.fileType = null;
    };

    return {
      ...toRefs(newfile),
      closeDialog,
      createFile,
    };
  },
});
</script>
<style lang="scss" scoped>
body {
  background: #fafafa;
}
@import "../../assets/style/Home/Home.scss";
</style>




