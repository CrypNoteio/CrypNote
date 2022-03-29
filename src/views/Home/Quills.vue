<!-- author: nico -->
<!-- date: 2022-03-12 13:31:28 -->
<!-- description: Quills -->
<template >
  <div class="domeleft">
    <div class="domeleft_center">
      <div class="leftTitle textNoclick" style="position: relative">
        <div style="padding: 10px 16px" class="inline-block">
          <div>{{ userName }} , welcome to Quills</div>
          <div class="leftContent" style="max-width: 62%">
            All the contents in CrypNote Quills are publicly accessible, the
            contents are permanently stored in AR, and all articles can be
            searched through the decentralized search protocol in the future.
            The number of token rewards is determined by the number of views and
            shares of the article. Start to publish your articles now;-)
          </div>
          <div
            class="leftTImg create_article mouseHand"
            @click="publishArticle"
          ></div>
        </div>
        <div class="leftTRImg article_bg inline-block"></div>
      </div>
      <div class="label">
        <div class="labL">
          <span
            v-for="(item, index) in filterLabel"
            v-bind:key="index"
            :class="[labelActive == index ? 'actived' : '']"
            >{{ item }}</span
          >
        </div>
      </div>
      <div
        style="max-height: 300px; margin-top: 40px; overflow-y: auto"
        class="table"
        @scroll="scroll"
        id="table_content"
      >
        <keep-alive>
          <table class="tableList" v-if="tableData.length > 0">
            <tr v-for="(item, index) in tableData" v-bind:key="index">
              <td @click="viewDetail(item.shorthash)">
                <img
                  src="../../assets/img/Group.png"
                  style="width: 28px; height: 28px; vertical-align: middle"
                />
              </td>
              <td @click="viewDetail(item.shorthash)" style="width: 52%">
                {{ decodeURI(item.title) }}
              </td>
              <td @click="viewDetail(item.shorthash)">
                {{ item.updateTime }}
              </td>
              <td style="width: 10%">
                <el-dropdown trigger="hover">
                  <span class="el-dropdown-link">
                    <img
                      style="width: 26px; vertical-align: middle"
                      src="../../assets/img/threeMenu.png"
                      alt=""
                    /><i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <template v-slot:dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click.stop="viewDetail(item.shorthash)"
                        ><i class="fa fa-edit"></i>Edit</el-dropdown-item
                      >
                      <el-dropdown-item
                        v-if="item.collectId"
                        @click.stop="cancelCollection(item.collectId)"
                      >
                        <i class="fa fa-heart"></i>Cancel the collection
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-else
                        @click.stop="collection(item.id)"
                      >
                        <i class="fa fa-heart-o"></i>Collection
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click.stop="deleteFile(item.groupId, item.id)"
                        ><i class="fa fa-trash-o"></i>Remove
                        record</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </td>
            </tr>
          </table>
          <el-empty
            v-else
            description="No data available for the time being"
          ></el-empty>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import { postData } from "@/actions";
import { VerifyOperationPermissions, getCookie } from "@/assets/js/Common";
import { useRouter } from "vue-router";
import {
  collect,
  delcollect,
  pageSize,
  delwiki,
  wikiList,
} from "@/actions/api";
import OnlyMessage from "@/assets/js/onlyMsgbox";
export default defineComponent({
  name: "Home",
  setup() {
    let store = useStore();
    const routers = useRouter();
    const userName = ref(store.state.userInfo?.userName);
    const apptoken = getCookie("apptoken");
    const address = store.state.userInfo?.walletAddress;

    const filterLabel = ref(["Articles"]);

    /** file list */
    const tableData = ref([]);
    let currentPageIndex = ref(1);
    let dataComplete = false;
    const artclel = async (pageIndex) => {
      try {
        const ArtcleList = await postData(wikiList, {
          apptoken,
          pageSize,
          pageIndex,
        });
        if (ArtcleList.success) {
          //console.log("ArtcleList", ArtcleList);
          if (ArtcleList.data.list.length > 0) {
            var arr = ArtcleList.data.list;
            if (pageIndex == 1) {
              tableData.value = [];
              tableData.value = arr;
            } else {
              tableData.value = tableData.value.concat(arr);
            }
            currentPageIndex.value = ArtcleList.data.pageIndex + 1;
          } else {
            if (pageIndex != 1) {
              dataComplete = true;
            } else {
              tableData.value = [];
            }
          }
        } else {
          OnlyMessage.error(ArtcleList.msg);
        }
      } catch (errorMessage) {
        OnlyMessage.error(errorMessage);
      }
    };

    const scroll = () => {
      const dom = document.getElementById("table_content");
      var scrollHeight = dom.scrollHeight;
      var scrollTop = dom.scrollTop;
      var clientHeight = dom.clientHeight;
      if (scrollHeight - clientHeight == scrollTop) {
        if (!dataComplete) {
          artclel(currentPageIndex.value);
        }
      }
    };

    /**delete file */
    const deleteFile = async (groupId, id) => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) {
        return;
      }
      try {
        const deleteResource = await postData(delwiki, {
          apptoken: apptoken,
          id: id,
        });
        if (deleteResource.success) {
          OnlyMessage.success("Deleted successfully");
          artclel(1);
        } else {
          OnlyMessage.error(deleteResource.msg);
        }
      } catch (errorMessage) {
        console.log(errorMessage);
        //OnlyMessage.error(errorMessage);
      }
    };

    //collection
    const collection = async (articleId) => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) {
        return;
      }

      try {
        const updatedResource = await postData(collect, {
          flag: 0,
          apptoken: apptoken,
          wikiId: articleId,
        });
        if (updatedResource.success) {
          OnlyMessage.success("Add to favourites successfully");
          artclel(1);
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        OnlyMessage.error(errorMessage);
      }
    };
    //cancel collection
    const cancelCollection = async (id) => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) {
        return;
      }
      try {
        const cancelResource = await postData(delcollect, {
          apptoken,
          id,
        });
        if (cancelResource.success) {
          OnlyMessage.success("Removed from favorites");
          artclel(1);
        } else {
          OnlyMessage.error(cancelResource.msg);
        }
      } catch (errorMessage) {
        console.log(errorMessage);
        //OnlyMessage.error(errorMessage);
      }
    };
    const viewDetail = (shorthash) => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) {
        return;
      }
      routers.replace(`/quill/${shorthash}`);
    };
    const publishArticle = () => {
      routers.replace("/quill");
    };
    onMounted(async () => {
      if (apptoken) {
        artclel(1);
      }
    });
    return {
      tableData,
      deleteFile,
      collection,
      cancelCollection,
      scroll,
      userName,
      viewDetail,
      filterLabel,
      publishArticle,
    };
  },
});
</script>
<style lang="scss" scoped>
body {
  background: #fafafa;
}
@import "../../assets/style/Home/Home.scss";
</style>




