<!-- author: nico -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: WrokBench -->
<template >
  <div class="domeleft">
    <div class="domeleft_center">
      <div class="leftTitle textNoclick" style="position: relative">
        <div style="padding: 10px 16px" class="inline-block">
          <div>{{ userName }} , welcome to CrypNote</div>
          <div class="leftContent" style="max-width: 62%">
            CrypNote is a decentralized encrypted permanent storage note and
            collaboration platform. In CrypNote, the Notebook collects all your
            notes like a bookshelf and structures your notes to facilitate the
            creation and precipitation of knowledge.
          </div>
          <div class="leftTImg mouseHand" @click="createBlock"></div>
        </div>
        <div s class="leftTRImg inline-block"></div>
      </div>
      <div class="label" style="background: #fafafa">
        <div class="labL">
          <span
            v-for="(item, index) in filterLabel"
            v-bind:key="index"
            @click="filterLabelHandler(index)"
            :class="[labelActive == index ? 'actived' : '']"
            >{{ item }}</span
          >
        </div>
        <div>
          <el-select
            v-model="currentType"
            placeholder="Type"
            style="width: 106px"
            @change="handleChangeType"
            clearable
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="currentBlock"
            placeholder="Notebooks"
            style="width: 120px; text-align: right"
            @change="handleChangeBlock"
            clearable
          >
            <el-option
              v-for="item in MyblockList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-select
            placeholder="Creator"
            style="width: 106px"
            v-model="currentCreator"
            clearable
          >
            <el-option
              v-for="item in creatorList"
              :key="item.creator"
              :label="item.creatorlabel"
              :value="item.creator"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div
        style="max-height: 300px; margin-top: 40px; overflow-y: auto"
        class="table"
        @scroll="scroll"
        id="table_content"
      >
        <table class="tableList" v-if="tableData.length > 0">
          <tr v-for="(item, index) in tableData" v-bind:key="index">
            <td @click="viewDetail(item.type, item.id, item.groupId)">
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
            <td @click="viewDetail(item.type, item.id, item.groupId)">
              {{ decodeURI(item.title) }}
            </td>
            <td @click="viewDetail(item.type, item.id, item.groupId)">
              {{ item.userName }} / {{ decodeURI(item.name) }}
            </td>
            <td @click="viewDetail(item.type, item.id, item.groupId)">
              {{ item.updateTime }}
            </td>
            <td>
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
                    <el-dropdown-item
                      @click.stop="viewDetail(item.type, item.id, item.groupId)"
                      ><i class="fa fa-edit"></i>Edit</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="item.collectId"
                      @click.stop="
                        cancelCollection(item.groupId, item.collectId)
                      "
                    >
                      <i class="fa fa-heart"></i>Cancel the collection
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-else
                      @click.stop="collection(item.groupId, item.id)"
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
      </div>
    </div>
  </div>
  <el-dialog v-model="newBlockVisable" class="dislog">
    <div class="diaTitle">New Notebook</div>
    <div class="subtitle">Prefered icon and name</div>

    <div style="display: flex; justify-content: flex-start">
      <div class="inputIcon">
        <img src="../../assets/img/home/homeIcon8.png" alt="" />
      </div>
      <input
        class="dislogInput"
        type="text"
        v-model="name"
        placeholder="Get the new Notebook a cool name"
        style="width: 85%"
        maxlength="30"
      />
    </div>
    <div class="subtitle magT">Brief intro</div>

    <div>
      <textarea
        v-model="intro"
        cols="30"
        rows="10"
        placeholder="Say something about your Notebook..."
        show-word-limit
        type="textarea"
        class="dislogInput"
        style="width: 92%"
      ></textarea>
    </div>
    <div class="subtitle magT">Visible range</div>
    <el-select
      v-model="currentVisibleRange"
      class="dislogInput"
      placeholder="Select"
      style="width: 92%"
    >
      <el-option
        style="height: 80px; display: flex; justify-content: flex-start"
        v-for="item in visibleRange"
        :key="item.value"
        :label="item.value"
        :value="item.value"
      >
        <img
          v-if="item.type == 0"
          src="../../assets/img/home/homeIcon12.png"
          style="height: 32px; float: left"
        />
        <img
          v-else
          src="../../assets/img/home/homeIcon13.png"
          style="height: 32px; float: left"
        />
        <div>
          <p>{{ item.value }}</p>
          <p style="color: #757575">{{ item.value2 }}</p>
        </div>
      </el-option>
    </el-select>
    <el-button
      @click="newBlockSubmit()"
      style="margin-top: 24px"
      type="info"
      size="samll"
      >New Notebook</el-button
    >
  </el-dialog>
</template>

<script>
import { ref, defineComponent, reactive, toRefs, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { postData } from "@/actions";
import {
  getTime,
  VerifyOperationPermissions,
  getCookie,
} from "@/assets/js/Common";
import { useRouter } from "vue-router";
import {
  newcreatelib,
  artcleList,
  delarticle,
  collect,
  delcollect,
  pageSize,
  getlibList,
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

    /** create new block */
    let newBlockVisable = ref(false);
    const createBlock = () => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) {
        return;
      }

      newBlockVisable.value = true;
    };

    const visibleRange = [
      {
        type: 1,
        value: "Only me can see it",
        value2: "Visible to me and block members",
      },
    ];
    let currentVisibleRange = ref("Only me can see it");
    const newLib = reactive({
      name: "",
      type: 0,
      intro: "",
      apptoken: apptoken,
    });

    const newBlockSubmit = async () => {
      try {
        if (!newLib.name) {
          OnlyMessage.error("Space name cannot be empty!");
          return;
        }
        const newBlock = {};
        const updatedResource = await postData(newcreatelib, {
          apptoken: apptoken,
          name: encodeURI(newLib.name),
          intro: encodeURI(newLib.intro),
          type: newLib.type,
        });
        if (updatedResource.success) {
          OnlyMessage.success("Space created successfully");
          newBlockVisable.value = false;
          store.dispatch("set_refreshBlockList", !store.state.refreshBlockList);
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        console.log("error", errorMessage);
        OnlyMessage.error(errorMessage);
      }
    };
    //** filter blockList */
    let MyblockList = ref([]);
    const newArr = store.state.blockList.map((item) => ({
      label: decodeURI(item.name),
      id: item.id,
    }));
    MyblockList.value = newArr;
    const refreshBlockList = async () => {
      try {
        const blockResource = await postData(getlibList, {
          apptoken: apptoken,
          type: 0,
        });
        if (blockResource.success) {
          MyblockList.value = blockResource.data;
          store.dispatch("set_blockList", blockResource.data);
        } else {
          OnlyMessage.success(blockResource.msg);
          console.log(blockResource.msg);
        }
      } catch (errorMessage) {
        console.log(errorMessage);
        OnlyMessage.error(errorMessage);
      }
    };
    watch(
      () => store.state.blockList,
      (val) => {
        const newArr = val.map((item) => ({
          label: decodeURI(item.name),
          id: item.id,
        }));

        MyblockList.value = newArr;
      }
    );
    watch(
      () => store.state.refreshBlockList,
      (val) => {
        refreshBlockList();
      }
    );

    const typeList = reactive([
      {
        value: -1,
        label: "All",
      },
      {
        value: 0,
        label: "Document",
      },
      {
        value: 2,
        label: "Sheet",
      },
    ]);
    const ownerList = ref([]);
    let currentCreator = ref("");
    const creatorList = ref([
      {
        creator: 2,
        creatorlabel: "Mine",
      },
    ]);
    const filterLabel = ref(["Document"]);
    let labelActive = ref(0);
    const filterLabelHandler = (index) => {
      labelActive.value = index;
    };

    /** file list */
    const tableData = ref([]);
    let currentPageIndex = ref(1);
    let dataComplete = false;
    let currentGroupId = "";
    const artclel = async (groupId, pageIndex, type) => {
      try {
        const ArtcleList = await postData(artcleList, {
          apptoken,
          groupId,
          pageSize,
          pageIndex,
          type,
        });
        if (ArtcleList.success) {
          if (ArtcleList.data.list.length > 0) {
            //console.log("ArtcleList", ArtcleList);
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
          artclel(currentGroupId, currentPageIndex.value);
        }
      }
    };

    /** filter file */
    let filterFileType = "";
    let currentBlock = ref("");
    let currentType = ref("");
    const filterArticle = async (groupId) => {
      filterFileType = "";
      currentPageIndex.value = 1;
      tableData.value = [];
      currentCreator.value = [];
      currentType.value = [];
      currentBlock.value = [];
      dataComplete = false;
      artclel(groupId, 1);
    };
    watch(
      () => store.state.filterGroupId,
      (val) => {
        filterArticle(val);
      }
    );

    const handleChangeType = (e) => {
      artclel(currentGroupId, 1, e);
      filterFileType = e;
    };
    const handleChangeBlock = (value) => {
      artclel(value, 1, filterFileType);
    };
    /**delete file */
    const deleteFile = async (groupId, id) => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) {
        return;
      }
      try {
        const deleteResource = await postData(delarticle, {
          apptoken: apptoken,
          id: id,
        });
        if (deleteResource.success) {
          OnlyMessage.success("Deleted successfully");
          artclel(groupId, 1);
        } else {
          OnlyMessage.error(deleteResource.msg);
        }
      } catch (errorMessage) {
        OnlyMessage.error(errorMessage);
      }
    };
    /** view detail file */
    const getFileType = (fileType, id, groupId) => {
      switch (fileType) {
        case 0:
          return `/word/${groupId}/${fileType}/${id}`;
        case 2:
          return `/excel/${groupId}/${fileType}/${id}`;
      }
    };

    //collection
    const collection = async (groupId, articleId) => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) {
        return;
      }

      try {
        const updatedResource = await postData(collect, {
          apptoken: apptoken,
          articleId: articleId,
        });
        if (updatedResource.success) {
          OnlyMessage.success("Add to favourites successfully");
          artclel(groupId, 1);
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        OnlyMessage.error(errorMessage);
      }
    };
    //cancel collection
    const cancelCollection = async (groupId, id) => {
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
          artclel(groupId, 1, "");
        } else {
          OnlyMessage.error(cancelResource.msg);
        }
      } catch (errorMessage) {
        OnlyMessage.error(errorMessage);
      }
    };

    const viewDetail = (type, id, groupId) => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) {
        return;
      }
      routers.replace(getFileType(type, id, groupId));
    };

    onMounted(async () => {
      if (apptoken) {
        if (store.state.filterGroupId) {
          artclel(store.state.filterGroupId, 1);
        } else {
          artclel("", 1);
        }
      }
    });
    return {
      MyblockList,
      typeList,
      ownerList,
      creatorList,
      filterLabel,
      labelActive,
      filterLabelHandler,
      newBlockVisable,
      visibleRange,
      ...toRefs(newLib),
      newBlockSubmit,
      tableData,
      deleteFile,
      currentType,
      currentCreator,
      currentBlock,
      currentVisibleRange,
      collection,
      createBlock,
      cancelCollection,
      filterArticle,
      scroll,
      currentPageIndex,
      handleChangeBlock,
      handleChangeType,
      userName,
      viewDetail,
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




