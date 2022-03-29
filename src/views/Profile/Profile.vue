<!-- author: fo -->
<!-- date: 2022-02-17 15:39:07 -->
<!-- description: Profile -->
<template>
  <div
    id="table_content_collection"
    class="home_bg"
    @scroll="scroll"
    v-show="pageLoaded"
  >
    <Nav />
    <div class="home">
      <div class="home_left">
        <div class="p_title">Profile</div>
        <UserInfo :userdata="userInfoData"></UserInfo>
        <div class="a_title">Articles</div>
        <!--        <Archive ref="articledata" @created="handleevent"></Archive>-->
        <div v-for="(item, index) in articleList" :key="index" class="article">
          <a :href="item.url" target="_blank">
            <div class="title">
              {{ item.title }}
            </div>
            <div class="content">
              {{ item.content }}
            </div>
          </a>
          <div class="info">
            <span class="date"> {{ item.date }}</span> <span>/</span>
            <!--      <span class="time"> {{ item.time }}</span-->
            <!--      >/-->
            <span class="keys" v-if="item.keys1"> {{ item.keys1 }}</span>
            <span class="keys" v-if="item.keys2"> {{ item.keys2 }}</span>
            <span class="keys" v-if="item.keys3"> {{ item.keys3 }}</span>
            <span class="keys" v-if="item.keys4"> {{ item.keys4 }}</span>
            <span class="keys" v-if="item.keys5"> {{ item.keys5 }}</span>
            <img
              v-show="item.islike"
              @click="delCollectAction(item.islike, index)"
              alt=""
              class="like"
              src="../../assets/img/like.png"
            />
            <img
              v-show="!item.islike"
              @click="collectAction(item.id, index)"
              alt=""
              class="like"
              src="../../assets/img/unlike.png"
            />
          </div>
        </div>
      </div>
      <div class="home_right">
        <div class="p_title">Web3 Board</div>
        <Myboard :userdata="userInfoData" />
        <div class="a_title">Followed Tokens</div>
        <FollowedToken :userdata="userInfoData" />
        <div class="visitors">657 visitors</div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onBeforeMount, onMounted, ref } from "vue";
// import Archive from "@/components/Profile/Archive";
import UserInfo from "@/components/Profile/UserInfo";
import FollowedToken from "@/components/Profile/FollowedToken";
import Myboard from "@/components/Profile/Myboard";
import Nav from "@/components/Nav/Nav.vue";
import { useStore } from "vuex";
import { postData } from "@/actions";
import {
  baseURL,
  collectQuill,
  delCollectQuill,
  getcustomer,
  getCustomerInfo,
  wikiList,
} from "@/actions/api";
import { useRoute, useRouter } from "vue-router";
import { getCookie, getUserUrl, getUserUrlType } from "@/assets/js/Common";
import { ElLoading, ElMessage } from "element-plus";
import router from "@/router";
import OnlyMessage from "@/assets/js/onlyMsgbox";
export default defineComponent({
  name: "Profile",
  components: {
    UserInfo,
    // Archive,
    Myboard,
    FollowedToken,
    Nav,
  },

  setup() {
    const route = useRoute();
    let router = useRouter();
    const store = useStore();
    const apptoken = getCookie("apptoken");
    //const walletAddr = ref(route.params.walletAddress);
    const pageLoaded = ref(false);

    let definedHost = store.state.customerInfo.definedHost;
    let wallerAddr = store.state.walletAddr;
    const host = ref(definedHost ? definedHost : wallerAddr);
    const type = ref(1);
    let articleList = ref([]);
    const userInfoData = ref({});
    const userId = ref();
    let currentPageIndex = 1;
    let dataComplete = false;
    onBeforeMount(() => {
      // getUserUrlType(walletAddr.value, (data) => {
      //   console.log(data);
      //   host.value = data.host;
      //   type.value = data.type;
      // });
      getCustomer(() => {
        getWikiList(1);
      });
    });
    const getWikiList = async (pageIndex) => {
      try {
        const updatedResource = await postData(wikiList, {
          apptoken: apptoken,
          userId: userId.value,
          pageSize: 10,
          pageIndex: pageIndex,
        });
        console.log(updatedResource.data);
        if (updatedResource.success) {
          let arr = updatedResource.data.list;
          let dataArr = [];
          arr.forEach(function (item) {
            const userUrl = getUserUrl(item.shorthash, {
              definedHost: item.definedHost,
              nameservice: item.nameservice,
              walletAddress: item.walletAddress,
            });
            const timeStr = new Date(item.createTime.replace(/-/g, "/"))
              .toDateString()
              .split(" ");
            dataArr.push({
              title: decodeURI(item.title),
              content: item.shotContent,
              date: timeStr[2] + " " + timeStr[1],
              keys1: item.topic1,
              keys2: item.topic2,
              keys3: item.topic3,
              keys4: item.topic4,
              keys5: item.topic5,
              islike: item.collectId ? item.collectId : "",
              id: item.id,
              url: userUrl ? userUrl : "#",
            });
          });
          articleList.value = articleList.value.concat(dataArr);

          if (
            updatedResource.data.pageCount == updatedResource.data.pageIndex
          ) {
            dataComplete = true;
          } else {
            currentPageIndex = updatedResource.data.pageIndex + 1;
          }
        }
      } catch {}
    };

    const getArticles = () => {
      if (!dataComplete) {
        getWikiList(currentPageIndex);
      }
    };
    const scroll = () => {
      const dom = document.getElementById("table_content_collection");
      let scrollHeight = dom.scrollHeight;
      let scrollTop = dom.scrollTop;
      let clientHeight = dom.clientHeight;
      if (scrollHeight - clientHeight == scrollTop) {
        getArticles();
      }
    };
    const getCustomer = async (action) => {
      console.log(wallerAddr);
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      try {
        const updatedResource = await postData(getCustomerInfo, {
          apptoken: apptoken,
          type: type.value,
          host: host.value,
        });
        loading.close();
        if (updatedResource.success) {
          //console.log(updatedResource.data)
          pageLoaded.value = true;
          userInfoData.value = updatedResource.data;
          userId.value = updatedResource.data.id;
          return action();
        } else {
          OnlyMessage.error(updatedResource.msg);
          //router.replace("/404");
        }
      } catch (e) {
        loading.close();
        OnlyMessage.error(e);
      }
    };
    const collectAction = async (id, index) => {
      articleList.value[index].islike = true;
      try {
        const updatedResource = await postData(collectQuill, {
          apptoken: apptoken,
          flag: 0,
          wikiId: id,
        });
        if (updatedResource.success) {
          articleList.value[index].islike = updatedResource.data;
        } else {
          articleList.value[index].islike = "";
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        articleList.value[index].islike = "";
        console.log("errror", errorMessage);
        OnlyMessage.error(errorMessage);
      }
    };
    const delCollectAction = async (id, index) => {
      articleList.value[index].islike = "";
      try {
        const updatedResource = await postData(delCollectQuill, {
          apptoken: apptoken,
          id: id,
        });
        if (updatedResource.success) {
        } else {
          articleList.value[index].islike = id;
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        articleList.value[index].islike = id;
        console.log("errror", errorMessage);
        OnlyMessage.error(errorMessage);
      }
    };
    return {
      scroll,
      articleList,
      userInfoData,
      userId,
      pageLoaded,
      collectAction,
      delCollectAction,
    };
  },
});
</script>

<style scoped>
.home_bg {
  width: 100%;
  overflow-y: scroll;
  background: #fafafa;
  height: auto;
  height: calc(100% - 118px);
  padding-top: 118px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}
.home {
  width: 950px;
  margin: 0 auto;
}
.home_left {
  width: 620px;
  display: inline-block;
}
.home_right {
  width: 300px;
  margin-left: 20px;
  display: inline-block;
  float: right;
}
.p_title {
  font-size: 18px;
  font-family: AvenirNext-DemiBold, AvenirNext;
  font-weight: 600;
  color: #333333;
  line-height: 25px;
  margin-bottom: 10px;
}
.a_title {
  margin-top: 40px;
  margin-bottom: 10px;
  font-size: 18px;
  font-family: AvenirNext-DemiBold, AvenirNext;
  font-weight: 600;
  color: #333333;
  line-height: 25px;
}
.visitors {
  font-size: 12px;
  font-family: AvenirNext-Medium, AvenirNext;
  font-weight: 500;
  color: #757575;
  line-height: 16px;
  text-align: center;
  margin-top: 10px;
}
</style>

<style scoped>
.articeMain {
  overflow-y: scroll;
}
.article {
  width: 600px;
  height: 156px;
  background: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding-left: 20px;
  padding-top: 28px;
  margin-bottom: 20px;
}
.title {
  width: 550px;
  height: 50px;
  font-size: 18px;
  font-family: AvenirNext-DemiBold, AvenirNext;
  font-weight: 600;
  color: #000000;
  line-height: 20px;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
.content {
  width: 550px;
  height: 32px;
  font-size: 12px;
  font-family: AvenirNext-Medium, AvenirNext;
  font-weight: 500;
  color: #757575;
  line-height: 16px;
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  word-wrap: break-word;
}
.info {
  font-size: 12px;
  font-family: AvenirNext-Medium, AvenirNext;
  font-weight: 500;
  color: #757575;
  line-height: 16px;
  margin-top: 32px;
}
.info span {
  margin-left: 10px;
}
.info span:first-child {
  margin-right: 10px;
  margin-left: 0;
  float: left;
  line-height: 24px;
}
.info span:nth-child(2) {
  margin-left: 0;
  float: left;
  line-height: 24px;
  font-size: 16px;
}

.keys {
  width: 60px;
  height: 24px;
  background: #eeeeef;
  border-radius: 12px;
  text-align: center;
  line-height: 24px;

  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 5px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.like {
  width: 23px;
  height: 28px;
  display: inline-block;
  float: right;
  margin-right: 20px;
}
</style>