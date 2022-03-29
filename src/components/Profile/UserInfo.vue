<!-- author: fo -->
<!-- date: 2022-02-17 15:39:07 -->
<!-- description: Profile -->
<template>
  <div class="main">
    <div class="row1">
      <div :class="[itsme ? 'col_head' : 'col_head_other']">
        <img
          :class="[itsme ? 'head_img' : 'head_img_other']"
          :src="headImg"
          alt=""
        />
        <div :class="[itsme ? 'head_title' : 'head_title_other']">
          {{ userName }}
        </div>
        <div
          v-show="!itsme"
          @click="followAuthorAction(userId)"
          class="followHim"
        >
          Follow
        </div>
      </div>
      <div class="col_intro">
        <img class="intro_more" src="../../assets/img/more@2x.png" alt="" />
        <span class="intro_text">
          {{ intro }}
        </span>
        <div class="intro_link" v-if="privateUrl">
          <span> {{ privateUrl }} </span>
        </div>
      </div>
    </div>
    <div class="row2" v-if="itsme">
      <div class="following">
        <span class="following_amount">{{ attentionNum }}</span>
        <span class="row2_title">Following</span>
      </div>
      <div class="followers">
        <span class="followers_amount">{{ fansNum }}</span>
        <span class="row2_title">Followers</span>
      </div>
      <div class="marked">
        <span class="marked_amount">{{ collectNum }}</span>
        <span class="row2_title">Marked</span>
      </div>
      <div class="articles">
        <span class="articles_amount">{{ wikiNum }}</span>
        <span class="row2_title">Articles</span>
      </div>
    </div>
    <div class="row2" style="padding-left: 150px" v-else>
      <div class="followers">
        <span class="followers_amount">{{ attentionNum }}</span>
        <span class="row2_title">Following</span>
      </div>
      <div class="marked">
        <span class="marked_amount">{{ fansNum }}</span>
        <span class="row2_title">Followers</span>
      </div>
      <div class="articles">
        <span class="articles_amount">{{ wikiNum }}</span>
        <span class="row2_title">Articles</span>
      </div>
    </div>
  </div>
</template>

<script>
import { baseURL, followAuthor, getCustomerInfo } from "@/actions/api";
import { postData } from "@/actions";
import { ElLoading, ElMessage } from "element-plus";
import { useStore } from "vuex";
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCookie, getUserUrl } from "@/assets/js/Common";
import OnlyMessage from "@/assets/js/onlyMsgbox";
export default {
  name: "UserInfo",
  props: {
    userdata: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const route = useRoute();
    let router = useRouter();
    const store = useStore();
    //console.log(store.state.userInfo.walletAddress)
    const walletAddr = ref(route.params.profileId);
    const apptoken = getCookie("apptoken");
    const itsme = ref(false);
    const headImg = ref(require("../../assets/img/avatar.png"));
    const userName = ref();
    const intro = ref();
    const dHost = ref();
    const privateUrl = ref();
    const host = ref();
    const type = ref();
    const fansNum = ref(0);
    const attentionNum = ref(0);
    const collectNum = ref(0);
    const wikiNum = ref(0);
    const userId = ref();
    const definedHost = ref();
    const nameservice = ref();
    const walletAddress = ref();
    // onBeforeMount( () => {
    //   console.log(window.location.href)
    //   const urlArr = window.location.href.split('/');
    //
    //   urlArr.forEach(function(item){
    //    // console.log(item)
    //     if(item.indexOf('.crypnote.io') != -1){
    //       host.value = item.substring(0,item.indexOf('.crypnote.io'))
    //       if(host.value.indexOf('.') != -1){
    //         type.value = 2
    //       }else{
    //         type.value = 1
    //       }
    //     }
    //   })
    //   if(walletAddr.value && !host.value){
    //     host.value = walletAddr.value;
    //     type.value = 0
    //   }
    //   getCustomer();
    // });
    onMounted(() => {
      //console.log('userInfo' + props.userdata)
      watch(
        () => props.userdata,
        () => {
          // console.log(JSON.stringify(props.userdata))
          if (store.state.userInfo) {
            if (
              props.userdata.walletAddress == store.state.userInfo.walletAddress
            ) {
              itsme.value = true;
            } else {
              itsme.value = false;
            }
          } else {
            itsme.value = false;
          }
          console.log(props.userdata);
          if (props.userdata.headImg) {
            headImg.value = baseURL + props.userdata.headImg;
          }
          privateUrl.value = props.userdata.privateUrl;
          userName.value = props.userdata.userName;
          userId.value = props.userdata.id;
          intro.value = props.userdata.intro
            ? props.userdata.intro
            : "This guy didn't leave any words.";
          dHost.value = props.userdata.defineHost;
          nameservice.value = props.userdata.nameservice;
          fansNum.value = props.userdata.fans;
          attentionNum.value = props.userdata.attentionNum;
          collectNum.value = props.userdata.collectCount
            ? props.userdata.collectCount
            : 0;
          wikiNum.value = props.userdata.wikiNum;
          definedHost.value = props.userdata.definedHost;
          nameservice.value = props.userdata.nameservice;
          walletAddress.value = props.userdata.walletAddress;
        }
      );
    });
    // const getCustomer = async () => {
    //   console.log(walletAddr.value)
    //   try {
    //     const updatedResource = await postData(getCustomerInfo, {
    //       type: type.value,
    //       host: host.value
    //     });
    //     //
    //     if(updatedResource.success){
    //       if(updatedResource.data.headImg){
    //         headImg.value = baseURL + updatedResource.data.headImg
    //       }
    //       console.log(updatedResource.data)
    //       privateUrl.value = updatedResource.data.privateUrl
    //       userName.value = updatedResource.data.userName
    //       intro.value = updatedResource.data.intro ? updatedResource.data.intro : "This guy didn't leave any words."
    //       dHost.value = updatedResource.data.defineHost
    //       nameservice.value = updatedResource.data.nameservice
    //     }else{
    //       OnlyMessage.error(updatedResource.msg);
    //     }
    //
    //   } catch (e){
    //     OnlyMessage.error(e);
    //   }
    // }
    const followAuthorAction = async (userId) => {
      if (!store.state.userInfo) {
        const userUrl = getUserUrl("", {
          definedHost: definedHost.value,
          nameservice: nameservice.value,
          walletAddress: walletAddress.value,
        });
        router.push({
          path: "/login",
          query: {
            redirectURL: userUrl,
          },
        });
        return;
      }

      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      try {
        const updatedResource = await postData(followAuthor, {
          apptoken: apptoken,
          userId: userId,
        });
        loading.close();
        if (updatedResource.success) {
          console.log(updatedResource);
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        loading.close();
        console.log("errror", errorMessage);
        OnlyMessage.error(errorMessage);
      }
    };
    return {
      itsme,
      headImg,
      userName,
      intro,
      privateUrl,
      fansNum,
      wikiNum,
      attentionNum,
      collectNum,
      userId,
      followAuthorAction,
    };
  },
};
</script>

<style scoped>
.main {
  width: 100%;
  height: 255px;
  background: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
.row1 {
  height: 145px;
}
.row2 {
  height: 109px;
}
.col_head {
  width: 159px;
  height: 144px;
  text-align: center;
  border-right: 1px solid #e5e5ea;
  display: inline-block;
  border-bottom: 1px solid #e5e5ea;
}
.col_head_other {
  width: 159px;
  height: 255px;
  text-align: center;
  border-right: 1px solid #e5e5ea;
  display: inline-block;
}
.head_img {
  width: 64px;
  height: 64px;
  border-radius: 64px;
  margin-top: 33px;
}
.head_img_other {
  width: 80px;
  height: 80px;
  margin-top: 45px;
}
.head_title {
  font-size: 14px;
  font-family: AvenirNext-Bold, AvenirNext;
  font-weight: bold;
  color: #000000;
  line-height: 14px;
  margin-top: 10px;
}
.head_title_other {
  font-size: 16px;
  font-family: AvenirNext-Bold, AvenirNext;
  font-weight: bold;
  color: #000000;
  line-height: 16px;
  margin-top: 13px;
}
.followHim {
  width: 100px;
  height: 34px;
  background: #1c1c1e;
  border-radius: 17px;
  font-size: 16px;
  font-family: Avenir-Heavy, Avenir;
  font-weight: 800;
  color: #ffffff;
  line-height: 34px;
  margin: 0 auto;
  margin-top: 26px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.col_intro {
  width: 460px;
  height: 144px;
  display: inline-block;
  float: right;
  border-bottom: 1px solid #e5e5ea;
}

.intro_more {
  width: 24px;
  height: 24px;
  float: right;
  display: block;
  margin-top: 20px;
  margin-right: 20px;
}
.intro_text {
  width: 370px;
  margin: 0 auto;
  margin-top: 40px;
  display: block;
  font-size: 12px;
  font-family: AvenirNext-Medium, AvenirNext;
  font-weight: 500;
  color: #757575;
  line-height: 16px;
}
.intro_link {
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #757575;
  line-height: 24px;
  margin-left: 49px;
  margin-top: 21px;
}
.intro_link span {
  width: 80px;
  height: 24px;
  background: #eeeeef;
  border-radius: 12px;
  display: block;
  text-align: center;
}
.row2 div {
  text-align: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.articles {
  display: inline-block;
  height: 109px;
  width: 139px;
  text-align: center;
}
.following,
.followers,
.marked {
  display: inline-block;
  height: 109px;
  width: 159px;
  border-right: 1px solid #e5e5ea;
}
.following_amount,
.followers_amount,
.marked_amount,
.articles_amount {
  margin-top: 34px;
  display: block;
  font-size: 20px;
  font-weight: bolder;
}
.row2_title {
  font-size: 12px;
  font-family: Avenir-Heavy, Avenir;
  font-weight: 800;
  color: #000000;
  line-height: 16px;
  margin-top: 12px;
}
</style>