<!-- author: nico -->
<!-- date: 2022-02-28 13:50:07 -->
<!-- description: Verifye -->
<template>
  <div id="verifye">
    <el-dialog v-model="dialogVisible" width="63%" :show-close="false">
      <div class="Verifye_cantainer">
        <div class="cantainer_left">
          <img src="../../assets/img/brightID@1x.png" />
          <span>Check Status</span>
        </div>
        <div class="cantainer_right">
          <img src="../../assets/img/close_btn.png" class="close_btn" />
          <div class="right_title">Verify with BrightID</div>
          <div class="des">
            <div class="des_one">
              BrightID is a digital identity solution that ensures accounts in
              any application are created by real humans; each user is unique
              and only has one account. <span>Learn More.</span>
            </div>
            <div class="des_two">
              Now that you've connected your BrightID, you need to get verified
              by connecting with other real humans.
            </div>
            <div class="des_three">
              Join a Gitcoin + BrightID Verification Party
            </div>
            <div class="des_two">
              You can learn more about how BrightID works and make connections
              that will help you get verified on the verifications parties.
              Register for one of the events.
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "Verifye",
  setup() {
    const dialogVisible = ref(false);
    return {
      dialogVisible,
    };
  },
});
</script>

<style scoped lang='scss'>
@import "../../assets/style/SetingUserInfo/BrightID.scss";
</style>