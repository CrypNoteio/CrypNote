<!-- author: fo -->
<!-- date: 2022-02-17 15:39:07 -->
<!-- description: Profile -->
<template>
  <div class="article" v-for="(item, index) in articleList" :key="index">
    <div class="title">
      {{ item.title }}
    </div>
    <div class="content">
      {{ item.content }}
    </div>
    <div class="info">
      <span class="date"> {{ item.date }}</span
      >/ <span class="time"> {{ item.time }}</span
      >/
      <span class="keys"> {{ item.keys }}</span>
      <img
        v-show="item.islike"
        src="../../assets/img/like.png"
        class="like"
        alt=""
      />
      <img
        v-show="!item.islike"
        src="../../assets/img/unlike.png"
        class="like"
        alt=""
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Archive",
  data: () => {
    return {
      articleList: [
        {
          title:
            " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pretium",
          content:
            "In hac habitasse platea dictumst. Vivamus adipiscing fermentum quam volutpat aliquam. Integer et elit eget elit facilisis tristique.",
          date: "15 Nov",
          time: "9 min read",
          keys: "Investing",
          islike: false,
        },
        {
          title:
            " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pretium",
          content:
            "In hac habitasse platea dictumst. Vivamus adipiscing fermentum quam volutpat aliquam. Integer et elit eget elit facilisis tristique.",
          date: "15 Nov",
          time: "9 min read",
          keys: "Investing",
          islike: true,
        },
      ],
    };
  },
};
</script>

<style scoped>
.article {
  width: 600px;
  height: 156px;
  background: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding-left: 20px;
  padding-top: 28px;
  margin-bottom: 20px;
}
.title {
  width: 550px;
  height: 60px;
  font-size: 18px;
  font-family: AvenirNext-DemiBold, AvenirNext;
  font-weight: 600;
  color: #000000;
  line-height: 20px;
}
.content {
  width: 550px;
  font-size: 12px;
  font-family: AvenirNext-Medium, AvenirNext;
  font-weight: 500;
  color: #757575;
  line-height: 16px;
}
.info {
  font-size: 12px;
  font-family: AvenirNext-Medium, AvenirNext;
  font-weight: 500;
  color: #757575;
  line-height: 16px;
  margin-top: 24px;
}
.info span {
  margin-right: 10px;
  margin-left: 10px;
}
.info span:first-child {
  margin-left: 0;
}
.keys {
  width: 72px;
  height: 24px;
  background: #eeeeef;
  border-radius: 12px;
  text-align: center;
  line-height: 24px;
  display: inline-block;
}
.like {
  width: 23px;
  height: 28px;
  display: inline-block;
  float: right;
  margin-right: 20px;
}
</style>