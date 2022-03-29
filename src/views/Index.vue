<template>
  <div
    id="router-view"
    style="height: 100%; width: 100%; min-width: 864px; z-index: 999"
  >
    <Nav />
    <router-view></router-view>
  </div>
</template>
<script>
import Nav from "@/components/Nav/Nav.vue";
import { defineComponent, onBeforeMount } from "vue";
import { getlibList } from "@/actions/api";
import { postData } from "@/actions";
import { useStore } from "vuex";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import { getCookie } from "@/assets/js/Common";

export default defineComponent({
  name: "index",
  components: { Nav },
  setup() {
    let store = useStore();
    const apptoken = getCookie("apptoken");
    onBeforeMount(async () => {
      if (apptoken) {
        blockList();
      }
    });
    const blockList = async () => {
      try {
        const blockResource = await postData(getlibList, {
          apptoken: apptoken,
          type: 0,
        });
        if (blockResource.success) {
          store.dispatch("set_blockList", blockResource.data);
        } else {
          OnlyMessage.success(blockResource.msg);
        }
      } catch (errorMessage) {
        OnlyMessage.error(errorMessage);
      }
    };

    return {};
  },
});
</script>

<style>
</style>