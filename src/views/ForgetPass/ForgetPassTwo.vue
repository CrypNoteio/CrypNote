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
          <div class="back mouseHand" @click="back()">⋘Back</div>
          <div class="rightTitle textNoclick">Forget the Password?</div>
          <div style="margin-top: 60px">
            <div>
              <el-input
                type="text"
                v-model="Email"
                placeholder="E-mail address"
                style="
                  width: 120px;
                  border-bottom: 1px solid #d1d1d6;
                  margin-bottom: 10px;
                  width: 100%;
                "
              />
            </div>
            <div>
              <el-input
                show-password
                type="password"
                v-model="pwd"
                placeholder="New password"
                style="
                  width: 120px;
                  border-bottom: 1px solid #d1d1d6;
                  margin-bottom: 10px;
                  width: 100%;
                "
                maxlength="16"
                minlength="6"
              />
            </div>
            <div style="margin-top: 10px">
              <el-input
                show-password
                type="password"
                v-model="confirmpwd"
                placeholder="Confirm password"
                style="
                  width: 120px;
                  border-bottom: 1px solid #d1d1d6;
                  margin-bottom: 10px;
                  width: 100%;
                "
              />
            </div>

            <div class="login mouseHand textNoclick" @click="onSubmit()">
              Reset Password >>
            </div>
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
import { forget } from "@/actions/api";
import { ElMessage, ElLoading } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import OnlyMessage from "@/assets/js/onlyMsgbox";
export default defineComponent({
  name: "ForgetPasswordTwo",
  setup() {
    const routers = useRouter();
    const route = useRoute();
    let disabled = ref(true);
    let loginForm = reactive({
      Email: route.params.Email,
      pwd: "",
      confirmpwd: "",
      vcode: route.params.vcode,
    });

    const onSubmit = async () => {
      if (!loginForm.Email) {
        ElMessage("Email address cannot be empty!");
        return;
      }
      if (!loginForm.pwd) {
        OnlyMessage.error("Password cannot be empty！");
        return;
      }
      if (!loginForm.confirmpwd) {
        OnlyMessage.error("Confirming password cannot be empty！");
        return;
      }

      const password = loginForm.pwd;
      const passwordr = loginForm.confirmpwd;
      const pawdReg1 = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/;
      const pawdReg2 =
        /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
      const pawdReg3 =
        /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;

      if (!pawdReg1.test(password)) {
        if (!pawdReg3.test(password)) {
          if (!pawdReg2.test(password)) {
            OnlyMessage.error(
              "Password 6-16-digit, case-sensitive, letters, numbers and special character combinations."
            );
            return;
          }
        }
      }
      if (!pawdReg1.test(passwordr)) {
        if (!pawdReg3.test(passwordr)) {
          if (!pawdReg2.test(passwordr)) {
            OnlyMessage.error(
              "Password 6-16-digit, case-sensitive, letters, numbers and special character combinations."
            );
            return;
          }
        }
      }
      if (password.length < 6 || password.length > 16) {
        OnlyMessage.error(
          "Password 6-16-digit, case-sensitive, letters, numbers and special character combinations."
        );
        return;
      }
      if (passwordr.length < 6 || passwordr.length > 16) {
        OnlyMessage.error(
          "Password 6-16-digit, case-sensitive, letters, numbers and special character combinations."
        );
        return;
      }
      if (loginForm.pwd != loginForm.confirmpwd) {
        OnlyMessage.error("Password is not the same as above！");
        return;
      }
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      try {
        disabled.value = true;
        const updatedResource = await postData(forget, {
          Email: loginForm.Email,
          pwd: loginForm.pwd,
          confirmpwd: loginForm.confirmpwd,
          vcode: loginForm.vcode,
        });
        if (updatedResource.success) {
          loading.close();
          OnlyMessage.success("Password modified successfully");
          disabled.value = false;
          setTimeout(() => {
            routers.push({
              name: "ForgetPasswordThree",
              params: { Email: loginForm.Email },
            });
          }, 2000);
        } else {
          loading.close();
          OnlyMessage.error(updatedResource.msg);
          disabled.value = false;
        }
      } catch (errorMessage) {
        disabled.value = false;
        loading.close();
        OnlyMessage.error(errorMessage);
      }
    };
    const back = () => {
      routers.go(-1);
    };
    return {
      ...toRefs(loginForm),
      disabled,
      onSubmit,
      back,
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