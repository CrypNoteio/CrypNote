<!-- author: nico -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: home -->
<template >
  <div class="home">
    <div>
      <Workbench></Workbench>
    </div>
    <div class="home_right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { defineComponent, watch, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Workbench from "@/components/Workbench/Workbench";
import { connectWallet } from "@/assets/js/ConnectWallet";
import { getCookie } from "@/assets/js/Common";
export default defineComponent({
  name: "Dashboard",
  components: {
    Workbench,
  },
  setup() {
    let store = useStore();
    let router = useRouter();
    store.dispatch("set_isDashboard", true);
    const apptoken = getCookie("apptoken");

    let isUserInfoDialog = computed(() => {
      return store.state.userSetingDialog;
    });
    watch(
      () => store.state.userSetingDialog,
      (val) => {
        isUserInfoDialog.value = val;
      }
    );
    onMounted(async () => {
      connectWallet();
    });
    return {
      isUserInfoDialog,
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




