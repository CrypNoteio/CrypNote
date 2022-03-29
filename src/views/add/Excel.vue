<!-- author: nico -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: excel -->
<template>
  <div class="excel">
    <div class="commonTitle">
      <div class="nav-left">
        <img class="beat" src="../../assets/img/lable.png" @click="goBack" />
        <div class="nav-center">
          <p>
            <el-input
              type="text"
              placeholder="Untitled Excel"
              v-model="excelTitle"
              style="font-size: 16px; width: 350px"
            />
          </p>
          <p>
            <span><i class="fa fa-user-o"></i>{{ userName }}</span>
            <span>
              <i class="fa fa-clock-o"></i>Last modified at
              {{ updataTime }}</span
            >
          </p>
        </div>
        <div class="webLinks" style="margin-top: 40px">
          <div class="ar" v-if="arLink">
            <img src="../../assets/img/home/homeBottom1.png" />
            <span
              >ARWEAVE TX:<a :href="arLink" target="_blank">{{
                arLink
              }}</a></span
            >
          </div>
          <!-- <div class="ar" v-if="fileLink">
            <img src="../../assets/img/home/homeBottom2.png" />
            <span
              >FILCOIN TX:<a :href="fileLink" target="_blank">{{
                fileLink
              }}</a></span
            >
          </div> -->
        </div>
      </div>

      <div class="nav-right">
        <el-button
          plain
          size="small"
          :loading="load"
          @click="UpdateExcel('save')"
          >Update</el-button
        >
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <img src="../../assets/img/menu.png" style="height: 25px" alt="" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="historyClick()"
                >Version history</el-dropdown-item
              >
              <el-dropdown-item @click="ExportClick()">Export</el-dropdown-item>
              <el-dropdown-item>
                <label class="fileContainer"
                  >Import<input
                    type="file"
                    @change="ImportClick($event)" /></label
              ></el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div id="luckysheet" style="top: 80px"></div>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import { postData } from "@/actions";
import { saveArticle, getarticle, updatearticle } from "@/actions/api";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { getCurrentTime, getTime } from "@/assets/js/Common.js";
import { exportExcel } from "@/assets/js/Export.js";
import { ElMessage } from "element-plus";
import LuckyExcel from "luckyexcel";
import { getCookie } from "@/assets/js/Common";
export default defineComponent({
  setup() {
    const routers = useRouter();
    const route = useRoute();
    const store = useStore();

    const apptoken = getCookie("apptoken");
    const userName = ref(store.state.userInfo.userName);

    const load = ref(false);
    const excelTitle = ref("Untitled Excel");

    let updataTime = ref("");
    let isSave = true;
    let webLink = reactive({
      arLink: "",
      fileLink: "",
    });
    onMounted(() => {
      updataTime.value = getCurrentTime();
      //$(function () {
      var options = {
        container: "luckysheet",
        title: "luckysheet",
        lang: "en",
        plugins: [],
        allowEdit: true,
        allowUpdate: true,
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
          protection: false,
          image: false,
        },

        enableAddRow: true,
        enableAddBackTop: true,
        showsheetbarConfig: {
          add: true,
          menu: true,
        },
      };
      //add or edit
      const fileId = route.params.id;
      if (fileId) {
        const postParmas = {
          id: fileId,
          apptoken,
        };
        postData(getarticle, postParmas)
          .then((res) => {
            if (res.success) {
              const excelData = JSON.parse(decodeURI(res.data.content));
              excelTitle.value = decodeURI(res.data.title);
              updataTime.value = getTime(res.data.createTime.time);
              webLink.arLink = res.data.transactionID;
              //webLink.fileLink = res.data.filaddress;
              //init table data
              options.data = excelData;
              luckysheet.create(options);
            } else {
              OnlyMessage.error(res.msg);
            }
          })
          .catch((error) => {
            console.log("error1", error);
            OnlyMessage.error(error);
          });
      } else {
        luckysheet.create(options);
      }
      //});
    });
    onUnmounted(() => {
      luckysheet.exitEditMode();
      ElMessage.closeAll();
    });

    //save
    const UpdateExcel = async (type) => {
      const fileId = route.params.id;
      try {
        const excelData = luckysheet.getAllSheets();
        let postParmas = "";
        let api = "";
        if (fileId) {
          //edit
          postParmas = {
            title: encodeURI(excelTitle.value),
            content: encodeURI(JSON.stringify(excelData)),
            type: 2,
            groupId: route.params.groupId,
            apptoken: apptoken,
            id: route.params.id,
          };

          api = updatearticle;
        } else {
          //add
          postParmas = {
            title: encodeURI(excelTitle.value),
            content: encodeURI(JSON.stringify(excelData)),
            type: 2,
            groupId: route.params.groupId,
            apptoken: apptoken,
          };
          api = saveArticle;
        }
        const postResult = await postData(api, postParmas);
        if (postResult.success) {
          if (type == "save") {
            OnlyMessage.success("Content published successfully");
          }

          setTimeout(() => {
            routers.push("/dashboard");
          }, 1000);
        } else {
          OnlyMessage.error(postResult.msg);
        }
      } catch (errorMessage) {
        console.log(errorMessage);
        OnlyMessage.error(errorMessage);
      }
    };
    //history version
    const historyClick = () => {
      routers.push({
        path:
          "/versionHistoryExcel/" +
          route.params.id +
          "/" +
          route.params.groupId,
      });
    };
    //export
    const ExportClick = () => {
      var list = luckysheet.getAllSheets();

      exportExcel(list, excelTitle.value);
    };
    //Import
    const ImportClick = (evt) => {
      const files = evt.target.files;
      if (files == null || files.length == 0) {
        OnlyMessage.error("No files wait for import");
        return;
      }

      let name = files[0].name;
      let suffixArr = name.split("."),
        suffix = suffixArr[suffixArr.length - 1];
      excelTitle.value = suffixArr[0];
      if (suffix != "xlsx") {
        OnlyMessage.error("Currently only supports the import of xlsx files");
        return;
      }
      LuckyExcel.transformExcelToLucky(
        files[0],
        function (exportJson, luckysheetfile) {
          console.log("exportJson==", exportJson);
          if (exportJson.sheets == null || exportJson.sheets.length == 0) {
            OnlyMessage.error(
              "Failed to read the content of the excel file, currently does not support xls files!"
            );
            return;
          }
          window.luckysheet.destroy();

          window.luckysheet.create({
            container: "luckysheet",
            showinfobar: false,
            data: exportJson.sheets,
            title: exportJson.info.name,
            userInfo: exportJson.info.name.creator,
          });
        }
      );
    };
    const goBack = () => {
      UpdateExcel();
    };
    return {
      load,
      excelTitle,
      UpdateExcel,
      updataTime,
      userName,
      ...toRefs(webLink),
      historyClick,
      ExportClick,
      ImportClick,
      goBack,
    };
  },
});
</script>
<style scoped lang="scss">
@import "../../assets/style/Add/Excel.scss";
</style>
