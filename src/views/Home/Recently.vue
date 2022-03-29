<!-- author: nico -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: recently -->
<template>
  <div class="contentBok">
    <div class="moduleTitle">My Recently</div>
    <div class="table" @scroll="scroll" id="table_content_browsing">
      <table class="tableList" v-if="tableData.length > 0">
        <tr
          v-for="(item, index) in tableData"
          v-bind:key="index"
          @click="viewDetails(item)"
        >
          <td v-if="item.flag == 0">
            <img
              src="../../assets/img/Group.png"
              alt=""
              style="width: 28px; height: 28px; vertical-align: middle"
            />
          </td>
          <td v-else>
            <img
              v-if="item.type == 0"
              src="../../assets/img/home/homeIcon1.png"
              alt=""
              style="width: 28px; height: 28px; vertical-align: middle"
            />
            <img
              v-if="item.type == 2"
              src="../../assets/img/home/homeIcon4.png"
              alt=""
              style="width: 28px; height: 28px; vertical-align: middle"
            />
          </td>
          <td style="width: 30%">{{ decodeURI(item.title) }}</td>
          <td style="width: 40%" v-if="item.flag == 1">
            {{ item.userName }} / {{ decodeURI(item.name) }}
          </td>
          <td style="width: 40%" v-if="item.flag == 0">
            {{ item.userName }}
          </td>
          <td style="width: 25%">
            {{ item.createTime }}
          </td>
        </tr>
      </table>
      <el-empty
        v-else
        description="No data available for the time being"
      ></el-empty>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import { postData } from "@/actions";
import { useStore } from "vuex";
import { recentlylist, pageSize } from "@/actions/api";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import { useRouter } from "vue-router";
import {
  getTime,
  VerifyOperationPermissions,
  getCookie,
} from "@/assets/js/Common";
export default defineComponent({
  setup() {
    const store = useStore();
    const routers = useRouter();
    let tableData = ref([]);
    const apptoken = getCookie("apptoken");
    const address = store.state.userInfo?.walletAddress;
    onMounted(() => {
      broewsing(1);
    });
    let currentPageIndex = 1;
    let dataComplete = false;
    const broewsing = (pageIndex) => {
      postData(recentlylist, { apptoken, pageSize, pageIndex })
        .then((res) => {
          if (res.success) {
            let arr = res.data.list;
            if (arr.length > 0) {
              for (var i = 0; i < arr.length; i++) {
                if (arr[i].createTime == null) {
                  continue;
                } else {
                  arr[i].time = getTime(arr[i].createTime.time);
                }
              }
              tableData.value = tableData.value.concat(arr);
              if (res.data.pageCount == res.data.pageIndex) {
                dataComplete = true;
              } else {
                currentPageIndex = res.data.pageIndex + 1;
              }
            }
          } else {
            OnlyMessage.error(res.msg);
          }
        })
        .catch((error) => {
          OnlyMessage.error(error);
        });
    };
    const scroll = () => {
      const dom = document.getElementById("table_content_browsing");
      let scrollHeight = dom.scrollHeight;
      let scrollTop = dom.scrollTop;
      let clientHeight = dom.clientHeight;
      if (scrollHeight - clientHeight == scrollTop) {
        if (!dataComplete) {
          getData(currentPageIndex);
        }
      }
    };
    const getData = (pageIndex) => {
      if (!dataComplete) {
        broewsing(pageIndex);
      }
    };

    /** View Fil */
    const viewDetails = (item) => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) {
        return;
      }
      if (item.name) {
        let path = "";
        if (item.type == 0) {
          path = `/word/${item.groupId}/${item.type}/${item.articleId}`;
        } else if (item.type == 2) {
          path = `/excel/${item.groupId}/${item.type}/${item.articleId}`;
        }
        routers.push({
          path,
        });
      } else {
        OnlyMessage.error("This file has been deleted");
        return;
      }
    };
    return {
      viewDetails,
      tableData,
      scroll,
    };
  },
});
</script>
<style scoped lang="scss">
@import "../../assets/style/module/module.scss";
</style>
