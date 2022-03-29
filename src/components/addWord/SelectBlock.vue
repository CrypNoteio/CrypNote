<!-- author: zhanggg -->
<!-- date: 2022-01-05 19:53:39 -->
<!-- description: SelectBlock -->

<template>
  <el-dialog :before-close="closeDialog" v-model="dialogFormVisible_r">
    <div class="diaTitle">{{ fileType_r }}</div>
    <div class="subtitle">Select a recently participated Notebook</div>
    <div class="hr"></div>
    <div style="height: 400px; overflow-y: auto">
      <router-link
        v-for="(item, index) in libList"
        v-bind:key="index"
        :to="{
          path: `${getFileType(item.id)}`,
        }"
        class="router-link-active"
      >
        <div style="margin: 25px 0">
          <img
            src="../../assets/img/home/homeIcon8.png"
            alt=""
            style="width: 20px"
          /><span class="diaSpan">{{ decodeURI(item.name) }}</span>
        </div>
      </router-link>
    </div>
  </el-dialog>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  name: "SelectBlock",
  props: {
    dialogFormVisible: Boolean,
    fileType: {
      type: String,
      default: "",
    },
  },
  emits: ["closeDialog"],
  setup(props, ctx) {
    const store = useStore();
    let libList = ref([]);

    const dialogFormVisible_r = ref(props.dialogFormVisible);
    const fileType_r = ref(props.fileType);
    var result = store.state.blockList;
    libList.value = result;

    watch(
      () => store.state.blockList,
      (val) => {
        libList.value = val;
      }
    );

    watch(
      () => props.dialogFormVisible,
      (resource) => {
        dialogFormVisible_r.value = resource;
      }
    );
    watch(
      () => props.fileType,
      (resource) => {
        fileType_r.value = resource;
      }
    );
    const closeDialog = () => {
      ctx.emit("closeDialog");
    };

    const getFileType = (groupId) => {
      switch (props.fileType) {
        case "Word":
          return `/word/${groupId}`;
        case "Excel":
          return `/excel/${groupId}`;
        case "PPTX":
          return `/pptx/${groupId}`;
      }
    };
    return {
      libList,
      dialogFormVisible_r,
      fileType_r,
      closeDialog,
      getFileType,
    };
  },
});
</script>

<style scoped lang='scss'>
</style>