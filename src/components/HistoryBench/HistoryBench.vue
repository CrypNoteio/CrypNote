<template>
  <div
    class="Workbench-container"
    @scroll="scroll"
    id="table_content_collection"
  >
    <div class="all">
      <div v-for="(item, index) in historyList" :key="index">
        <div
          class="row spaceB p10 margin10"
          @click="listCLick(index, item.araddress, item.title)"
          :class="active == index ? 'historyListActive' : 'historyListItem'"
        >
          <div class="text">
            <p class="title ellipsis mouseHand" :title="item.title">
              {{ item.title }}
            </p>
            <p class="time">{{ item.time }}</p>
            <p class="name">{{ item.userName }}</p>
          </div>
          <div class="btnPublished" v-if="index == 0">Latest</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import { getTime } from "@/assets/js/Common.js";
import { postData } from "@/actions";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { getDetail, getRecord, pageSize } from "@/actions/api";
import { ElLoading } from "element-plus";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import { getCookie } from "@/assets/js/Common";
export default defineComponent({
  name: "Workbench",
  components: {},
  setup(props, ctx) {
    const store = useStore();
    const apptoken = getCookie("apptoken");
    const route = useRoute();
    const isTrue = ref(true);
    const checked = ref(false);
    const histroy = [{}];
    const isTrueClick = (tool) => {
      isTrue.value = tool;
    };
    const historyList = ref([]);
    onMounted(() => {
      showWordList(1);
    });
    let showText = ref("");
    let currentPageIndex = 1;
    let dataComplete = false;
    const showWordList = async (pageIndex) => {
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      try {
        const updatedResource = await postData(getRecord, {
          apptoken: apptoken,
          articleId: route.params.articleId,
          pageSize: pageSize,
          pageIndex: pageIndex,
        });
        loading.close();
        if (updatedResource.success) {
          let arr = updatedResource.data.list;
          if (updatedResource.data.list.length > 0) {
            arr = updatedResource.data.list;
            for (var i = 0; i < arr.length; i++) {
              arr[i].time = getTime(arr[i].createTime.time);
              if (arr[i].title != "null") {
                arr[i].title = decodeURI(arr[i].title);
              }
            }

            historyList.value = historyList.value.concat(arr);
            if (pageIndex == 1) {
              $("#wordContent").load(
                updatedResource.data.list[0].araddress,
                function () {
                  showText.value = $("#wordContent").text();
                  var titleT = {
                    content: updatedResource.data.list[0].title,
                  };
                  ctx.emit("title", titleT);
                  upGetDetail(showText.value);
                }
              );
            }

            if (
              updatedResource.data.pageCount == updatedResource.data.pageIndex
            ) {
              dataComplete = true;
            } else {
              currentPageIndex = updatedResource.data.pageIndex + 1;
            }
          } else {
            OnlyMessage.error(updatedResource.msg);
          }
        }
      } catch (errorMessage) {
        loading.close();
        OnlyMessage.error(errorMessage);
      }
    };
    const active = ref(0);
    const listCLick = (index, address, title) => {
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      $("#wordContent").load(address, function () {
        showText.value = $("#wordContent").text();
        var titleT = {
          content: title,
        };
        ctx.emit("title", titleT);
        active.value = index;
        upGetDetail(showText.value);
        loading.close();
      });
    };
    const upGetDetail = async (content) => {
      try {
        const updatedResource = await postData(getDetail, {
          apptoken: apptoken,
          content: content,
        });
        if (updatedResource.success) {
          ctx.emit("showTextClick", updatedResource.msg);
        }
      } catch (errorMessage) {
        console.log("errror", errorMessage);
      }
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
        showWordList(pageIndex);
      }
    };

    return {
      isTrue,
      checked,
      histroy,
      historyList,
      showText,
      showWordList,
      isTrueClick,
      listCLick,
      active,
      upGetDetail,
      scroll,
    };
  },
});
</script>


<style lang="scss">
.label {
  display: flex;
  justify-content: space-around;
}
.spaceB {
  display: flex;
  justify-content: space-between;
}
.p10 {
  margin: 10px 0;
}
.margin10 {
  margin: 10px 0;
}
.row {
  display: flex;
  flex-direction: row;
}
.active {
  border-bottom: 4px solid #333333;
  padding-bottom: 10px;
}
.all {
  width: 100%;
  margin: 0 auto;
}
.all {
  height: 100%;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-x: hidden;
  overflow-y: auto;
}
.all::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.btnPublished {
  background: #000000;
  height: 24px;
  font-size: 12px;
  font-family: AvenirNext-Medium, AvenirNext;
  font-weight: 500;
  color: #ffffff;
  border-radius: 4px;
  padding: 0 10px;
  line-height: 24px;
  margin: auto 0;
}
.text {
  font-size: 16px;
  color: #000000;
}
.Workbench-container {
  width: 300px;
  height: calc(100% - 60px);
  overflow-y: auto;
  background: #ffffff;
  box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  padding: 30px 0;
  .title {
    font-family: AvenirNext-DemiBold, AvenirNext;
    font-size: 16px;
    margin-bottom: 8px;
    font-weight: 600;
    width: 160px;
  }
  .time {
    font-size: 12px;
    color: #999999;
  }
  .name {
    font-size: 12px;
    color: #999999;
  }
}
.workbench-itemH {
  width: calc(100% - 10px);
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 20px;
  margin-bottom: 21px;
  font-size: 16px;
  font-family: AvenirNext-DemiBold;
  font-weight: 600;
  color: #333333;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border-color: black !important;
  background-color: black !important;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: black !important;
}
.el-checkbox__inner:hover {
  border-color: black !important;
}
.el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: black !important;
}
.historyListActive {
  background: #eeeeef;
  padding: 20px 50px;
}
.historyListItem {
  padding: 20px 50px;
}
</style>