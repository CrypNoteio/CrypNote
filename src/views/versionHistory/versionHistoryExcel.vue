<!-- author: nico -->
<!-- date: 2022-02-17 15:39:07 -->
<!-- description: VersionHistoryExcel -->
<template>
  <div class="versionHistory">
    <div class="Menu">
      <div class="MenuLeft" @click="back()">
        <i class="fa fa-angle-left"></i>
        <div class="title">Version history</div>
      </div>
      <div class="btnRight" @click="upWord()">Restore this record</div>
    </div>
    <div class="MainContainer">
      <div class="VersionList" id="table" @scroll="scroll">
        <div
          class="version_item"
          v-for="(item, index) in historyList"
          :key="index"
          :class="[index == currentItem ? 'active_item' : '']"
          @click="chageVersion(item.araddress, index)"
        >
          <div class="version_title">
            {{ decodeURI(item.title) }}
          </div>
          <div class="version_info">
            <span>{{ item.userName }}</span>
            <span>{{ item.time }}</span>
          </div>
        </div>
      </div>
      <div class="VersionView">
        <div class="ExcelView" id="luckysheet"></div>
      </div>
      <div id="wordContent" style="display: none"></div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { postData } from "@/actions";
import { updatearticle, getDetail, getRecord, pageSize } from "@/actions/api";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { ElLoading } from "element-plus";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import { getTime, getCookie } from "@/assets/js/Common.js";
export default defineComponent({
  name: "versionHistoryExcel",
  setup() {
    const store = useStore();
    const route = useRoute();
    const routers = useRouter();
    const apptoken = getCookie("apptoken");
    let loading = "";

    const historyList = ref([]);
    let articleId = route.params.articleId;
    let currentPageIndex = 1;
    let dataComplete = false;
    let showText = "";
    let arInfo = ref("");
    let currentItem = ref(0);
    const getRecords = (pageIndex) => {
      postData(getRecord, { apptoken, pageSize, pageIndex, articleId })
        .then((getRecordRes) => {
          console.log("getRecordRes", getRecordRes);
          if (getRecordRes.success) {
            let d = getRecordRes.data.list;
            if (d.length > 0) {
              $("#wordContent").load(d[0].araddress, function () {
                showText = $("#wordContent").text();
                getDecodeDetail(showText);
              });
              for (var i = 0; i < d.length; i++) {
                d[i].time = getTime(d[i].createTime.time);
              }
              historyList.value = historyList.value.concat(d);
              if (getRecordRes.data.pageCount == getRecordRes.data.pageIndex) {
                dataComplete = true;
              } else {
                currentPageIndex = getRecordRes.data.pageIndex + 1;
              }
            }
          } else {
            console.log(getRecordRes.msg);
            OnlyMessage.error(getRecordRes.msg);
          }
        })
        .catch((errorMessage) => {
          console.log(errorMessage);
        });
    };
    const scroll = () => {
      const dom = document.getElementById("table");
      let scrollHeight = dom.scrollHeight;
      let scrollTop = dom.scrollTop;
      let clientHeight = dom.clientHeight;
      if (scrollHeight - clientHeight == scrollTop) {
        if (!dataComplete) {
          getRecords(currentPageIndex);
        }
      }
    };

    onMounted(() => {
      getRecords(1);
    });
    var options = {
      container: "luckysheet",
      title: "luckysheet",
      lang: "en",
      plugins: [],
      allowEdit: false,
      allowUpdate: false,
      defaultRowHeight: 25,
      defaultColWidth: 100,
      data: [
        {
          name: "sheet1",
          status: 1,
        },
      ],
      cellRightClickConfig: {
        chart: false,
        image: false,
      },
      showinfobar: false,
      showtoolbar: false,
      showtoolbarConfig: {
        undoRedo: true,
        paintFormat: true,
        currencyFormat: true,
        percentageFormat: true,
        numberDecrease: true,
        numberIncrease: true,
        moreFormats: true,
        font: true,
        fontSize: true,
        bold: true,
        italic: true,
        strikethrough: true,
        underline: true,
        textColor: true,
        fillColor: true,
        border: true,
        mergeCell: true,
        horizontalAlignMode: true,
        verticalAlignMode: true,
        textWrapMode: true,
        textRotateMode: true,
        function: true,
        frozenMode: false,
        sortAndFilter: true,
        conditionalFormat: true,
        dataVerification: false,
        splitColumn: true,
        screenshot: false,
        findAndReplace: true,
        protection: true,
      },

      enableAddRow: true,
      enableAddBackTop: true,
      showsheetbarConfig: {
        add: false,
        menu: true,
      },
    };
    const getDecodeDetail = (content) => {
      postData(getDetail, { apptoken, content })
        .then((DetailRes) => {
          if (DetailRes.success) {
            options.data = JSON.parse(decodeURI(DetailRes.msg));
            console.log(options.data);
            luckysheet.create(options);
          } else {
            OnlyMessage.error(DetailRes.msg);
          }
          console.log("DetailRes", DetailRes);
        })
        .catch((errorMessage) => {
          console.log(errorMessage);
        });
    };
    const chageVersion = (araddress, index) => {
      currentItem.value = index;
      $("#wordContent").load(araddress, function () {
        showText = $("#wordContent").text();
        getDecodeDetail(showText);
      });
    };

    const back = () => {
      routers.go(-1);
    };
    const upWord = async () => {
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      loading.close();
      try {
        let postParmas = {
          title: encodeURI(title.value),
          content: encodeURI(JSON.stringify(options.data)),
          flag: 3,
          groupId: route.params.groupId,
          apptoken: apptoken,
          id: route.params.articleId,
        };
        const updatedResource = await postData(updatearticle, postParmas);
        if (updatedResource.success) {
          OnlyMessage.success("Restore succes");
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        loading.close();

        OnlyMessage.error(errorMessage);
      }
    };
    return {
      back,
      upWord,

      scroll,
      historyList,
      currentItem,
      chageVersion,
    };
  },
});
</script>

<style scoped lang='scss'>
@import "../../assets/style/VersionHistory/VersionHistoryMain.scss";
</style>