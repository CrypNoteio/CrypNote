<!-- author: gy -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: reset pwd -->
<template>
  <div style="width: 100%; display: flex; flex-direction: row; margin: auto">
    <div style="width: cacl(35% - 100px); margin: auto; padding: 0 50px">
      <div style="width: 300px; height: 600px; margin-top: 80px">
        <div class="box1 textNoclick">
          <router-link :to="{ path: '/home' }"
            ><img src="../../assets/img/logos.png"
          /></router-link>
        </div>
        <div class="leftTitle">Welcome to CrypNote</div>
        <div class="leftContent">
          CrypNote is a decentralized encrypted permanent storage note and
          collaboration platform. In CrypNote, the block collects all your notes
          like a bookshelf and structures your notes to facilitate the creation
          and precipitation of knowledge.
        </div>

        <div class="leftBottomImg"></div>
      </div>
    </div>
    <div style="width: 65%">
      <div class="rightLeft inline-block">
        <div class="rightT inline-block">
          <div class="rightTitle textNoclick">Congratulations！</div>
          <div class="rightContent textNoclick">
            You have successfully reset your password.
          </div>
          <div
            class="mouseHand"
            style="font-weight: 600; margin-top: 62px"
            @click="onSubmit()"
          >
            Go back to log in >>
          </div>
        </div>
        <div class="rightRight inline-block"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
  name: "ForgetPasswordThree",
  setup() {
    const routers = useRouter();
    const route = useRoute();
    const onSubmit = () => {
      routers.push({
        name: "Lign",
        params: { Email: route.params.Email },
      });
    };
    return {
      onSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
/deep/.el-input__inner {
  padding: 0px !important;
  border: none;
  font-size: 14px;
  background-color: #ffffff !important;
}
@import "../../assets/style/forget/forget.scss";
</style>