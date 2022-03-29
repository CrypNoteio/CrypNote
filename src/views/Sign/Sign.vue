<!-- author: nico -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: sign -->
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
          <div class="rightTitle textNoclick">Create a New Account</div>
          <form action="">
            <div style="margin-top: 20px">
              <el-input
                type="text"
                v-model="username"
                placeholder="Username"
                class="inputNoB rightInput"
              />
            </div>
            <div>
              <el-input
                type="text"
                v-model="address"
                placeholder="E-mail address"
                class="inputNoB rightInput"
                style="margin-top: 10px"
              />
            </div>
            <div>
              <el-input
                show-password
                type="password"
                v-model="password"
                placeholder="Passwords"
                class="inputNoB rightInput"
                style="margin-top: 10px"
                maxlength="16"
                minlength="6"
                @input="regPwd()"
              />
            </div>
            <div class="passQ">
              Safety:
              <div class="inline-block" v-if="Intensity"></div>
              <div class="inline-block" v-if="Medium"></div>
              <div class="inline-block" v-if="Strong"></div>
            </div>
            <div>
              <el-input
                show-password
                v-model="rpassword"
                type="password"
                placeholder="Confirm password"
                class="inputNoB rightInput"
                style="margin-top: 10px"
              />
            </div>
            <div>
              <el-input
                v-model="vcode"
                type="text"
                placeholder="Mailbox verification code"
                class="inputNoB rightInput"
                style="margin-top: 10px"
              />
              <el-button
                style="margin-top: 5px"
                :disabled="isGetVcode"
                @click="getVcode"
                >{{ vcodeText }}</el-button
              >
            </div>
            <div>
              <el-input
                show-inviteCode
                v-model="inviteCode"
                type="text"
                placeholder="Invitation code"
                class="inputNoB rightInput"
                style="margin-top: 10px"
              />
            </div>
            <div class="rightCheckbox mouseHand">
              <el-checkbox class="Service" v-model="checked"
                >I agree to
                <a href="#" class="CrypNote">CrypNote’Terms of Service</a>
              </el-checkbox>
            </div>
            <div class="login mouseHand textNoclick" @click="onSubmit()">
              Sign Up >>
            </div>
          </form>
          <div style="width: 300px" class="rightLeftBottom">
            <div
              class="inline-block mouseHand textNoclick"
              style="width: 200px"
              @click="goLogin()"
            >
              Have an account? Log in >>
            </div>
          </div>
        </div>
        <div class="rightRight inline-block"></div>
      </div>
    </div>
  </div>
  <div class="domebg" style="display: none">
    <div class="domeright">
      <div class="rightLeft inline-block">
        <div class="rightT inline-block">
          <div class="rightTitle textNoclick">Create a New Account</div>
          <form action="">
            <div style="margin-top: 20px">
              <el-input
                type="text"
                v-model="username"
                placeholder="Username"
                class="inputNoB rightInput"
              />
            </div>
            <div>
              <el-input
                type="text"
                v-model="address"
                placeholder="E-mail address"
                class="inputNoB rightInput"
                style="margin-top: 10px"
              />
            </div>
            <div>
              <el-input
                show-password
                type="password"
                v-model="password"
                placeholder="Passwords"
                class="inputNoB rightInput"
                style="margin-top: 10px"
                maxlength="16"
                minlength="6"
                @input="regPwd()"
              />
            </div>
            <div class="passQ">
              Safety:
              <div class="inline-block" v-if="Intensity"></div>
              <div class="inline-block" v-if="Medium"></div>
              <div class="inline-block" v-if="Strong"></div>
            </div>
            <div>
              <el-input
                show-password
                v-model="rpassword"
                type="password"
                placeholder="Confirm password"
                class="inputNoB rightInput"
                style="margin-top: 10px"
              />
            </div>
            <div>
              <el-input
                v-model="vcode"
                type="text"
                placeholder="Mailbox verification code"
                class="inputNoB rightInput"
                style="margin-top: 10px"
              />
              <el-button
                style="margin-top: 5px"
                :disabled="isGetVcode"
                @click="getVcode"
                >{{ vcodeText }}</el-button
              >
            </div>
            <div>
              <el-input
                show-inviteCode
                v-model="inviteCode"
                type="text"
                placeholder="Invitation code"
                class="inputNoB rightInput"
                style="margin-top: 10px"
              />
            </div>
            <div class="rightCheckbox mouseHand">
              <el-checkbox class="Service" v-model="checked"
                >I agree to
                <a href="#" class="CrypNote">CrypNote’Terms of Service</a>
              </el-checkbox>
            </div>
            <div class="login mouseHand textNoclick" @click="onSubmit()">
              Sign Up >>
            </div>
          </form>
          <div style="width: 300px" class="rightLeftBottom">
            <div
              class="inline-block mouseHand textNoclick"
              style="width: 200px"
              @click="goLogin()"
            >
              Have an account? Log in >>
            </div>
          </div>
        </div>
        <div class="rightRight inline-block"></div>
      </div>
    </div>
    <div class="domeleft">
      <div style="width: 300px; height: 600px; margin-top: 40px">
        <div class="box1 textNoclick"></div>
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
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { postData } from "@/actions";
import { sign, getemialvcode } from "@/actions/api";
import { ElMessage, ElLoading } from "element-plus";
import OnlyMessage from "@/assets/js/onlyMsgbox";

export default defineComponent({
  name: "Home",
  setup() {
    const routers = useRouter();

    const checked = ref(false);
    let isGetVcode = ref(false);
    let vcodeText = ref("Access authentication code");

    let pwdIntensity = reactive({
      Intensity: false,
      Medium: false,
      Strong: false,
    });

    let registerForm = reactive({
      username: "",
      address: "",
      password: "",
      rpassword: "",
      vcode: "",
      inviteCode: "",
    });

    const regPwd = () => {
      pwdIntensity.Intensity = false;
      pwdIntensity.Medium = false;
      pwdIntensity.Strong = false;
      const password = registerForm.password;
      const pawdReg1 = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/;
      const pawdReg2 =
        /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
      const pawdReg3 =
        /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
      if (!registerForm.password) {
        OnlyMessage.error("Password cannot be empty.");
        return;
      }

      if (!pawdReg1.test(password)) {
        if (!pawdReg3.test(password)) {
          if (!pawdReg2.test(password)) {
            OnlyMessage.error(
              "Password 6-16-digit, case-sensitive, letters, numbers and special character combinations."
            );
            return;
          } else {
            pwdIntensity.Medium = true;
            pwdIntensity.Intensity = true;
          }
        } else {
          pwdIntensity.Intensity = true;
          pwdIntensity.Strong = true;
          pwdIntensity.Medium = true;
        }
      } else {
        pwdIntensity.Intensity = true;
      }
    };
    const checkPwd = () => {
      if (registerForm.password !== registerForm.rpassword) {
        OnlyMessage.error("The passwords are not the same twice.");
      }
    };

    const getVcode = () => {
      if (!registerForm.address) {
        OnlyMessage.error("Email address cannot be empty.");
        return;
      }
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting....",
        background: "rgba(0, 0, 0, 0.5)",
      });
      try {
        postData(getemialvcode, { Email: registerForm.address, type: 0 }).then(
          (emailRes) => {
            loading.close();
            if (emailRes.success) {
              OnlyMessage.success("CAPTCHA sent successfully, valid in 30min.");
              Countdown();
            } else {
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

    const goLogin = () => {
      routers.replace("/login");
    };
    let sendSign = true;
    const onSubmit = async () => {
      if (!sendSign) {
        return;
      }
      const userNameReg = /^([a-zA-Z])|([a-zA-Z]\d+){4,16}$/;

      if (!registerForm.username) {
        OnlyMessage.error("Username cannot be empty.");
        return;
      }
      if (!userNameReg.test(registerForm.username)) {
        OnlyMessage.error(
          "Username 6-18-digit, letters, or numbers and letters, case-insensitive"
        );
        return;
      }
      const emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      if (!registerForm.address) {
        OnlyMessage.error("Email cannot be empty.");
        return;
      }
      if (!emailReg.test(registerForm.address)) {
        OnlyMessage.error("Please fill in the valid E-mail address.");
        return;
      }
      if (!registerForm.password) {
        OnlyMessage.error("Password cannot be empty.");
        return;
      }
      const password = registerForm.password;
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
      if (password.length < 6 || password.length > 16) {
        OnlyMessage.error(
          "Password 6-16-digit, case-sensitive, letters, numbers and special character combinations."
        );
        return;
      }

      if (!registerForm.rpassword) {
        OnlyMessage.error("Confirming password cannot be empty.");
        return;
      }
      if (registerForm.password !== registerForm.rpassword) {
        OnlyMessage.error("Password is not the same as above.");
        return;
      }
      if (!registerForm.vcode) {
        OnlyMessage.error("Verification code cannot be empty.");
        return;
      }
      if (!registerForm.inviteCode) {
        OnlyMessage.error("Invitation code cannot be empty.");
        return;
      }
      if (!checked.value) {
        OnlyMessage.error("Please check the user agreement first.");
        return;
      }
      const loading = ElLoading.service({
        lock: true,
        text: "Registering, please wait",
        background: "rgba(0, 0, 0, 0.5)",
      });
      sendSign = false;
      try {
        const updatedResource = await postData(sign, {
          userName: registerForm.username,
          Email: registerForm.address,
          pwd: registerForm.password,
          confirmPwd: registerForm.rpassword,
          vcode: registerForm.vcode,
          inviteCode: registerForm.inviteCode,
        });
        loading.close();
        if (updatedResource.success) {
          OnlyMessage.success("Sign up successfully");
          setTimeout(() => {
            routers.replace("/login");
          }, 2000);
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
        sendSign = true;
      } catch (errorMessage) {
        loading.close();
        OnlyMessage.error(errorMessage);
        sendSign = true;
      }
    };
    onUnmounted(() => {
      ElMessage.closeAll();
    });
    return {
      ...toRefs(registerForm),
      onSubmit,
      regPwd,
      goLogin,
      checked,
      vcodeText,
      getVcode,
      isGetVcode,
      checkPwd,
      ...toRefs(pwdIntensity),
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
@import "../../assets/style/Register/Register.scss";
</style>