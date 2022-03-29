<!-- author: gy -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: word -->
<template>
  <div style="width: 100%" class="word">
    <div class="commonTitle">
      <div class="nav-left" style="font-size: 14px">
        <router-link
          to="/dashboard/workbench/notebook"
          class="router-link-active"
          @click="getWord(1)"
        >
          <img
            class="beat"
            src="../../assets/img/lable.png"
            style="widht: 25px; height: 25px"
          />
        </router-link>
        <div class="nav-center nav-title">
          <p style="width: 100%">
            <el-input
              type="text"
              v-model="title"
              placeholder="Untitled Document"
            />
          </p>
          <p>
            <span><i class="fa fa-user-o"></i>{{ userName }}</span
            ><span
              ><i class="fa fa-clock-o"></i> Last modified at {{ timesShow }}
            </span>
          </p>
        </div>
        <div class="webLinks">
          <div class="ar" v-if="arLink" style="margin-top: 40px">
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
        <el-button plain size="small" :loading="load" @click="getWord()"
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
              <el-dropdown-item @click="exportWord()">Export</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div style="width: 100%; margin: 0 auto; margin-top: 40px">
      <!-- <Word /> -->
      <div style="margin: 0 auto; width: 72%">
        <div
          ref="editorN"
          class="report"
          style="width: 100%; z-index: -1"
        ></div>
      </div>
    </div>
    <div class="exportW" style="display: none"></div>
  </div>
</template>
<script>
import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  reactive,
  toRefs,
} from "vue";
import { postData } from "@/actions";
import { saveArticle, getarticle, updatearticle, imageUp } from "@/actions/api";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { getCurrentTime, getTime } from "@/assets/js/Common.js";
import E from "wangeditor";
import i18next from "i18next";
import { ElLoading } from "element-plus";
import saveAs from "file-saver";
import "@/assets/js/jquery.wordexport.js";
import { getCookie } from "@/assets/js/Common";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "World",
  setup() {
    const routers = useRouter();
    const route = useRoute();
    const store = useStore();
    const apptoken = getCookie("apptoken");
    const userName = ref(store.state.userInfo.userName);
    let title = ref("Untitled Document");
    let updataTime = ref("");
    let isEditor = null;
    const editorN = ref(null);
    let editor;
    let webLink = reactive({
      arLink: "",
      fileLink: "",
    });
    const articleId = ref(route.params.id);
    const groupId = ref(route.params.groupId);
    const creatDom = () => {
      // editor = new E(editorN.value);
      // editor.config.lang = "en";
      // editor.config.uploadImgShowBase64 = true;
      // // editor.config.uploadImgServer='https://crypnote.io/api/'
      // editor.i18next = i18next;
      // editor.create();
      // isEditor = localStorage.setItem(
      //   "isOpen" + route.params.id,
      //   route.params.id
      // );
    };
    onMounted(() => {
      document.body.scrollTop = 0;
      editor = new E(editorN.value);
      editor.config.lang = "en";
      editor.config.uploadImgShowBase64 = true;
      editor.i18next = i18next;
      editor.config.customUploadImg = function (files, insert) {
        filesToBase64(files);
      };

      editor.create();
    });
    const filesToBase64 = (files) => {
      files.map((item) => {
        var reader = new FileReader();
        reader.onload = function (e) {
          imageU(e.target.result);
        };
        reader.readAsDataURL(item);
      });
    };
    const baseurl = "https://www.crypnote.io";
    const imageU = async (result) => {
      try {
        const updatedResource = await postData(imageUp, {
          file: result,
          module: "word",
          name: route.params.id,
        });
        // console.log(updatedResource.data)
        if (updatedResource.success) {
          var img = baseurl + "/img/" + updatedResource.data.url;
          editor.cmd.do(
            "insertHtml",
            '<img src="' + img + '" style="max-width:100%;"/>'
          );
        }
      } catch {}
    };
    onUnmounted(() => {
      ElMessage.closeAll();
    });
    let content = ref([]);
    let changeType = ref("");
    let timesShow = ref("");
    const showWord = async () => {
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      try {
        const updatedResource = await postData(getarticle, {
          apptoken: apptoken,
          id: route.params.id,
        });
        loading.close();
        if (updatedResource.success) {
          timesShow.value = getTime(updatedResource.data.createTime.time);
          let showContent = updatedResource.data.content;
          showContent = JSON.parse(decodeURI(showContent));
          title.value = decodeURI(updatedResource.data.title);
          editor.txt.setJSON(showContent);
          webLink.arLink = updatedResource.data.transactionID;
          //webLink.fileLink = updatedResource.data.filaddress;
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        loading.close();
        console.log("errror", errorMessage);
        OnlyMessage.error(errorMessage);
      }
    };

    if (route.params.id) {
      showWord();
      changeType.value = true;
    } else {
      timesShow.value = getCurrentTime();
    }

    const getWord = (type) => {
      if (!title.value) {
        OnlyMessage.error("Article title cannot be empty！");
        return;
      }
      if (changeType.value) {
        upWord(type);
      } else {
        newWord(type);
      }
    };

    const newWord = async (type) => {
      if (type) {
        routers.replace("/dashboard");
        return;
      }
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      try {
        const updatedResource = await postData(saveArticle, {
          apptoken: apptoken,
          type: 0,
          title: encodeURI(title.value),
          content: encodeURI(JSON.stringify(editor.txt.getJSON())),
          groupId: route.params.groupId,
        });
        loading.close();
        if (updatedResource.success) {
          OnlyMessage.success("Content published successfully");
          setTimeout(() => {
            routers.replace("/dashboard");
          }, 1000);
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        loading.close();
        OnlyMessage.error(errorMessage);
      }
    };
    const upWord = async (type) => {
      // console.log(editor.txt.getJSON());
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      loading.close();
      try {
        const updatedResource = await postData(updatearticle, {
          apptoken: apptoken,
          groupId: route.params.groupId,
          title: encodeURI(title.value),
          content: encodeURI(JSON.stringify(editor.txt.getJSON())),
          id: route.params.id,
        });
        if (updatedResource.success) {
          if (type != 1) {
            OnlyMessage.success("Modified successfully");
          }
          setTimeout(() => {
            routers.replace("/dashboard");
          }, 2000);
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        loading.close();

        OnlyMessage.error(errorMessage);
      }
    };
    const historyClick = () => {
      routers.push({
        path: "/versionHistory/" + route.params.id + "/" + route.params.groupId,
      });
    };
    const exportWord = () => {
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
      $(".exportW").html(editor.txt.html());
      $(".exportW").wordExport(title.value);
    };
    return {
      userName,
      editor,
      upWord,
      newWord,
      getWord,
      showWord,
      content,
      title,
      timesShow,
      creatDom,
      editorN,
      ...toRefs(webLink),
      historyClick,
      exportWord,
      imageU,
    };
  },
});
</script>
<style >
.report .w-e-toolbar * {
  box-sizing: content-box !important;
}
.report .w-e-menu-panel * {
  box-sizing: content-box !important;
  background: #fafafa !important;
}
.report .w-e-text-container * {
  box-sizing: content-box !important;
}
.report .w-e-toolbar {
  padding: 0 !important;
  background-color: #fafafa !important  ;
}
.report .w-e-text-container {
  z-index: 1 !important;
  /*  padding: 0 20px !important;*/
  background: #fafafa !important;
}

.report .w-e-text {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  padding: 0;
}
.report .w-e-text::-webkit-scrollbar {
  width: 0 !important;
}
.report .w-e-toolbar {
  z-index: 2 !important;
}
.report .w-e-toolbar {
  border: none !important;
  border-bottom: none !important;
}
.report .w-e-text-container {
  border: none !important;
  margin-left: 10px;
}
</style>
<style scoped lang="scss">
@import "../../assets/style/Nav/Nav.scss";
.commonTitle /deep/.el-input__inner {
  color: #333 !important;
  font-weight: 600;
  font-size: 16px;
}
.commonTitle /deep/.nav-right span {
  font-weight: 400;
}
/deep/.w-e-text-container {
  height: 800px !important;
  min-height: 800px;
}
.nav-title {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  color: #999;
  margin-left: 20px;
}
.commonTitle {
  display: flex;
  justify-content: space-between;
  width: calc(100% - 110px);
  padding: 10px 55px;
  border-bottom: 1px solid #f5f5f5;
  background: #fff;
  font-family: avenir-next-regular;
  font-size: 15px;
}
.header {
  display: flex;
  justify-content: space-between;
  text-align: start;
  width: calc(100% - 80px);
  height: 60px;
  line-height: 60px;
  padding: 0 40px;
}
.icon {
  width: 24px;
  height: 24px;
}
.fa-clock-o,
.fa-user-o {
  margin: 0 5px 0 20px;
  color: #8cc5ff;
  font-size: 14px;
}
.fa-user-o {
  margin-left: 0;
}
.webLinks {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
}
.ar {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 0 10px;
}
.ar img {
  width: 20px;
  height: 20px;
}
.ar span {
  font-family: AvenirNextMedium;
  margin-left: 10px;
  font-size: 13px;
}
.ar span a {
  margin-left: 10px;
  color: #409eff;
}
.router-link-active {
  margin-top: 8px;
}
</style>