<!-- author: fo -->
<!-- date: 2022-02-17 15:39:07 -->
<!-- description: Profile -->
<template>
  <div class="main">
    <div class="boardimg">
      <span>
        <img src="../../assets/img/nftwriter.png" alt="" />
        <div>NFT Writer</div>
      </span>
      <span>
        <img src="../../assets/img/dasuser.png" alt="" />
        <div>DAS User</div>
      </span>
    </div>
    <div class="linkimg">
      <img src="../../assets/img/twitter.png" alt="" />
      <img src="../../assets/img/1111.png" alt="" />
      <img src="../../assets/img/2222.png" alt="" />
      <img src="../../assets/img/3333.png" alt="" />
      <img
        v-show="itsme"
        class="addNew"
        src="../../assets/img/boardAdd.png"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import {onMounted, watch} from "vue";
import {baseURL} from "@/actions/api";

export default {
  name: "Myboard",
  props:{
    userdata:{
      type:Object,
      default: () => {}
    }
  },
  setup(props) {
    let itsme = true;
    onMounted(() => {
      watch(
          () => props.userdata,
          () => {
            console.log(JSON.stringify(props.userdata))
          }

      )
    });
    return {
      itsme,
    };
  },
};
</script>

<style scoped>
.main {
  width: 300px;
  background: #2c2c2e;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.38), inset 1px 1px 1px 0px #75757d;
  border-radius: 8px;
  padding-bottom: 28px;
}
.boardimg {
  height: 145px;
  border-bottom: 1px solid #636366;
}

.boardimg img {
  width: 52px;
}
.boardimg span {
  margin-left: 17px;
  text-align: center;
  display: inline-block;
  margin-top: 30px;
}
.boardimg div {
  font-size: 14px;
  font-family: AvenirNext-Medium, AvenirNext;
  font-weight: 500;
  color: #cbb5ab;
  line-height: 14px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  margin-top: 10px;
}
.linkimg {
  padding-left: 24px;
  padding-top: 30px;
}
.linkimg img {
  width: 48px;
  margin-left: 12px;
}
.linkimg .addNew {
  width: 40px;
  height: 40px;
  margin-left: 16px;
}
</style>