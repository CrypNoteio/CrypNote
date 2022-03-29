<!-- author: fo -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: error page -->
<template>
  <Nav />
  <div class="main">
    <img src="../../assets/img/404.png" class="errorImg" alt="" />
    <img src="../../assets/img/Earth.png" class="bottomImg" alt="" />
  </div>
</template>

<script>
import Nav from "@/components/Nav/Nav";

export default {
  name: "Error404",
  components: {
    Nav,
  },
  setup() {
    return {};
  },
};
</script>

<style scoped>
.main {
  background: #fafafa;
  height: calc(100%);
  width: 100%;
  text-align: center;
  overflow: hidden;
}
.errorImg {
  width: 941px;
  margin: 0 auto;
  margin-top: 120px;
  display: block;
}
.bottomImg {
  margin-top: 20px;
  width: 883px;
}
</style>