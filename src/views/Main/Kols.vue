<!-- author: nico -->
<!-- date: 2022-03-26 15:19:21 -->
<!-- description: kols -->
<template>
  <div class="kols">
    <div class="kols_top"><img src="../../assets/img/100kols.png" /></div>
    <div class="kols_list">
      <div class="kols_title">Crypto KOLs</div>
      <div class="kols_list_container">
        <div>
          <img src="../../assets/img/kols-item.png" />
          <span>0xXi</span>
        </div>
        <div>
          <img src="../../assets/img/kols-item2.png" />
          <span>ttt</span>
        </div>
        <div>
          <img src="../../assets/img/kols-item3.png" />
          <span>sss</span>
        </div>
        <div>
          <img src="../../assets/img/kols-item4.png" />
          <span>Batman</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  name: "Kols",
  setup() {
    let store = useStore();
    store.dispatch("set_isDashboard", false);
    return {};
  },
});
</script>

<style scoped lang='scss'>
@import "../../assets/style/Main/Kols.scss";
</style>