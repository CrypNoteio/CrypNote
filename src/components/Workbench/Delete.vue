<!-- author: nico -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: Delete -->
<template>
  <el-dialog
    v-model="DeleteVisible"
    title="Delete Notebook"
    width="40%"
    @close="closeDeleteDialog"
  >
    <div class="DeleteWaring">
      Deleting the knowledge base {{ BlockName }}. This operation is
      irreversible. Once the operation is successful, all contents under the
      knowledge base will be deleted. Please enter the following content to
      confirm the operation again.
    </div>
    <el-form>
      <el-form-item label="E-mail address" :label-width="formLabelWidth">
        <el-input
          v-model="email"
          autocomplete="off"
          readonly
          style="border: none"
        ></el-input>
      </el-form-item>
      <el-form-item label="Verification Code" :label-width="formLabelWidth2">
        <el-input
          v-model="vcode"
          autocomplete="off"
          style="width: 120px"
        ></el-input>
        <el-button
          :disabled="isGetVcode"
          @click="getVcode()"
          style="padding: 12px 25px"
          >{{ vcodeText }}</el-button
        >
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="DeleteVisible = false">Cancel</el-button>
        <el-button type="primary" @click="DeleteHandler">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, ref, toRefs, reactive, watch } from "vue";
import { ElMessage, ElLoading } from "element-plus";
import { useStore } from "vuex";
import { postData } from "@/actions";
import { dellib, getemialvcode } from "@/actions/api";
import { getCookie } from "@/assets/js/Common";
import OnlyMessage from "@/assets/js/onlyMsgbox";
export default defineComponent({
  name: "Rename",
  props: {
    groupId: Number,
    DeleteVisible: Boolean,
    BlockName: String,
  },
  emits: ["RefreshBlockList"],
  setup(props, ctx) {
    const store = useStore();
    const apptoken = getCookie("apptoken");
    let isGetVcode = ref(false);
    let vcodeText = ref("Access authentication code");
    let DeleteVisible = ref(props.DeleteVisible);
    let BlockName = ref(props.BlockName);
    let groupId = ref(props.groupId);
    const formLabelWidth = "130px";
    const formLabelWidth2 = "130px";
    watch(
      () => props.DeleteVisible,
      (resource) => {
        DeleteVisible.value = resource;
      }
    );
    watch(
      () => props.groupId,
      (resource) => {
        groupId.value = resource;
      }
    );
    watch(
      () => props.BlockName,
      (resource) => {
        BlockName.value = resource;
      }
    );
    const form = reactive({
      vcode: "",
      email: store.state.userInfo?.Email,
    });
    const getVcode = () => {
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      postData(getemialvcode, {
        Email: form.email,
        type: 4,
        name: encodeURI(BlockName.value),
      })
        .then((res) => {
          loading.close();
          OnlyMessage.success(
            "The verification code has been sent successfully"
          );
          Countdown();
        })
        .catch((error) => {
          loading.close();
          OnlyMessage.error(error);
        });
    };
    let Seconds = 60;
    let timer = null;
    const Countdown = () => {
      timer = setInterval(() => {
        Seconds--;
        if (Seconds <= 0) {
          clearInterval(timer);
          isGetVcode.value = false;
          vcodeText.value = "Access authentication code";
        } else {
          isGetVcode.value = true;
          vcodeText.value = `Get it again after ${Seconds}s`;
        }
      }, 1000);
    };
    const DeleteHandler = () => {
      if (!form.vcode) {
        OnlyMessage.error("Verification code cannot be empty.");
        return;
      }
      postData(dellib, {
        apptoken,
        vcode: form.vcode,
        Email: form.email,
        groupId: groupId.value,
      })
        .then((DeleteResult) => {
          if (DeleteResult.success) {
            OnlyMessage.success("Delete successful.");
            form.vcode = "";
            DeleteVisible.value = false;
            ctx.emit("RefreshBlockList");
          } else {
            OnlyMessage.error(DeleteResult.msg);
          }
        })
        .catch((DeleteError) => {
          console.log(DeleteError);
          OnlyMessage.error("Delete failed.");
        });
    };
    const closeDeleteDialog = () => {
      DeleteVisible.value = false;
      ctx.emit("closeDeleteDialog");
    };
    return {
      DeleteVisible,
      ...toRefs(form),
      formLabelWidth,
      formLabelWidth2,
      DeleteHandler,
      BlockName,
      isGetVcode,
      getVcode,
      vcodeText,
      closeDeleteDialog,
    };
  },
});
</script>

<style scoped lang='scss'>
@import "../../assets/style/Workbench/Rename.scss";
</style>