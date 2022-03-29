<!-- author: fo -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: library -->
<template>
  <div class="libraryBg" @scroll="scroll">
    <div class="domeright">
      <div class="rightLeft inline-block">
        <div class="rightTopImg">
          <img src="../../assets/img/librart/rightIcon1.png" alt="" />
          <img src="../../assets/img/librart/rightIcon2.png" alt="" />
          <img src="../../assets/img/librart/rightIcon3.png" alt="" />
        </div>
        <div class="rightText">
          Discover CrypNote authors you already follow on Twitter
        </div>
        <div class="rightImg"></div>
        <div style="text-align: center; margin-top: 20px">
          <a href="#" style="color: #0a84ff; font-weight: 600">Maybe later</a>
        </div>
        <div class="rightBottom">
          <div class="rightBTitle">Recommended Topics</div>
          <div class="rightBLabel" style="margin-top: 40px">
            <span>Investing</span><span>Blockchain</span>
          </div>
          <div class="rightBLabel"><span>Metaverse</span><span>DeFi</span></div>
        </div>
      </div>
    </div>
    <div class="domeleft">
      <div style="width: 620px; height: auto; margin-top: 40px">
        <div class="leftTitle textNoclick">
          <img
            src="../../assets/img/librart/icon1.png"
            alt=""
            style="width: 44px; height: 44px"
          />
          <span>Keep up with the latest in any topic</span>
        </div>
        <div class="label">
          <span>Following</span>
          <span>Recommended For You</span>
        </div>
        <el-scrollbar
          style="height: 560px; border: 1px solid #eee; margin-top: 40px"
        >
          <div
            class="list"
            v-for="(item, index) in articleList"
            v-bind:key="index"
          >
            <div style="width: 60%" class="inline-block">
              <div class="listTitle">{{ item.title }}</div>
              <div class="listContent">{{ item.content }}</div>
              <div style="margin-top: 20px">
                <img
                  class="icon2 inline-block"
                  referrerpolicy="no-referrer"
                  src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng0f1d563d44cb1cdfb06a3d178f9845c9ae3f94650d4e0631e141f4b6c111a0b5"
                />
                <span class="Lword2 inline-block">
                  Keep&nbsp;up&nbsp;with&nbsp;the&nbsp;latest&nbsp;in&nbsp;any&nbsp;topic
                </span>
              </div>
              <div class="listLabel">
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item>15 Nov</el-breadcrumb-item>
                  <el-breadcrumb-item>9 min read</el-breadcrumb-item>
                  <el-breadcrumb-item>Investing</el-breadcrumb-item>
                  <el-breadcrumb-item>Selected for you</el-breadcrumb-item>
                </el-breadcrumb>
              </div>
            </div>
            <div
              style="width: 40%; text-align: center"
              class="inline-block leftImg"
            ></div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getCookie } from "@/assets/js/Common";
import { postData } from "@/actions";
import { wikiList } from "@/actions/api";

export default {
  name: "libray",
  setup() {
    const apptoken = getCookie("apptoken");
    const articleList = ref([]);
    let currentPageIndex = 1;
    let dataComplete = false;
    const item = {
      title:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pretium ",
      content:
        "In hac habitasse platea dictumst. Vivamus adipiscing fermentum quam volutpat aliquam. Integer et elit eget elit facilisis tristique. ",
      address: "xxx 1518 xx",
    };
    onMounted(() => {
      getWikiList(1);
    });
    const getWikiList = async (pageIndex) => {
      try {
        const updatedResource = await postData(wikiList, {
          apptoken: apptoken,
          pageSize: 10,
          pageIndex: pageIndex,
        });
        console.log(updatedResource.data);
        if (updatedResource.success) {
          let arr = updatedResource.data.list;
          let dataArr = [];
          arr.forEach(function (item) {
            console.log();
            const timeStr = new Date(item.createTime).toDateString().split(" ");
            dataArr.push({
              title: decodeURI(item.title),
              content: item.shotContent,
              date: timeStr[2] + " " + timeStr[1],
              keys1: item.topic1,
              keys2: item.topic2,
              keys3: item.topic3,
              keys4: item.topic4,
              keys5: item.topic5,
              islike: false,
            });
          });
          articleList.value = articleList.value.concat(dataArr);

          if (
            updatedResource.data.pageCount == updatedResource.data.pageIndex
          ) {
            dataComplete = true;
          } else {
            currentPageIndex = updatedResource.data.pageIndex + 1;
          }
        }
      } catch {}
    };

    const getArticles = () => {
      if (!dataComplete) {
        getWikiList(currentPageIndex);
      }
    };
    const scroll = () => {
      const dom = document.getElementById("table_content_collection");
      let scrollHeight = dom.scrollHeight;
      let scrollTop = dom.scrollTop;
      let clientHeight = dom.clientHeight;
      if (scrollHeight - clientHeight == scrollTop) {
        getArticles();
      }
    };
    return {
      item,
      scroll,
      articleList,
    };
  },
};
</script>
<style scoped>
.libraryBg {
  width: 1200px;
  min-height: 100%;
  min-width: 1200px;
  margin: 0 auto;
  padding-top: 64px;
}
.domeleft {
  display: inline-block;
  vertical-align: top;
  width: 50%;
  min-width: 800px;
  max-width: 1120px;
  min-height: 100%;
  float: right;
}
.domeright {
  display: inline-block;
  vertical-align: top;
  width: 30%;
  min-width: 340px;
  max-width: 800px;
  min-height: 400px;
  float: right;
  margin-top: 10px;
  background: #ffffff;
}
.leftTitle {
  font-size: 24px;
  font-family: AvenirNext-Medium;
  font-weight: 500;
  color: #000000;
  padding-left: 28px;
}
.leftTitle span {
  line-height: 44px;
  vertical-align: top;
  margin-left: 10px;
}
.label {
  font-size: 16px;
  font-family: AvenirNext-Bold, AvenirNext;
  font-weight: bold;
  margin-top: 20px;
  padding-left: 28px;
}
.label span:first-child {
  color: #757575;
}
.label span:last-child {
  color: #000000;
  margin-left: 16px;
  background: #eeeeef;
  border-radius: 8px;
  padding: 5px 10px;
}

.rightLeft {
  margin-top: 87px;
  margin-left: 50%;
  transform: translateX(-50%);
}
.rightRight {
  background: url("../../assets/img/dome/Notebook.png") no-repeat;
  background-size: 100% 100%;
  width: 220px;
  height: 290px;
  margin-left: 80px;
  margin-top: 150px;
}
.rightTitle {
  font-size: 36px;
  font-family: AvenirNext-DemiBold, AvenirNext;
  font-weight: 600;
  color: #000000;
  width: 224px;
}
.rightInput {
  font-size: 16px;
  width: 200px;
  border-bottom: 1px solid #d1d1d6;
  height: 45px;
  line-height: 45px;
}
.login {
  margin-top: 40px;
  font-size: 16px;
  font-family: AvenirNext-DemiBold, AvenirNext;
  font-weight: 600;
  color: #000000;
}
.rightLeftBottom {
  font-size: 12px;
  font-family: AvenirNext-DemiBold, AvenirNext;
  font-weight: 600;
  color: #757575;
  margin-top: 10px;
}
.list {
  width: 92%;
  margin: 0 auto;
  padding: 35px 0 39px 0;
  border-bottom: 1px solid #e4e4e6;
}
.listTitle {
  font-size: 18px;
  font-family: AvenirNext-Bold, AvenirNext;
  font-weight: bold;
  color: #000000;
  line-height: 33px;
}
.listContent {
  font-size: 14px;
  font-family: AvenirNext-Medium, AvenirNext;
  font-weight: 500;
  color: #757575;
  line-height: 22px;
  margin-top: 10px;
}
.icon2 {
  width: 28px;
  height: 28px;
}
.listLabel {
  font-size: 12px;
  font-family: AvenirNext-Medium, AvenirNext;
  font-weight: 500;
  color: #757575;
  line-height: 16px;
  margin-top: 17px;
}
.el-scrollbar {
  border: none !important;
}
.leftImg {
  width: 250px;
  height: 180px;
  background: url("https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng581a1092b82abe76d5934fcaecc3e0e720523a231b02fcde9cdf6b8c71622f4a")
    no-repeat;
  border-radius: 8px;
  margin-top: 40px;
}
.rightTopImg img {
  margin: 0 18px;
}
.rightTopImg img:first-child {
  width: 90px;
  height: 18px;
}
.rightTopImg img:nth-child(2) {
  width: 10px;
  height: 10px;
  vertical-align: text-top;
}
.rightTopImg img:last-child {
  width: 40px;
  height: 32px;
}
.rightText {
  font-size: 16px;
  font-family: AvenirNext-Medium, AvenirNext;
  font-weight: 600;
  color: #000000;
  margin-top: 30px;
  width: 290px;
}
.rightImg {
  width: 250px;
  height: 44px;
  background: url("../../assets/img/librart/rightIcon4.png") no-repeat;
  background-size: 100% 100%;
  margin: 0 auto;
  margin-top: 28px;
}
.rightBottom {
  margin-top: 200px;
}
.rightBTitle {
  font-size: 18px;
  font-family: AvenirNext-Bold, AvenirNext;
  font-weight: bold;
  color: #000000;
}
.rightBLabel {
  font-size: 16px;
  font-family: AvenirNext-DemiBold, AvenirNext;
  font-weight: 600;
  color: #757575;
}
.rightBLabel span {
  background: #eeeeef;
  border-radius: 20px;
  padding: 4px 15px;
  height: 40px;
  line-height: 40px;
}
.rightBLabel span:last-child {
  margin-left: 30px;
}
</style>