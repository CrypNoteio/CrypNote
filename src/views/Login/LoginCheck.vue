<!-- author: fo -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: logincheck -->
<template></template>

<script>
import { getCookie } from "@/assets/js/Common";
import { useStore } from "vuex";

export default {
  name: "LoginCheck",
  setup() {
    let store = useStore();
    if (
      window.document.referrer.indexOf("w2e.wiki") != -1 ||
      window.document.referrer.indexOf("8082") != -1
    ) {
      const crypapptoken = getCookie("apptoken")
        ? getCookie("apptoken")
        : "none";
      //console.log(store);
      window.parent.postMessage(
        {
          tk: crypapptoken,
          Email: store.state.userInfo ? store.state.userInfo.Email : "",
          userName: store.state.userInfo ? store.state.userInfo.userName : "",
          walletAddress: store.state.userInfo
            ? store.state.userInfo.walletAddress
            : "",
        },
        "*"
      );
    }
    return {};
  },
};
</script>
