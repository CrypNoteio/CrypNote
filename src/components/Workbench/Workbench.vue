<!-- author: nico -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: WorkBench -->
<template>
  <div class="Workbench-container-main">
    <div
      class="workbench-default-item"
      :class="{ 'active-item': currentIndex == 0 }"
      @click="workType(0)"
    >
      <img src="../../assets/img/cumpoter-icon.png" />
      <span class="color-ext">Workbench</span>
    </div>
    <div
      class="workbench-default-item"
      :class="{ 'active-item': currentIndex == 1 }"
      @click="workType(1)"
    >
      <img src="../../assets/img/heart-icon.png" />
      <span class="color-ext">Favorites</span>
    </div>
    <div
      class="workbench-default-item"
      :class="{ 'active-item': currentIndex == 2 }"
      @click="workType(2)"
    >
      <img src="../../assets/img/recently-icon.png" />
      <span class="color-ext">Recently</span>
    </div>
    <div class="Myblock_list block_cantainer">
      <div class="Myblock_title" @click="MyblockListHandler">
        <img :src="MyblockImg" />
        <span>My Notebooks</span>
      </div>
      <div class="Myblock_cantainer" v-if="MyblockListVisiable">
        <div
          class="Myblock_item"
          :class="{ Myblock_item_active: currentBlockIndex == index }"
          v-for="(block, index) in MyblockList"
          :key="index"
          @click="clickBlock(block, index)"
          @contextmenu.prevent.stop="contextmenu($event, block, index)"
        >
          <img src="../../assets/img/tree-right.png" />
          <img src="../../assets/img/Notes.png" />
          <span>{{ block.label }}</span>
        </div>
      </div>
    </div>
    <div class="Myblock_list Noteverse">
      <div class="Myblock_title" @click="NoteverseHandler">
        <img :src="NoteverseImg" />
        <span>Noteverse</span>
      </div>
      <div
        class="Myblock_cantainer Noteverse_cantainer"
        v-if="NoteverseVisiable"
      >
        <div class="Myblock_item" @click="workType(6)">
          <img src="../../assets/img/Cryptopedia.png" />
          <span>Cryptopedia</span>
        </div>
        <div
          class="Myblock_item"
          :class="{ 'active-item': currentIndex == 5 }"
          @click="workType(5)"
        >
          <img src="../../assets/img/Quills.png" />
          <span>Quills</span>
        </div>
      </div>
    </div>

    <div
      class="trush"
      :class="{ 'active-item': currentIndex == 3 }"
      @click="workType(3)"
    >
      <img src="../../assets/img/trush-icon.png" />
      <span>Trash</span>
    </div>
    <div
      class="contextmenu"
      :style="{ top: clientY + 'px' }"
      v-if="isVisiablecontextmenu"
    >
      <div class="Menu_item" @click="Delete">
        <img src="../../assets/img/Delete.png" />
        <span>Delete</span>
      </div>
      <!-- <div class="Menu_item">
        <img src="../../assets/img/Favourites.png" />
        <span>Add to Favourites</span>
      </div>
      <div class="Menu_item">
        <img src="../../assets/img/Duplicate.png" />
        <span>Duplicate</span>
      </div>
      <div class="Menu_item">
        <img src="../../assets/img/Copy_link.png" />
        <span>Copy link</span>
      </div> -->
      <div class="Menu_item" @click="Rename">
        <img src="../../assets/img/Rename.png" />
        <span>Rename</span>
      </div>
      <!-- <div class="Menu_item move_to">
        <img src="../../assets/img/Move_to.png" />
        <span>Move to</span>
      </div> -->
    </div>
  </div>
  <Rename
    :groupId="RenameGroupId"
    :RenameVisible="RenameVisible"
    @RefreshBlockList="refreshBlockList"
    @closeRenameDialog="RenameVisible = false"
  />
  <Delete
    :groupId="DeleteGroupId"
    :DeleteVisible="DeleteVisible"
    :BlockName="BlockName"
    @RefreshBlockList="refreshBlockList"
    @closeDeleteDialog="DeleteVisible = false"
  />
</template>
<script>
import { defineComponent, onMounted, ref, watch } from "vue";
import { postData } from "@/actions";
import { useStore } from "vuex";
import { getlibList } from "@/actions/api";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import { useRouter, useRoute } from "vue-router";
import Rename from "@/components/Workbench/Rename";
import Delete from "@/components/Workbench/Delete";
import { VerifyOperationPermissions, getCookie } from "@/assets/js/Common";

export default defineComponent({
  name: "Workbench",
  components: { Rename, Delete },
  setup() {
    const store = useStore();
    const routers = useRouter();
    const route = useRoute();

    let apptoken = getCookie("apptoken");
    const address = store.state.userInfo?.walletAddress;

    const currentIndex = ref(0);
    let MyblockListVisiable = ref(true);
    let NoteverseVisiable = ref(true);

    onMounted(() => {
      switch (route.path) {
        case "/dashboard/favorites":
          currentIndex.value = 1;
          break;
        case "/dashboard/recently":
          currentIndex.value = 2;
          break;
        case "/dashboard/trash":
          currentIndex.value = 3;
          break;
        case "/dashboard/quills":
          currentIndex.value = 5;
          break;
      }
    });

    /**
     * define and watch dropIcon
     */
    let MyblockImg = ref(
      MyblockListVisiable.value
        ? require("../../assets/img/tree-down.png")
        : require("../../assets/img/tree-right.png")
    );
    let NoteverseImg = ref(
      NoteverseVisiable.value
        ? require("../../assets/img/tree-down.png")
        : require("../../assets/img/tree-right.png")
    );
    watch(
      () => MyblockListVisiable.value,
      (val) => {
        MyblockImg.value = val
          ? require("../../assets/img/tree-down.png")
          : require("../../assets/img/tree-right.png");
      }
    );
    watch(
      () => NoteverseVisiable.value,
      (val) => {
        NoteverseImg.value = val
          ? require("../../assets/img/tree-down.png")
          : require("../../assets/img/tree-right.png");
      }
    );
    /**
     * change block ,filter article by groupId
     */

    let currentBlockIndex = ref(-1);
    let MyblockList = ref([]);
    const newArr = store.state.blockList.map((item) => ({
      label: decodeURI(item.name),
      id: item.id,
    }));
    MyblockList.value = newArr;
    const MyblockListHandler = () => {
      MyblockListVisiable.value = !MyblockListVisiable.value;
      currentBlockIndex.value = -1;
      currentIndex.value = 4;
      if (!MyblockListVisiable.value) {
        store.dispatch("set_filterGroupId", null);
      }
      routers.replace("/dashboard/workbench");
    };
    const NoteverseHandler = () => {
      NoteverseVisiable.value = !NoteverseVisiable.value;
      currentBlockIndex.value = -1;
      currentIndex.value = 4;
    };

    const clickBlock = (block, index) => {
      currentBlockIndex.value = index;
      isVisiablecontextmenu.value = false;
      currentIndex.value = -1;
      store.dispatch("set_filterGroupId", block.id);
      routers.replace("/dashboard/workbench");
    };

    /**
     * watch and refresh Block
     */
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
        }
      } catch (errorMessage) {
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
    /**
     * favorites & recently & trash
     */
    const workType = (type) => {
      currentBlockIndex.value = -1;
      currentIndex.value = type;

      switch (type) {
        case 0:
          routers.replace("/dashboard/workbench");
          break;
        case 1:
          routers.replace("/dashboard/favorites");
          break;
        case 2:
          routers.replace("/dashboard/recently");
          break;
        case 3:
          routers.replace("/dashboard/trash");
          break;
        case 5:
          //OnlyMessage.info("Coding...");
          routers.replace("/dashboard/quills");
          break;
        case 6:
          OnlyMessage.info("Coding...");
          break;
      }
    };

    /**
     * Delete Block
     */
    let clientY = ref(0);
    let isVisiablecontextmenu = ref(false);
    let RenameGroupId = ref("");
    let DeleteGroupId = ref("");
    let BlockName = ref("");
    const contextmenu = (event, block, index) => {
      currentBlockIndex.value = index;
      clientY.value = event.clientY - 90;
      isVisiablecontextmenu.value = true;
      RenameGroupId.value = block.id;
      DeleteGroupId.value = block.id;
      BlockName.value = block.label;
    };
    document.addEventListener("click", function (e) {
      if (e.target.className != "contextmenu") {
        isVisiablecontextmenu.value = false;
      }
    });
    /**
     * Rename Block
     */
    let RenameVisible = ref(false);
    const Rename = () => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) return;
      RenameVisible.value = true;
    };
    let DeleteVisible = ref(false);
    const Delete = () => {
      let wallerAddr = store.state.walletAddr;
      let V_O_P = VerifyOperationPermissions(address, wallerAddr);
      if (!V_O_P) return;
      DeleteVisible.value = true;
    };
    return {
      workType,
      currentIndex,

      refreshBlockList,
      contextmenu,
      clientY,
      RenameGroupId,
      DeleteGroupId,
      isVisiablecontextmenu,
      Rename,
      RenameVisible,
      DeleteVisible,
      Delete,
      MyblockListVisiable,
      NoteverseVisiable,
      MyblockListHandler,
      NoteverseHandler,
      MyblockImg,
      NoteverseImg,
      BlockName,
      MyblockList,
      clickBlock,
      currentBlockIndex,
    };
  },
});
</script>
<style lang="scss">
@import "../../assets/style/Workbench/Workbench.scss";
</style>