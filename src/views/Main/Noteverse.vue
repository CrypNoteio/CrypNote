<!-- author: fo -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: noteverse -->
<template>
  <div class="headerAll">
    <div class="left" style="flex-direction: row">
      <img src="../../assets/img/img2.png" class="logo" />
      <img src="../../assets/img/img13.png" class="beta" />
      <div class="label">
        <div class="labelN">
          <router-link :to="{ path: '/home' }" target="_blank"
            >Home</router-link
          >
          <router-link
            :to="{ path: '/noteverse' }"
            target="_blank"
            class="active"
            >Noteverse</router-link
          >
          <router-link :to="{ path: '/nft' }" target="_blank">NFT</router-link>
          <router-link target="_blank" :to="{ path: '/campaigns' }"
            >Campaigns</router-link
          >
        </div>
      </div>
    </div>
    <div class="btn">
      <div id="login">
        <a
          class="mouseHand router-link-active"
          style="color: rgba(174, 174, 178, 1)"
          href="https://crypnote.io/login"
          target="_blank"
          ><img src="../../assets/img/img9.png"
        /></a>
      </div>
      <div>
        <a
          class="mouseHand router-link-active"
          style="color: rgba(174, 174, 178, 1)"
          href="https://crypnote.io/sign"
          target="_blank"
          ><img src="../../assets/img/img10.png"
        /></a>
      </div>
    </div>
  </div>
  <div class="main_bg">
    <div class="main">
      <div class="leftmain" id="table_content_collection" @scroll="scroll">
        <input
          type="text"
          placeholder="Search for articles"
          class="searchInput"
        />
        <img class="searchImg" src="../../assets/img/Search@2x.png" alt="" />
        <div class="atag">
          <div class="recommend">Recommended For You</div>
          <div class="following" v-show="false">Following</div>
        </div>
        <div class="article" v-for="(item, index) in articleList" :key="index">
          <a :href="item.url" target="_blank">
            <div class="title">
              {{ item.title }}
            </div>
            <div class="content">
              {{ item.content }}
            </div>
          </a>

          <div class="userInfo">
            <a :href="item.userUrl" target="_blank">
              <img :src="baseURL + item.headImg" alt="" />
              {{ item.userName }}
            </a>
          </div>

          <div class="info">
            <span class="date"> {{ item.date }}</span
            ><span>/</span>
            <span class="keys" v-if="item.keys1"> {{ item.keys1 }}</span>
            <span class="keys" v-if="item.keys2"> {{ item.keys2 }}</span>
            <span class="keys" v-if="item.keys3"> {{ item.keys3 }}</span>
            <span class="keys" v-if="item.keys4"> {{ item.keys4 }}</span>
            <span class="keys" v-if="item.keys5"> {{ item.keys5 }}</span>
            <img src="../../assets/img/more@2x.png" class="more" alt="" />
            <img
              v-show="status && item.islike"
              @click="delCollectAction(item.islike, index)"
              src="../../assets/img/like.png"
              class="like"
              alt=""
            />
            <img
              v-show="status && !item.islike"
              @click="collectAction(item.id, index)"
              src="../../assets/img/unlike.png"
              class="like"
              alt=""
            />
          </div>
        </div>
      </div>
      <div class="rightmain">
        <div class="topicTitle">Recommended Topics</div>
        <div class="topicList">
          <div
            class="topic"
            v-for="(item, index) in recommendTopicArr"
            :key="index"
            :class="index == 0 ? 'chooseTopic' : ''"
          >
            {{ item.topic }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { getCookie, getUserUrl } from "@/assets/js/Common";
import { postData } from "@/actions";
import {
  baseURL,
  collectQuill,
  delCollectQuill,
  recommendtopics,
  wikiList,
} from "@/actions/api";
import OnlyMessage from "@/assets/js/onlyMsgbox";
export default defineComponent({
  name: "Noteverse",
  setup() {
    let store = useStore();
    store.dispatch("set_isDashboard", true);
    const apptoken = getCookie("apptoken");
    const articleList = ref([]);
    const recommendTopicArr = ref([]);
    let currentPageIndex = 1;
    let dataComplete = false;
    const bgHeight = ref();
    const status = apptoken ? ref(true) : ref(false);
    onMounted(() => {
      getWikiList(1);
      getRecommendTopics();
    });
    const getWikiList = async (pageIndex) => {
      try {
        const updatedResource = await postData(wikiList, {
          getAll: 1,
          pageSize: 5,
          pageIndex: pageIndex,
        });
        console.log(updatedResource.data);
        if (updatedResource.success) {
          console.log(updatedResource);
          let arr = updatedResource.data.list;
          let dataArr = [];
          arr.forEach(function (item) {
            const userUrl = getUserUrl("", {
              definedHost: item.definedHost,
              nameservice: item.nameservice,
              walletAddress: item.walletAddress,
            });
            const timeStr = new Date(item.createTime.replace(/-/g, "/"))
              .toDateString()
              .split(" ");
            dataArr.push({
              id: item.id,
              url: userUrl ? userUrl + item.shorthash : "#",
              userUrl: userUrl ? userUrl : "#",
              title: decodeURI(item.title),
              content: item.shotContent,
              date: timeStr[2] + " " + timeStr[1],
              keys1: item.topic1,
              keys2: item.topic2,
              keys3: item.topic3,
              keys4: item.topic4,
              keys5: item.topic5,
              islike: item.collectId ? item.collectId : "",
              userName: item.userName,
              headImg: item.headImg,
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
      console.log("scroll");
      const dom = document.getElementById("table_content_collection");
      let scrollHeight = dom.scrollHeight;
      let scrollTop = dom.scrollTop;
      let clientHeight = dom.clientHeight;
      console.log(scrollHeight + "  --   " + clientHeight);
      console.log(scrollTop);
      if (scrollHeight - clientHeight - 50 <= scrollTop) {
        getArticles();
      }
    };
    const getRecommendTopics = async () => {
      try {
        const updatedResource = await postData(recommendtopics, {
          apptoken: apptoken,
        });
        if (updatedResource.success) {
          console.log(updatedResource.data.list);
          recommendTopicArr.value = updatedResource.data.list;
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        console.log("errror", errorMessage);
        OnlyMessage.error(errorMessage);
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
      baseURL,
      recommendTopicArr,
      status,
      collectAction,
      delCollectAction,
      bgHeight,
    };
  },
});
</script>
<style scoped lang="scss">
.main_bg {
  width: 100%;
  background: linear-gradient(to right, #fafafa 50%, #ffffff 50%);
  height: calc(100% - 40px);
  overflow: hidden;
}
.main {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 1080px;
  background: #fafafa;
  height: 100%;
  margin: 0 auto;
  margin-top: 20px;
  overflow: hidden;
}

.leftmain {
  width: 70%;
  min-width: 750px;
  display: inline-block;
  text-align: right;
  position: relative;
  padding-right: 36px;
  background: #fafafa;
  height: calc(100%);
  overflow-y: scroll;
  -ms-overflow-style: none;
  overflow-y: -moz-scrollbars-none;
}
.leftmain::-webkit-scrollbar {
  display: none;
}
.rightmain {
  width: 30%;
  max-width: 308px;
  display: inline-block;
  padding-left: 46px;
  background: #ffffff;
  height: calc(100%);
}
@import "../../assets/style/Main/index.scss";
@import "../../assets/style/Main/Noteverse.scss";
</style>