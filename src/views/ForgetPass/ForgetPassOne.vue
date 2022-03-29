<!-- author: gy -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: reset pwd -->
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
          <div class="back mouseHand" @click="back()">Back</div>
          <div class="rightTitle textNoclick">Forget the Password?</div>
          <div style="margin-top: 60px">
            <div style="margin-top: 10px; border-bottom: 1px solid #d1d1d6">
              <el-input
                type="text"
                v-model="Email"
                placeholder="E-mail address"
                class=""
                style="margin-top: 10px"
              />
            </div>
            <div style="margin-top: 10px">
              <el-input
                type="text"
                style="
                  width: 120px;
                  border-bottom: 1px solid #d1d1d6;
                  margin-bottom: 10px;
                  width: 100%;
                "
                class=""
                placeholder="Mailbox verification code"
                v-model="vcode"
                @input="changeInp()"
              />
              <el-button :disabled="isGetVcode" @click="getVcode">{{
                vcodeText
              }}</el-button>
            </div>

            <button
              class="login mouseHand textNoclick"
              style="background: transparent; border: none"
              @click="upForget()"
            >
              Next >>
            </button>
          </div>
        </div>
        <div class="rightRight inline-block"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, ref } from "vue";
import { postData } from "@/actions";
import { getemialvcode, checkemialvcode } from "@/actions/api";
import { ElMessage, ElLoading } from "element-plus";
import { useRouter } from "vue-router";
import OnlyMessage from "@/assets/js/onlyMsgbox";
export default defineComponent({
  name: "ForgetPasswordOne",
  setup() {
    const router = useRouter();
    // let vcodeT = ref("Send Code");
    let vcodeText = ref("Access authentication code");
    let countDownNum = ref(60);
    let isGetVcode = ref(false);
    let timer = ref(null);
    let showT = ref(true);
    let disabled = ref(false);
    let loginForm = reactive({
      Email: "",
      vcode: "",
    });
    const getVcode = () => {
      if (!loginForm.Email) {
        OnlyMessage.error("Email address cannot be empty.");
        return;
      }
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      try {
        postData(getemialvcode, { Email: loginForm.Email, type: 1 }).then(
          (emailRes) => {
            if (emailRes.success) {
              loading.close();
              OnlyMessage.success("CAPTCHA sent successfully, valid in 30min.");
              Countdown();
            } else {
              loading.close();
              OnlyMessage.error(emailRes.msg);
            }
          }
        );
      } catch (error) {
        loading.close();

        OnlyMessage.error(error);
      }
    };
    let time = 60;
    const Countdown = () => {
      const timer = setInterval(() => {
        time--;
        if (time <= 0) {
          clearInterval(timer);
          isGetVcode.value = false;
          vcodeText.value = "Access authentication code";
        } else {
          isGetVcode.value = true;
          vcodeText.value = `Get it again after ${time}s`;
        }
      }, 1000);
    };
    const changeInp = () => {
      if (!loginForm.Email) {
        return;
      }
      disabled.value = false;
    };

    const upForget = async () => {
      if (!loginForm.Email) {
        OnlyMessage.error("Email address cannot be empty!");
        return;
      }
      if (!loginForm.vcode) {
        OnlyMessage.error("CAPTCHA cannot be empty!");
        return;
      }
      try {
        disabled.value = false;
        router.push({
          name: "ForgetPasswordTwo",
          params: {
            Email: loginForm.Email,
            vcode: loginForm.vcode,
          },
        });
      } catch {
        OnlyMessage.error(errorMessage);
      }
    };
    const back = () => {
      router.go(-1);
    };
    return {
      ...toRefs(loginForm),
      vcodeText,
      countDownNum,
      showT,
      disabled,
      getVcode,
      upForget,
      changeInp,
      back,
      isGetVcode,
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