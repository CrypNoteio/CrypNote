<!-- author: gy -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: ppt -->
<template>
  <div style="width: 100%">
    <div class="commonTitle">
      <div class="nav-left" style="font-size: 14px">
        <router-link to="/dashboard" class="router-link-active">
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
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- <div style="width: 100%; margin: 0 auto;">
      <div style="margin: 0 auto; width: 100%">
           <iframe src="https://notice.crypnote.io/ppt/" style="width:100%;height:800px" frameborder="0"></iframe>
      </div>
    </div> -->
  </div>
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "World",
  setup() {
    return {};
  },
});
</script>
<style>
.w-e-text-container {
  z-index: 1 !important;
}

.w-e-menu {
  z-index: 2 !important;
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
  height: 600px !important;
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
  font-family: AvenirNext-Medium;
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