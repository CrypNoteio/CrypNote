<!-- author: nico -->
<!-- date: 2022-02-14 11:52:44 -->
<!-- description: Campaigns -->
<template>
  <div class="Campaigns">
    <div class="top">
      <div class="center">
        <div class="div1">
          <div class="title">
            <div class="left">
              <div class="left_top">
                <span class="Project">Project Galaxy</span>
                <img src="../../assets/img/title_icon.png" />
              </div>
              <span class="left_bottom">Campaign Explorer</span>
            </div>
            <div class="right">
              <img class="logo" src="../../assets/img/logo_icon.png" />
              <div class="Cooperation">
                <span>@stevenkin</span>
                <img src="../../assets/img/@stevenkin.png" />
              </div>
            </div>
          </div>
          <div class="input_container">
            <div class="input_box">
              <input
                placeholder="Your wallect address"
                v-model="wallet_address"
              />
            </div>
            <div v-if="!isFillter" class="filter_btns">
              <div class="Participated" @click="ParticipatedHandler()">
                Participated
              </div>
              <div class="Whitelisted" @click="WhitelistedHandler()">
                Whitelisted
              </div>
            </div>
            <div class="clean" @click="CleanHandler()" v-else>Clean</div>
          </div>
          <div class="Campaign_show">
            <span>Showing {{ total }} Campaign</span>
            <div class="filer_img" @click="filerImg">
              <img
                :src="imgsVisiabl ? img2 : img1"
                :class="imgsVisiabl ? 'img2' : 'img1'"
              />
              <span>Show Image</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="list_item" v-for="(item, index) in data" :key="index">
        <img :src="item.thumbnail" v-if="imgsVisiabl" />
        <div class="item_info" :class="!imgsVisiabl ? 'item_width' : null">
          <div class="box">
            <div class="box_left">
              <a class="link" :href="getURL(item.id)" target="_blank">{{
                item.name
              }}</a>
              <span class="by">by</span>
              <a
                :href="getURL3(item.dao.alias)"
                class="openblox"
                target="_blank"
                >{{ item.dao.name }}</a
              >
            </div>
            <div class="box_right">
              <span class="MATIC">MATIC</span>
              <span class="Minted">{{ item.numNFTMinted }} Minted</span>
            </div>
          </div>
          <div class="time" v-if="item.endTime">
            From {{ getTimer(item.startTime) }} +0800 To
            {{ getTimer(item.endTime) }} +0800
          </div>
          <div class="time" v-else>From {{ getTimer(item.startTime) }}</div>
          <div
            class="Badge"
            v-for="(badge, i) in item.creds"
            :key="i"
            :class="item.creds.length > 1 ? 'marginbottom' : null"
          >
            <a :href="getURL2(badge.id)" target="_blank">{{ badge.name }}</a>
            <span>{{ badge.itemCount }} WL</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { postData } from "../../actions/index";
import { ElMessage, ElLoading } from "element-plus";
import { getTime } from "../../assets/js/Common";
import OnlyMessage from "@/assets/js/onlyMsgbox";
export default defineComponent({
  name: "Campaigns",
  setup() {
    let store = useStore();
    store.dispatch("set_isDashboard", false);

    let data = ref([]);
    let imgsVisiabl = ref(false);
    const img1 = ref(require("../../assets/img/check_icon.png"));
    const img2 = ref(require("../../assets/img/checked.png"));
    let wallet_address = ref("");
    let total = ref(0);
    let isFillter = ref(false);
    let initData = [];
    let initTotal = 0;
    const getList = () => {
      postData("https://crypnote.io/api/upcoming.do", null)
        .then((list) => {
          console.log("list", list);
          data.value = list.msg.data.listCampaigns.list;
          total.value = list.msg.data.listCampaigns.list.length;
          initData = list.msg.data.listCampaigns.list;
          initTotal = list.msg.data.listCampaigns.list.length;
        })
        .catch((error) => {
          console.log(error);
          OnlyMessage.error("Data loading failed");
        });
    };

    const filerImg = () => {
      imgsVisiabl.value = !imgsVisiabl.value;
    };
    const getTimer = (timer) => {
      return getTime(timer);
    };
    const getURL = (id) => {
      return "https://galaxy.eco/SnapFingersDAO/campaign/" + id;
    };
    const getURL2 = (id) => {
      return "https://galaxy.eco/credential/" + id;
    };
    const getURL3 = (alias) => {
      return "https://galaxy.eco/" + alias;
    };
    const ParticipatedHandler = () => {
      if (!wallet_address.value) {
        OnlyMessage.error("Wallet address cannot be empty.");
        return;
      }
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      data.value = [];
      total.value = 0;
      isFillter.value = true;
      postData("https://crypnote.io/api/address.do", {
        address: wallet_address.value,
      })
        .then((list) => {
          loading.close();
          data.value = list.msg.data;
          let d = [];
          initData.filter((item) => {
            list.msg.data.filter((currentItem) => {
              if (item.numberID == currentItem) {
                d.push(item);
              }
            });
          });
          data.value = d.filter((item, index) => {
            return d.findIndex((item1) => item1.id == item.id) == index;
          });
          total.value = list.msg.data.length;
        })
        .catch((error) => {
          console.log(error);
          loading.close();
          OnlyMessage.error("Data loading failed");
        });
    };
    const WhitelistedHandler = () => {
      if (!wallet_address.value) {
        OnlyMessage.error("Wallet address cannot be empty.");
        return;
      }
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      data.value = [];
      total.value = 0;
      isFillter.value = true;
      postData("https://crypnote.io/api/credentials.do", {
        address: wallet_address.value,
      })
        .then((list) => {
          loading.close();
          data.value = list.msg.data;
          let d = [];
          initData.filter((item) => {
            list.msg.data.filter((currentItem) => {
              if (item.creds.length > 0) {
                item.creds.filter((creds) => {
                  if (creds.id == currentItem) {
                    d.push(item);
                  }
                });
              }
            });
          });
          data.value = d.filter((item, index) => {
            return d.findIndex((item1) => item1.id == item.id) == index;
          });
          total.value = list.msg.data.length;
        })
        .catch((error) => {
          console.log(error);
          loading.close();
          OnlyMessage.error("Data loading failed");
        });
    };
    const CleanHandler = () => {
      data.value = initData;
      total.value = initTotal;
      wallet_address.value = "";

      isFillter.value = false;
    };
    onMounted(() => {
      getList();
    });
    return {
      data,
      imgsVisiabl,
      img1,
      img2,
      wallet_address,
      total,
      isFillter,
      filerImg,
      getTimer,
      getURL,
      getURL2,
      getURL3,
      ParticipatedHandler,
      WhitelistedHandler,
      CleanHandler,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../../assets/style/Main/Campaigns.scss";
</style>