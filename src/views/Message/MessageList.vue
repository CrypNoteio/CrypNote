<!-- author: nico -->
<!-- date: 2022-02-24 12:21:43 -->
<!-- description: MessageList -->
<template>
  <div class="MessageListCantainer">
    <div class="menubar">
      <div class="menubar_left">
        <router-link :to="{ path: '/dashboard/workbench' }"
          ><i class="fa fa-chevron-left"></i
        ></router-link>
        <span>Historical news</span>
      </div>
      <div class="menubar_right">
        <router-link :to="{ path: '/setingUserInfo' }">
          <img src="../../assets/img/setting-icon.png" />
          <span>setting</span>
        </router-link>
      </div>
    </div>
    <div class="nav_bar">
      <span
        v-for="(item, k) in nav"
        :key="k"
        @click="changNav(item.value)"
        :class="{ Message_nav_active: item.value == currentNav }"
      >
        {{ item.label }}
      </span>
    </div>
    <div class="Personal_filter">
      <div
        class="filter_type"
        @click.stop="isVisiableFilterBox = !isVisiableFilterBox"
      >
        <span>{{ currentType }}</span>
        <i class="fa fa-chevron-down"></i>
      </div>
      <div class="filter_box" v-if="isVisiableFilterBox">
        <span
          v-for="(type, index) in FilterOptions"
          :key="index"
          @click="FilterHandler(type)"
          >{{ type.label }}</span
        >
      </div>
    </div>
    <div class="Personal_list">
      <div
        class="list_item"
        v-for="(message, index) in MessageList"
        :key="index"
      >
        <div class="item_left">
          <img :src="getImgURL(message.headImg)" />
          <div class="list_info">
            <div class="info_content">
              {{ message.content }}
            </div>
          </div>
        </div>
        <div class="info_time">{{ message.createTime }}</div>
      </div>
      <el-empty
        description="No data available for the time being"
        v-show="isEmpty"
        style="width: 100%"
      ></el-empty>
    </div>
    <el-pagination
      style="margin-top: 20px"
      layout="prev, pager, next"
      :total="recordCount"
      @current-change="currentChange"
      @prev-click="currentChange"
      @next-click="currentChange"
      :current-page="currentPage"
      v-if="MessageList.length > 0"
    >
    </el-pagination>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { postData } from "@/actions";
import { sysmsg, imgBaseURL } from "@/actions/api";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import { useStore } from "vuex";
import { getCookie } from "@/assets/js/Common";
export default defineComponent({
  name: "MessageList",
  setup() {
    let store = useStore();
    const apptoken = getCookie("apptoken");
    const messageType = 0;
    let type = null;
    const sysmsgParmas = {
      apptoken,
      messageType,
      type,
      pageSize: 10,
      pageIndex: 1,
    };
    let MessageList = ref([]);
    let isEmpty = ref(false);
    let recordCount = ref(0);
    let currentPage = ref(1);
    const getMessage = () => {
      MessageList.value = [];
      postData(sysmsg, sysmsgParmas)
        .then((MessageResult) => {
          if (MessageResult.success) {
            //console.log("MessageResult", MessageResult);
            recordCount.value = MessageResult.data.recordCount;
            if (MessageResult.data.list.length > 0) {
              isEmpty.value = false;
              MessageList.value = MessageResult.data.list;
            } else {
              isEmpty.value = true;
            }
          } else {
            OnlyMessage.error(MessageResult.msg);
          }
        })
        .catch((MessageError) => {
          console.log(MessageError);
        });
    };
    const currentChange = (page) => {
      sysmsgParmas.pageIndex = page;
      currentPage.value = page;
      getMessage();
    };
    onMounted(() => {
      getMessage();
    });
    let currentNav = ref(0);
    const nav = ref([
      {
        value: 0,
        label: "Personal",
      },
      {
        value: 1,
        label: "Team",
      },
      {
        value: 2,
        label: "Noteverse",
      },
    ]);
    const changNav = (value) => {
      sysmsgParmas.messageType = value;
      MessageList.value = [];
      currentNav.value = value;
      sysmsgParmas.pageIndex = 1;
      getMessage();
    };
    const FilterOptions = ref([
      {
        value: "",
        label: "All",
      },
      {
        value: 1,
        label: "Updates",
      },
      {
        value: 2,
        label: "Deleted",
      },
      {
        value: 4,
        label: "Sync to block",
      },
      {
        value: 3,
        label: "Recovery",
      },
    ]);
    let isVisiableFilterBox = ref(false);
    let currentType = ref("All");
    const FilterHandler = (data) => {
      sysmsgParmas.type = data.value;
      currentType.value = data.label;
      isVisiableFilterBox.value = false;
      sysmsgParmas.pageIndex = 1;
      getMessage();
    };
    const getImgURL = (imgurl) => {
      return imgBaseURL + imgurl;
    };
    return {
      nav,
      MessageList,
      FilterOptions,
      FilterHandler,
      isVisiableFilterBox,
      currentType,
      changNav,
      currentNav,
      isEmpty,
      getImgURL,
      recordCount,
      currentChange,
      currentPage,
    };
  },
});
</script>

<style scoped lang='scss'>
@import "../../assets/style/Message/MessageList.scss";
</style>