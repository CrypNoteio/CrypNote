<!-- author: zhanggg -->
<!-- date: 2021-12-24 12:08:03 -->
<!-- description: seting -->
<template>
  <div class="MyProfile">
    <div class="title">Photo</div>
    <img :src="headImg ? headImg : require('../../assets/img/photo.png')" />
    <div class="upload-photo">
      <input
        type="file"
        name="file"
        id="file_headerpic"
        accept="image/jpeg, image/jpg, image/png"
        @change.stop="handleFile"
      />
      <label for="file_headerpic" @click="uploadHeadImg()">Upload photo</label>
    </div>
    <span class="user-name">Prefered name</span>
    <div class="input-box">
      <input type="text" v-model="userName" />
    </div>
    <span class="user-name">Brief intro</span>
    <div class="Brief-intro">
      <textarea v-model="intro"></textarea>
    </div>
    <span class="user-name">My website link</span>
    <div class="input-box">
      <input
        type="text"
        v-model="privateUrl"
        placeholder="Displayed as an external link in the profile of the personal homepage"
      />
    </div>
    <span class="update" @click="updateinfoClick()">Update</span>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { postData } from "@/actions";
import { updateinfo, fileImg, baseURL } from "@/actions/api";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import { useStore } from "vuex";
import headerImg from "../../assets/img/photo.png";
import { VerifyOperationPermissions } from "@/assets/js/Common";
import { getCookie } from "@/assets/js/Common";
export default defineComponent({
  name: "MyProfile",
  setup() {
    let store = useStore();
    const apptoken = getCookie("apptoken");
    const customerInfo = store.state.customerInfo;
    let userName = ref(customerInfo.userName);
    const address = store.state.userInfo?.walletAddress;
    let intro = ref(customerInfo.intro ? decodeURI(customerInfo.intro) : "");
    let privateUrl = ref(customerInfo.privateUrl);
    let headImg = ref("");
    let userInfo = customerInfo.headImg;
    if (userInfo) {
      let img = userInfo;
      img = baseURL + img;
      headImg.value = img;
    }

    const uploadHeadImg = () => {};
    const handleFile = (e) => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) return;
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = async function (e) {
        headImg.value = e.target.result;
        try {
          const updatedAvatar = await postData(fileImg, {
            apptoken: apptoken,
            fileImg: e.target.result,
          });
          if (updatedAvatar.success) {
            customerInfo.headImg = updatedAvatar.data.headimg;
            store.dispatch("set_customerInfo", customerInfo);
            OnlyMessage.success("Avatar saved successfully");
          } else {
            OnlyMessage.error(updatedAvatar.msg);
          }
        } catch (errorMessage) {
          OnlyMessage.error(errorMessage);
        }
      };
      reader.readAsDataURL(file);
    };
    const updateinfoClick = async () => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) return;
      var reg =
        /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
      if (privateUrl.value !== "" && !reg.test(privateUrl.value)) {
        OnlyMessage.error("website link incorrect format");
        return;
      }
      try {
        const updatedResource = await postData(updateinfo, {
          apptoken: apptoken,
          userName: encodeURI(userName.value),
          intro: encodeURI(intro.value),
          privateUrl: privateUrl.value,
        });
        if (updatedResource.success) {
          OnlyMessage.success("Modified successfully");
          customerInfo.userName = encodeURI(userName.value);
          customerInfo.intro = encodeURI(intro.value);
          customerInfo.privateUrl = privateUrl.value;
          store.dispatch("set_customerInfo", customerInfo);
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        console.log(errorMessage);
        OnlyMessage.error("request error");
      }
    };
    return {
      headerImg,
      headImg,
      userName,
      intro,
      privateUrl,
      handleFile,
      uploadHeadImg,
      updateinfoClick,
    };
  },
});
</script>

<style scoped lang='scss'>
@import "../../assets/style/SetingUserInfo/MyProfile.scss";
</style>