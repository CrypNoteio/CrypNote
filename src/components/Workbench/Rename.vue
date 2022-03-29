<!-- author: nico -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: Rename -->
<template>
  <el-dialog
    v-model="RenameVisible"
    title="Rename Notebook"
    width="35%"
    @close="closeRenameDialog"
  >
    <el-form>
      <el-form-item label="New name" :label-width="formLabelWidth">
        <el-input v-model="name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="RenameVisible = false">Cancel</el-button>
        <el-button type="primary" @click="RenameHandler">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, ref, toRefs, reactive, watch } from "vue";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import { useStore } from "vuex";
import { postData } from "@/actions";
import { renamelib } from "@/actions/api";
import { getCookie } from "@/assets/js/Common";
export default defineComponent({
  name: "Rename",
  props: {
    groupId: Number,
    RenameVisible: Boolean,
  },
  emits: ["RefreshBlockList"],
  setup(props, ctx) {
    const store = useStore();
    const apptoken = getCookie("apptoken");
    const RenameVisible = ref(props.RenameVisible);
    const groupId = ref(props.groupId);
    const formLabelWidth = "100px";

    watch(
      () => props.RenameVisible,
      (resource) => {
        RenameVisible.value = resource;
      }
    );
    watch(
      () => props.groupId,
      (resource) => {
        groupId.value = resource;
      }
    );
    const form = reactive({
      name: "",
    });
    const RenameHandler = () => {
      if (!form.name) {
        OnlyMessage.error("Name cannot be empty.");
        return;
      }
      postData(renamelib, {
        apptoken,
        name: encodeURI(form.name),
        groupId: groupId.value,
      })
        .then((RenameResult) => {
          if (RenameResult.success) {
            OnlyMessage.success("Rename successful.");
            form.name = "";
            RenameVisible.value = false;
            ctx.emit("RefreshBlockList");
          } else {
            OnlyMessage.error(RenameResult.msg);
          }
        })
        .catch((RenameError) => {
          console.log(RenameError);
          OnlyMessage.error("Rename failed.");
        });
    };
    const closeRenameDialog = () => {
      RenameVisible.value = false;
      ctx.emit("closeRenameDialog");
    };
    return {
      RenameVisible,
      ...toRefs(form),
      formLabelWidth,
      RenameHandler,
      closeRenameDialog,
    };
  },
});
</script>

<style scoped lang='scss'>
@import "../../assets/style/Workbench/Rename.scss";
</style>