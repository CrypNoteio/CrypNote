<!-- author: nico -->
<!-- date: 2021-12-24 12:08:03 -->
<!-- description: seting -->
<template>
  <div class="SetingUserInfo" style="width: 100%; padding-top: 100px">
    <Nav />
    <div class="dialog-center">
      <div class="setting-item">
        <span class="user-name">{{ Email }}</span>
        <div class="item">
          <router-link :to="{ path: '/setingUserInfo/myprofile' }">
            <span
              @click="currentIndex = 1"
              :class="{ 'active-item': currentIndex == 1 }"
            >
              My profile
            </span>
          </router-link>

          <router-link :to="{ path: '/setingUserInfo/myaccount' }"
            ><span
              @click="currentIndex = 2"
              :class="{ 'active-item': currentIndex == 2 }"
            >
              My account
            </span></router-link
          >
          <router-link :to="{ path: '/setingUserInfo/myweb3' }">
            <span
              @click="currentIndex = 3"
              :class="{ 'active-item': currentIndex == 3 }"
            >
              My Web3
            </span></router-link
          >
          <router-link :to="{ path: '/setingUserInfo/language' }"
            ><span
              @click="currentIndex = 4"
              :class="{ 'active-item': currentIndex == 4 }"
            >
              Language
            </span></router-link
          >
        </div>
      </div>
      <div class="item-view">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "vuex";
import Nav from "@/components/Nav/Nav.vue";
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
  name: "SetingUserInfo",
  components: {
    Nav,
  },
  setup() {
    let store = useStore();
    const Email = ref(store.state.userInfo?.Email);
    const currentIndex = ref(1);
    const route = useRoute();

    const closeSetingUserInfo = () => {
      store.dispatch("set_userSetingDialog", false);
    };
    onMounted(() => {
      switch (route.path) {
        case "/setingUserInfo/myprofile":
          currentIndex.value = 1;
          break;
        case "/setingUserInfo/myaccount":
          currentIndex.value = 2;
          break;
        case "/setingUserInfo/myweb3":
          currentIndex.value = 3;
          break;
        case "/setingUserInfo/language":
          currentIndex.value = 4;
          break;
      }
    });
    return {
      centerDialogVisible: ref(true),
      isAppendToBody: ref(true),
      Center: ref(true),
      currentIndex,
      closeSetingUserInfo,
      Email,
    };
  },
});
</script>

<style scoped lang='scss'>
@import "../../assets/style/SetingUserInfo/SetingUserInfo.scss";
</style>