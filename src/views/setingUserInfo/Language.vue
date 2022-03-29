<!-- author: nico -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: language -->
<template>
  <div class="Language">
    <div class="title">Language & Region</div>
    <span class="user-name">Language</span>
    <div class="set-lang">
      <span>the language used in the user interface.</span>
      <el-dropdown>
        <span class="el-dropdown-link">
          English
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <span class="update">Update</span>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
export default defineComponent({
  name: "Language",
  components: { ArrowDown },
  setup() {
    return {};
  },
});
</script>

<style scoped lang='scss'>
@import "../../assets/style/SetingUserInfo/Language.scss";
</style>