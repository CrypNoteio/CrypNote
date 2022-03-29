<!-- author: nico -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: trsh -->
<template>
  <div class="contentBok">
    <div class="moduleTitle">Trash bin</div>
    <div class="table" @scroll="scroll" id="table_content_browsing">
      <table class="tableList" v-if="tableData.length > 0">
        <tr v-for="(item, index) in tableData" v-bind:key="index">
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
          <td style="width: 20%">{{ decodeURI(item.title) }}</td>
          <td style="width: 20%" v-if="item.flag == 1">
            {{ item.userName }} / {{ decodeURI(item.name) }}
          </td>
          <td style="width: 20%" v-if="item.flag == 0">
            {{ item.userName }}
          </td>
          <td style="width: 20%">{{ item.createTime }}</td>
          <td style="width: 20%" @click="RestoreHandler(item.id)">Restore</td>
          <td
            style="width: 20%; color: #a0cfff"
            @click="CompletelyHandler(item.id)"
          >
            Completely deleted
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
import { gettrash, pageSize, rollbackticle, realdel } from "@/actions/api";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import {
  getTime,
  VerifyOperationPermissions,
  getCookie,
} from "@/assets/js/Common";
export default defineComponent({
  setup() {
    const store = useStore();
    let tableData = ref([]);
    const apptoken = getCookie("apptoken");
    const address = store.state.userInfo?.walletAddress;
    onMounted(() => {
      broewsing(1);
    });
    let currentPageIndex = 1;
    let dataComplete = false;
    const broewsing = (pageIndex) => {
      postData(gettrash, { apptoken, pageSize, pageIndex })
        .then((res) => {
          //console.log("trush", res);
          if (res.success) {
            let arr = res.data.list;
            if (arr.length > 0) {
              for (var i = 0; i < arr.length; i++) {
                arr[i].time = getTime(arr[i].createTime.time);
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
    const RestoreHandler = (id) => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) {
        return;
      }
      postData(rollbackticle, { apptoken, id })
        .then((RestoreRes) => {
          if (RestoreRes.success) {
            OnlyMessage.success("Recovery succeeded.");
            const index = tableData.value.findIndex(
              (resource) => resource.id === id
            );
            tableData.value.splice(index, 1);
          } else {
            OnlyMessage.error(RestoreRes.msg);
          }
        })
        .catch((error) => {
          console.log(error);
          OnlyMessage.error("Made a mistake.");
        });
    };
    const CompletelyHandler = (id) => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) {
        return;
      }
      postData(realdel, { apptoken, id })
        .then((RestoreRes) => {
          if (RestoreRes.success) {
            OnlyMessage.success("Delete succeeded.");
            const index = tableData.value.findIndex(
              (resource) => resource.id === id
            );
            tableData.value.splice(index, 1);
          } else {
            OnlyMessage.error(RestoreRes.msg);
          }
        })
        .catch((error) => {
          OnlyMessage.error("Made a mistake.");
        });
    };
    return {
      tableData,
      scroll,
      RestoreHandler,
      CompletelyHandler,
    };
  },
});
</script>
<style scoped lang="scss">
@import "../../assets/style/module/module.scss";
</style>
