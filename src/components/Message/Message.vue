<!-- author: nico -->
<!-- date: 2022-02-19 19:18:35 -->
<!-- description: Message -->
<template>
  <el-dropdown trigger="hover" :tabindex="0">
    <img src="../../assets/img/bell.png" style="width: 18px; margin-top: 7px" />
    <template #dropdown>
      <el-dropdown-menu>
        <div class="Message_box" @click="isVisiableFilterBox = false">
          <div class="Message_nav">
            <div class="nav_left">
              <span
                v-for="(item, k) in nav"
                :key="k"
                @click="changNav(item.value)"
                :class="{ Message_nav_active: item.value == currentNav }"
              >
                {{ item.label }}
              </span>
            </div>
            <!-- <div class="Allread">All read</div> -->
          </div>
          <div class="Message_container">
            <div class="Personal_container">
              <!-- <div class="Personal_nav">
                <div class="nav_item nav_item_active">
                  <span>Updates</span>
                  <span class="Message_tip"></span>
                </div>
                <div class="nav_item">
                  <span>Comments</span>
                </div>
              </div> -->
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
                  <img :src="getImgURL(message.headImg)" />
                  <div class="list_info">
                    <div class="info_content">
                      {{ message.content }}
                    </div>
                    <div class="info_time">{{ message.createTime }}</div>
                  </div>
                </div>
                <el-empty
                  description="No data available for the time being"
                  v-show="isEmpty"
                  style="width: 100%"
                ></el-empty>
              </div>
              <div class="Personal_bottom">
                <el-checkbox
                  label="View relevant to me only"
                  size="large"
                ></el-checkbox>
                <div class="Personal_bottom_img">
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="Message settings"
                    placement="bottom"
                  >
                    <router-link :to="{ path: '/setingUserInfo' }">
                      <img src="../../assets/img/seting.png" />
                    </router-link>
                  </el-tooltip>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="Message history"
                    placement="left"
                  >
                    <router-link :to="{ path: '/message' }"
                      ><img
                        src="../../assets/img/time.png"
                        style="width: 30px; height: 30px"
                    /></router-link>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { postData } from "@/actions";
import { sysmsg, imgBaseURL } from "@/actions/api";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import { useStore } from "vuex";
import { getCookie } from "@/assets/js/Common";
export default defineComponent({
  name: "Message",
  setup() {
    let store = useStore();
    const apptoken = getCookie("apptoken");
    const messageType = 0;
    let type = null;
    const sysmsgParmas = {
      apptoken,
      messageType,
      type,
    };
    let MessageList = ref([]);
    let isEmpty = ref(false);
    const getMessage = () => {
      MessageList.value = [];
      postData(sysmsg, sysmsgParmas)
        .then((MessageResult) => {
          if (MessageResult.success) {
            //console.log("MessageResult", MessageResult);
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
    };
  },
});
</script>

<style scoped lang='scss'>
@import "../../assets/style/Message/Message.scss";
</style>