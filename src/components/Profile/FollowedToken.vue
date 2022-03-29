<!-- author: fo -->
<!-- date: 2022-02-17 15:39:07 -->
<!-- description: Profile -->
<template>
  <div class="tokenlist" v-show="!editStatus">
    <div class="title">
      <div>Tokens</div>
      <div>Price($)</div>
      <div>24h</div>
    </div>
    <div
      v-for="(item, index) in attentionTokenRes"
      class="followedList"
      :key="index"
    >
      <div class="tokenName">
        <img :src="item.logo" alt="" />
        {{ item.symbol }}
      </div>
      <div class="tokenPrice">
        {{ fixFloat(item.price) }}
      </div>
      <div>
        <span
          class="tokenKline"
          :class="[
            item.percent_change_24h > 0 ? 'tokenKlineUp' : 'tokenKlineDown',
          ]"
        >
          {{ fixFloat(item.percent_change_24h) + "%" }}
        </span>
      </div>
    </div>

    <div class="opButton" v-if="itsme">
      <img
        class="editTokenList"
        src="../../assets/img/editTokenList.png"
        alt=""
        @click="editAction()"
        v-if="!editStatus"
      />
    </div>
  </div>

  <div class="tokenlist_a" v-if="itsme" v-show="editStatus">
    <div class="searchTokenTop">
      <img src="../../assets/img/Search.png" alt="" />
      <input
        type="text"
        id="searchInput"
        class="searchToken"
        placeholder="Search"
      />
    </div>

    <div class="followedContent">
      <div
        v-for="(item, index) in attentionTokenRes"
        class="followedList_a"
        :key="index"
        @click="attentionToken(item.id, 'del')"
        @mouseover="delTokenMouseOver"
        @mouseout="delTokenMouseOut"
        :style="tokenActive"
      >
        <div class="addTokenList">
          <img :src="item.logo" alt="" class="tokenImg" />
          {{ item.symbol }}
          <img src="../../assets/img/delToken.png" class="delToken" alt="" />
        </div>
      </div>
    </div>
    <div class="unfollowedContent">
      <div
        v-for="(item, index) in searchTokenRes"
        class="unfollowedList_a"
        :key="index"
        @click="attentionToken(item.id, 'add')"
      >
        <div class="delTokenList">
          <img :src="item.logo" alt="" class="tokenImg" />
          {{ item.symbol }}
          <img src="../../assets/img/addToken.png" class="addToken" alt="" />
        </div>
      </div>
    </div>
    <div class="opButton" style="padding-left: 20px; padding-right: 20px">
      <div class="follow" v-if="editStatus" @click="editTokenCancel">
        Confirm
      </div>
      <!--      <img class="follow" src="../../assets/img/editTokenCancel.png" alt=""-->
      <!--           v-if="editStatus"-->
      <!--           @click="editTokenCancel"/>-->
      <!--      <img class="unfollow" src="../../assets/img/editTokenConfirm.png" alt=""  v-if="editStatus"/>-->
    </div>
  </div>
</template>

<script>
import computed, { onMounted, ref, watch } from "vue";
import { attention, attentionList, baseURL, getCoinList } from "@/actions/api";
import { postData } from "@/actions";
import { useStore } from "vuex";
import { ElLoading, ElMessage } from "element-plus";
import { getCookie } from "@/assets/js/Common";
import OnlyMessage from "@/assets/js/onlyMsgbox";
export default {
  name: "FollowedToken",
  props: {
    userdata: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const store = useStore();
    const apptoken = getCookie("apptoken");
    const itsme = ref(false);
    const editStatus = ref(false);
    const searchTokenRes = ref([]);
    const attentionTokenRes = ref([]);
    let attenTionTokenName = [];
    let getCoins = []; //all the token list
    const tokenActive = ref();
    const userId = ref();
    onMounted(() => {
      watch(
        () => props.userdata,
        () => {
          //console.log(props.userdata);
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
          userId.value = props.userdata.id;
          getAttentionList();
        }
      );
    });
    const getTokens = async () => {
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
        target: ".tokenlist_a",
      });
      try {
        const updatedResource = await postData(getCoinList, {
          apptoken: apptoken,
        });
        loading.close();
        if (updatedResource.success) {
          getCoins = updatedResource.data.list;
          let tmpArr = [];
          for (let i = 0; i < 20; i++) {
            const delTokenIndex = attenTionTokenName.indexOf(
              getCoins[i].symbol
            );
            if (delTokenIndex == -1) {
              //console.log(getCoins[i].symbol);
              tmpArr.push(getCoins[i]);
            }
          }
          searchTokenRes.value = tmpArr;
        } else {
          loading.close();
          OnlyMessage.error(updatedResource.msg);
        }
      } catch {
        loading.close();
      }
    };
    const attentionToken = async (coinId, action) => {
      try {
        //console.log("start" + coinId);
        const updatedResource = await postData(attention, {
          apptoken: apptoken,
          coinId: coinId,
        });
        if (updatedResource.success) {
          //console.log(updatedResource);
          if (action == "add") {
            searchTokenRes.value.forEach(function (item, index) {
              if (item.id == coinId) {
                searchTokenRes.value.splice(index, 1);
                attentionTokenRes.value.unshift(item);
                //attentionTokenRes.value = sortByKey(attentionTokenRes.value,'id')
              }
            });
          } else if (action == "del") {
            attentionTokenRes.value.forEach(function (item, index) {
              if (item.id == coinId) {
                attentionTokenRes.value.splice(index, 1);
                const delTokenIndex = attenTionTokenName.indexOf(item.symbol);
                attenTionTokenName.splice(delTokenIndex, 1);
              }
            });
          }
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
      } catch {}
    };
    const getAttentionList = async () => {
      try {
        const updatedResource = await postData(attentionList, {
          apptoken: apptoken,
          userId: userId.value,
        });
        if (updatedResource.success) {
          attentionTokenRes.value = updatedResource.data.list;
          updatedResource.data.list.forEach(function (item) {
            attenTionTokenName.push(item.symbol);
          });
          //console.log(attentionTokenRes.value)
          attentionTokenRes.value = sortByKey(attentionTokenRes.value, "id");
          //console.log(attentionTokenRes.value)
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
      } catch {}
    };
    const editAction = () => {
      getTokens();
      const searchInput = document.getElementById("searchInput");
      const searchInputFn = () => {
        let changeCoins = [];

        getCoins.forEach(function (item, index) {
          if (
            item.symbol.indexOf(searchInput.value) == 0 &&
            changeCoins.length < 20
          ) {
            if (attenTionTokenName.indexOf(item.symbol) == -1) {
              changeCoins.push(item);
            }
          }
        });
        searchTokenRes.value = changeCoins;
      };
      //listion input event
      searchInput.addEventListener("input", searchInputFn);
      editStatus.value = true;
    };
    const sortByKey = (array, key) => {
      return array.sort(function (a, b) {
        const x = a[key];
        const y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
      });
    };
    const fixFloat = (val, type) => {
      if (Math.abs(val) > 0.1) {
        return Number(val).toFixed(2);
      } else if (Math.abs(val) < 0.1 && Math.abs(val) > 0.01) {
        return Number(val).toFixed(3);
      } else if (Math.abs(val) < 0.01 && Math.abs(val) > 0.001) {
        return Number(val).toFixed(4);
      } else if (Math.abs(val) < 0.001 && Math.abs(val) > 0.0001) {
        return Number(val).toFixed(5);
      } else {
        return Number(val).toFixed(8);
      }
    };
    const editTokenCancel = () => {
      editStatus.value = false;
    };
    return {
      itsme,
      editAction,
      editStatus,
      searchTokenRes,
      attentionTokenRes,
      attentionToken,
      fixFloat,
      tokenActive,
      editTokenCancel,
    };
  },
};
</script>

<style scoped>
.tokenlist {
  width: 260px;
  background: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px;
  padding-bottom: 25px;
}
.title div {
  width: 36%;
  display: inline-block;
  font-size: 14px;
  font-family: AvenirNext-DemiBold, AvenirNext;
  font-weight: 600;
  color: #000000;
  line-height: 19px;
}
.title div:last-child {
  text-align: right;
  width: 28%;
}
.followedList {
  margin-top: 20px;
  height: 10px;
}
.followedList div {
  width: 36%;
  float: left;
}
.followedList div:last-child {
  text-align: right;
  width: 28%;
}
.tokenName {
  font-size: 12px;
  font-family: Avenir-Heavy, Avenir;
  font-weight: 800;
  color: #000000;
  line-height: 26px;
  display: flex;
}
.tokenName img {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}
.tokenPrice {
  font-size: 12px;
  font-family: Avenir-Heavy, Avenir;
  font-weight: 800;
  color: #000000;
  line-height: 26px;
}
.tokenKline {
  width: 64px;
  height: 24px;
  border-radius: 4px;
  text-align: center;
  font-size: 12px;
  font-family: AvenirNext-DemiBold, AvenirNext;
  font-weight: 600;
  color: #ffffff;
  line-height: 26px;
  display: block;
  float: right;
}
.tokenKlineUp {
  background: #10d993;
}
.tokenKlineDown {
  background: #ea566e;
}

.searchTokenTop {
  position: relative;
  height: 70px;
  border-bottom: 1px solid #f2f2f7;
}
.searchTokenTop img {
  width: 18px;
  position: absolute;
  top: 25px;
  left: 23px;
}
.searchTokenTop input {
  height: 36px;
  width: 240px;
  background: rgba(118, 118, 128, 0.12);
  border-radius: 10px;
  border: 0px;
  padding-left: 28px;
  line-height: 36px;
  font-size: 16px;
  font-family: AvenirNext-Medium, AvenirNext;
  font-weight: 500;
  color: rgba(60, 60, 67, 0.6);
  margin: 17px 16px;
}
.tokenlist_a {
  width: 300px;
  background: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding-bottom: 15px;
}
.followedList_a,
.unfollowedList_a {
  height: 32px;
  padding: 0 20px;
  margin-bottom: 4px;
}
.followedList_a:first-child,
.unfollowedList_a:first-child {
  margin-top: 16px;
}
.followedList_a:last-child {
  margin-bottom: 0;
}
.addTokenList,
.delTokenList {
  font-size: 12px;
  font-family: Avenir-Heavy, Avenir;
  font-weight: 800;
  color: #000000;
  line-height: 33px;
  display: flex;
  position: relative;
}
.addTokenList .tokenImg,
.delTokenList .tokenImg {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  margin-top: 4px;
}
.addTokenList .delToken,
.delTokenLis .addToken {
  width: 17px;
  height: 17px;
  position: absolute;
  right: 0;
  top: 7px;
}
.addTokenList .delToken,
.delTokenList .addToken {
  width: 17px;
  height: 17px;
  position: absolute;
  right: 0;
  top: 7px;
}
.followedContent {
  border-bottom: 1px solid #f2f2f7;
  max-height: 220px;
  overflow-y: scroll;
}
.unfollowedContent {
  padding-bottom: 0;
  max-height: 210px;
  overflow-y: scroll;
}

.opButton {
  margin-top: 34px;
}
.opButton .follow {
  width: 100%;
  height: 36px;
  background: #1c1c1e;
  color: #fefefe;
  text-align: center;
  font-size: 16px;
  line-height: 36px;
  font-family: Avenir-Heavy, Avenir;
  border-radius: 6px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.opButton .unfollow {
  width: 122px;
  margin-left: 16px;
}
.opButton .editTokenList {
  width: 100%;
}
.followedList_a:hover {
  background: rgba(236, 75, 99, 0.1);
}
.unfollowedList_a:hover {
  background: rgba(98, 211, 151, 0.1);
}
</style>