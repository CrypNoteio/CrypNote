<!-- author: gy -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description:  -->
<template>
  <div class="versionHistory">
    <div class="common" style="background: #fafafa; z-index: 2">
      <div class="headerLeft row mouseHand" @click="back()">
        <img class="leftArrow" src="../../assets/img/leftArrow.png" alt="" />
        <div class="title">Version history</div>
      </div>
      <div class="row marginAuto">
        <div class="btnRight mouseHand" @click="upWord()">
          Restore this record
        </div>
      </div>
    </div>
    <div class="row spaceB" style="z-index: 1">
      <div>
        <HistoryBench
          @showTextClick="showTextClick($event)"
          @title="titleContent($event)"
          class=""
        ></HistoryBench>
      </div>
      <div v-html="showArticle" class="article"></div>
      <div style="width: 100%; display: flex; padding: 0 60px; display: none">
        <div style="margin: 0 auto; min-width: 800px; width: 100%">
          <div
            ref="editorN"
            style="
              width: 100%;
              min-height: 800px;
              z-index: -1;
              margin-top: 40px;
            "
          ></div>
          <div id="wordContent" style="display: none"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, onMounted } from "vue";
import { postData } from "@/actions";
import HistoryBench from "@/components/HistoryBench/HistoryBench";
import { updatearticle } from "@/actions/api";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import i18next from "i18next";
import E from "wangeditor";
import { ElLoading } from "element-plus";
import OnlyMessage from "@/assets/js/onlyMsgbox";
// import Utils from "@/utils/utils.js";
import { getCookie } from "@/assets/js/Common";
export default defineComponent({
  name: "VersionHistory",
  components: {
    HistoryBench,
  },
  setup(props, ctx) {
    const store = useStore();
    const route = useRoute();
    const routers = useRouter();
    const apptoken = getCookie("apptoken");
    const editorN = ref(null);
    let loading = "";
    let editor;
    onMounted(() => {
      loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      editor = new E(editorN.value);
      editor.config.lang = "en";
      editor.config.uploadImgShowBase64 = true;
      editor.i18next = i18next;
      editor.create();
    });
    const Editor = () => {
      editor = editor;
      editor.config.lang = "en";
      editor.config.uploadImgShowBase64 = true;
      editor.i18next = i18next;
      editor.create();
    };
    let title = ref("");
    const titleContent = (titleText) => {
      title.value = titleText.content;
    };

    const showArticle = ref([]);
    const showTextClick = (data) => {
      loading.close();
      let d = decodeURI(data);
      d = JSON.parse(d);
      editor.txt.setJSON(d);
      showArticle.value = editor.txt.html();
      editor.destroy();
    };
    const upWord = async () => {
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
          id: route.params.articleId,
          flag: 3,
        });
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
    const back = () => {
      routers.go(-1);
    };
    return {
      onMounted,
      editorN,
      editor,
      showTextClick,
      back,
      upWord,
      titleContent,
      title,
      showArticle,
      Editor,
    };
  },
});
</script>
<style>
.versionHistory .w-e-toolbar * {
  box-sizing: content-box !important;
}
.versionHistory .w-e-menu-panel * {
  box-sizing: content-box !important;
  background: #fafafa !important;
}
.versionHistory .w-e-text-container * {
  box-sizing: content-box !important;
  width: 100%;
}
.versionHistory .w-e-toolbar {
  padding: 0 !important;
  background-color: #fafafa !important  ;
}
.versionHistory .w-e-text-container {
  z-index: 1 !important;
  background: #fafafa !important;
}

.w-e-toolbar {
  z-index: 2 !important;
}
.w-e-toolbar {
  border: none !important;
  border-bottom: none !important;
}
.w-e-text-container {
  border: none !important;
}
.versionHistory .el-select .el-input__inner {
  background-color: #eeeeef !important ;
  border: 1px solid #cec9c9 !important;
  color: #7d7d7d !important;
  padding: 0 10px !important;
}
.versionHistory /deep/ .el-input__inner::-webkit-input-placeholder {
  color: #fff !important;
}
.versionHistory /deep/ .el-input__inner::-moz-input-placeholder {
  color: #fff !important;
}
.versionHistory deep/ .el-input__inner::-ms-input-placeholder {
  color: #fff !important;
}
.versionHistory .w-e-text {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  padding: 0;
  white-space: normal;
  word-break: break-all;
  overflow-x: hidden !important;
}
.versionHistory .w-e-text::-webkit-scrollbar {
  width: 0 !important;
}
.versionHistory .w-e-toolbar {
  z-index: 2 !important;
}
.versionHistory .w-e-toolbar {
  border: none !important;
  border-bottom: none !important;
}
.versionHistory .w-e-text-container {
  border: none !important;
  margin-left: 10px;
}
.article {
  white-space: normal;
  word-break: break-all;
  width: 77%;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  /* overflow: hidden; */
  display: flex;
  padding: 0 60px;
  height: calc(100% - 60px);
  overflow-y: auto;
  margin-top: 40px;
}
.common {
  box-shadow: 0px 3px 5px 0px rgb(0 0 0 / 12%);
}
</style>
<style scoped lang="scss">
@import "../../assets/style/VersionHistory/VersionHistory.scss";
</style>
