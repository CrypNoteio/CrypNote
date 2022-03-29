<!-- author: nico -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: favorite -->
<template>
  <div class="contentBok">
    <div class="moduleTitle">My Favorites</div>
    <div class="table" @scroll="scroll" id="table_content_collection">
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
          <td>{{ decodeURI(item.title) }}</td>

          <td v-if="item.flag == 0">
            {{ item.userName }}
          </td>
          <td v-else>{{ item.userName }} / {{ decodeURI(item.name) }}</td>
          <td>
            {{ item.createTime }}
          </td>
          <td>
            <span @click.stop="cancelCollection(item.collectId)"
              >Cancel the collection</span
            >
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
import { collectlist, delcollect, pageSize } from "@/actions/api";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import { useRouter } from "vue-router";
import {
  getTime,
  VerifyOperationPermissions,
  getCookie,
} from "@/assets/js/Common";
export default defineComponent({
  setup() {
    const routers = useRouter();
    let store = useStore();
    let tableData = ref([]);
    const apptoken = getCookie("apptoken");
    const address = store.state.userInfo?.walletAddress;
    onMounted(() => {
      getCollectionList(1);
    });
    /** Favorite List */
    let currentPageIndex = 1;
    let dataComplete = false;
    const getCollectionList = (pageIndex) => {
      postData(collectlist, { apptoken, pageSize, pageIndex })
        .then((res) => {
          //console.log("collectlist", res);
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
          console.log(error);
          OnlyMessage.error(error);
        });
    };
    const scroll = () => {
      const dom = document.getElementById("table_content_collection");
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
        getCollectionList(pageIndex);
      }
    };
    /** Cancel Favorite */
    const cancelCollection = async (collectId) => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) {
        return;
      }

      try {
        const cancelResource = await postData(delcollect, {
          apptoken,
          id: collectId,
        });
        if (cancelResource.success) {
          OnlyMessage.success("Removed from favorites");
          const index = tableData.value.findIndex(
            (resource) => resource.collectId === collectId
          );
          tableData.value.splice(index, 1);
        } else {
          OnlyMessage.error(cancelResource.msg);
        }
      } catch (errorMessage) {
        OnlyMessage.error(errorMessage);
      }
    };
    /** View Fil */
    const viewDetails = (item) => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) {
        return;
      }
      let path = "";
      if (item.type == 0) {
        path = `/word/${item.groupId}/${item.type}/${item.articleId}`;
      } else if (item.type == 2) {
        path = `/excel/${item.groupId}/${item.type}/${item.articleId}`;
      } else if (item.flag == 0) {
        path = `/quill/${item.shorthash}`;
      }
      routers.push({
        path,
      });
    };
    return {
      tableData,
      cancelCollection,
      viewDetails,
      scroll,
    };
  },
});
</script>
<style scoped lang="scss">
@import "../../assets/style/module/module.scss";
</style>
