<!-- author: gy -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: login -->
<template>
  <div style="width: 100%; display: flex; flex-direction: row; margin: auto">
    <div style="width: cacl(35% - 100px); margin: auto; padding: 0 50px">
      <div style="max-width: 500px; float: right">
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
          <div class="rightTitle textNoclick">Welcome to CrypNote</div>
          <div>
            <input
              type="text"
              v-model="Email"
              placeholder="E-mail address"
              class="inputNoB rightInput"
            />
          </div>
          <div>
            <el-input
              show-password
              type="password"
              v-model="pwd"
              placeholder="Passwords"
              class="inputNoB rightInput"
              style="margin-top: 10px"
            />
          </div>
          <div class="login mouseHand textNoclick" @click="onSubmit()">
            Log in >>
          </div>
          <div style="width: 300px" class="rightLeftBottom">
            <div
              class="inline-block mouseHand textNoclick"
              style="width: 200px"
            >
              <router-link
                :to="{ name: 'ForgetPasswordOne' }"
                class="router-link-active"
              >
                Forget the password?
              </router-link>
            </div>
            <div
              class="inline-block mouseHand textNoclick"
              style="width: 100px"
            >
              <router-link :to="{ name: 'Sign' }" class="router-link-active">
                Sign up>>
              </router-link>
            </div>
          </div>
        </div>
        <div class="rightRight inline-block"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, onUnmounted } from "vue";
import { postData } from "@/actions";
import { login } from "@/actions/api";
import { ElMessage, ElLoading } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { setCookie, getCookie } from "@/assets/js/Common";
import OnlyMessage from "@/assets/js/onlyMsgbox";
export default defineComponent({
  name: "Lign",
  setup() {
    const routers = useRouter();
    const route = useRoute();
    const store = useStore();
    const apptoken = getCookie("apptoken");
    if (apptoken) {
      routers.push("/dashboard/workbench");
    }
    let loginForm = reactive({
      Email: route.params.Email,
      pwd: "",
    });
    const onSubmit = async () => {
      if (!loginForm.Email) {
        OnlyMessage.error("Email address cannot be empty.");
        return;
      }
      if (!loginForm.pwd) {
        OnlyMessage.error("Password cannot be empty.");
        return;
      }
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      try {
        const updatedResource = await postData(login, {
          Email: loginForm.Email,
          pwd: loginForm.pwd,
        });
        if (updatedResource.success) {
          console.log(updatedResource);
          loading.close();
          OnlyMessage.success("Login successfully");
          const userInfo = {
            Email: updatedResource.data.Email,
            userName: updatedResource.data.userName,
            walletAddress: updatedResource.data.walletAddress,
          };

          store.dispatch("set_userInfo", userInfo);
          setCookie("apptoken", updatedResource.data.apptoken, 1);
          setTimeout(() => {
            if (route.query.redirectURL) {
              const redirectUrl = route.query.redirectURL;
              window.open(redirectUrl, "_self");
            } else {
              routers.replace("/dashboard");
            }
          }, 1000);
        } else {
          loading.close();
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        loading.close();
        OnlyMessage.error(errorMessage);
      }
    };
    onUnmounted(() => {
      ElMessage.closeAll();
    });
    document.onkeydown = function (ev) {
      if (route.path == "/login") {
        var event = ev || event;
        if (event.keyCode == 13) {
          onSubmit();
        }
      }
    };
    return {
      ...toRefs(loginForm),
      onSubmit,
    };
  },
});
</script>

<style scoped lang="scss">
/deep/.el-input__inner {
  padding: 0px !important;
  border: none;
  font-size: 14px;
  background-color: #ffffff !important;
}
@import "../../assets/style/Login/Login.scss";
</style>