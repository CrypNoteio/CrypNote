<!-- author: fo -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: quill -->
<template>
  <div style="width: 100%" class="word">
    <div class="commonTitle">
      <div class="nav-left" style="font-size: 14px">
        <router-link
          to="/dashboard/quills"
          class="router-link-active"
          @click="getWord(1)"
        >
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
          <div class="ar" v-if="arLink" style="margin-top: 40px">
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
      </div>
    </div>
    <div style="width: 100%; margin: 0 auto; margin-top: 40px">
      <!-- <Word /> -->
      <div style="margin: 0 auto; width: 72%">
        <div
          ref="editorN"
          class="report"
          style="width: 100%; z-index: -1"
        ></div>
      </div>
    </div>
    <div class="exportW" style="display: none"></div>

    <div class="topicContent">
      <div class="topicAddTitle">Add Topics</div>
      <div class="topicAddContent">
        <div
          class="topicAddItem"
          v-for="(item, index) in topicItems"
          :key="index"
        >
          <img
            src="../../assets/img/delTopic.png"
            alt=""
            class="topicDelImg"
            v-if="index > 0"
            @click="delTopicItem(index)"
          />
          <input
            type="text"
            placeholder="Add a Topic"
            class="topicAddInput"
            @input="topicInputAction(index)"
            v-model="topicItems[index].topic"
          />
        </div>

        <img
          src="../../assets/img/addTopic.png"
          alt=""
          class="topicAddImg"
          @click="addNewTopicItem"
        />
      </div>
      <div v-if="manytopics" class="manytopics">
        You may add 5 topics most at once!
      </div>
      <div class="recommendTopicTitle">Recommended Topics</div>
      <div class="recommendTopicContent">
        <div
          class="recommendTopicItem"
          @click="addRecommendTopic(item.topic)"
          v-for="(item, index) in recommendTopicArr"
          :key="index"
        >
          {{ item.topic }}
        </div>

        <!--        <div class="recommendTopicItem" @click="addRecommendTopic('Crypto')">Crypto</div>-->
        <!--        <div class="recommendTopicItem" @click="addRecommendTopic('Metaverse')">Metaverse</div>-->
        <!--        <div class="recommendTopicItem" @click="addRecommendTopic('BTC')">BTC</div>-->
        <!--        <div class="recommendTopicItem" @click="addRecommendTopic('ETH')">ETH</div>-->
        <!--        <div class="recommendTopicItem" @click="addRecommendTopic('Russia')">Russia</div>-->
      </div>
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  reactive,
  toRefs,
} from "vue";
import { postData } from "@/actions";
import {
  getWiki,
  imageUp,
  saveWiki,
  updateWiki,
  getCoinList,
  recommendtopics,
} from "@/actions/api";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { getCookie, getCurrentTime, getTime } from "@/assets/js/Common.js";
import E from "wangeditor";
import i18next from "i18next";
import { ElLoading } from "element-plus";
import saveAs from "file-saver";
import "@/assets/js/jquery.wordexport.js";
export default defineComponent({
  name: "quill",
  setup() {
    const routers = useRouter();
    const route = useRoute();
    const store = useStore();
    const apptoken = getCookie("apptoken");
    console.log(store.state.userInfo);
    const userName = ref(store.state.userInfo.userName);
    const {
      $,
      BtnMenu,
      DropListMenu,
      PanelMenu,
      DropList,
      Panel,
      Tooltip,
      Newtip,
    } = E;
    let title = ref("Untitled Document");
    let updataTime = ref("");
    let isEditor = null;
    const editorN = ref(null);
    let editor;
    let tokenIsStart = true;
    let webLink = reactive({
      arLink: "",
      fileLink: "",
    });
    let tokenList = []; //token added in the content (dom,name,id)
    let getCoins = []; //all the token list
    const articleId = ref();
    //const groupId = ref(route.params.groupId);
    //added topics
    const topicItems = ref([{ topic: "", id: "topic1" }]);
    const manytopics = ref(false);
    const recommendTopicArr = ref([]);
    const creatDom = () => {

    };

    //insert token page
    const createShowHideFn = () => {
      let tooltip = null;
      //show token page
      const showSearchToken = (tokenAt) => {
        let showCoins = "";
        for (let i = 0; i <= 9; i++) {
          showCoins +=
            "<div class='tokenItemRow'>\n" +
            '            <img src="' +
            getCoins[i].logo +
            '" alt="" class="tokenImg">\n' +
            "            <span class='tokenName'  data-coinid='" +
            getCoins[i].id +
            "'>" +
            getCoins[i].symbol +
            "</span>\n" +
            '            <img src="' +
            require("../../assets/img/add.png") +
            '" alt="" class="tokenAdd">\n' +
            "          </div>\n";
        }

        //console.log(showCoins)
        const addTokenHtml =
          "<div class='searchTokenMain'>\n" +
          '        <span class="searchTokenTop">\n' +
          '          <img src="' +
          require("../../assets/img/Search.png") +
          '" alt="">\n' +
          '          <input type="text" id=\'searchInput\' class="searchToken" placeholder="Search tokens">\n' +
          "        </span>\n" +
          '        <span class="searchTokenBottom">\n' +
          showCoins +
          "        </span>\n" +
          "      </div>";
        const DomElement = $(".thisone");
        const conf = [
          {
            $elem: $(addTokenHtml),
            onClick: () => {
              console.log("imok");
              return true;
            },
          },
        ];
        //create tooltip
        tooltip = new Tooltip(editor, DomElement, conf, true);
        tooltip.create();
        //token page opened ,searchInput focus
        $(".searchToken").focus();

        //choose token event
        const clickToken = (tokenName, coinId) => {
          console.log("aaaaaaaaaa" + coinId);
          const tokenId = tokenName + (Math.random() * 10000 + 1).toFixed();
          const tokenDom =
            "<token data-id='" +
            coinId +
            "' class='tokenItem " +
            tokenName +
            " " +
            tokenId +
            "'>$" +
            tokenName +
            "</token>&nbsp;";
          //$('.thisone').html($('.thisone').text()+tokenName).addClass(tokenName).removeClass('thisone')
          //$('.thisone').replaceWith(tokenDom)
          console.log(tokenAt);
          if (tokenAt == false) {
            editor.cmd.do("insertHTML", tokenDom);

            console.log(editor.txt.html());
          } else {
            const oldHtml = editor.txt.html();
            const newHtml =
              oldHtml.substr(0, tokenAt) + tokenDom + oldHtml.substr(tokenAt);
            editor.txt.html(newHtml);
          }

          tokenList.push({ dom: tokenDom, name: tokenName, id: tokenId });
          //editor.txt.append('');
          hideSearchToken();
          const oldHtml = editor.txt.html();
          const tmpHtml = oldHtml.replace("$<token", "<token");
          editor.txt.html(tmpHtml);
        };
        //prevent tooltip's default events
        $(".searchTokenTop,.searchTokenBottom").on("click", function (e) {
          e.stopPropagation();
        });
        //tokenlist event
        // $('.searchTokenBottom').on('mouseover', 'div', function(){
        //   $(this).addClass('searchTokenMoveOn')
        //   console.log($(this).find('span').text())
        // })
        // $('.searchTokenBottom').on('mouseout','div', function(){
        //   $(this).removeClass('searchTokenMoveOn')
        // })
        // $('.searchTokenBottom').on('mouseover', 'img,.tokenName', function(){
        //   $(this).parent().addClass('searchTokenMoveOn')
        //   console.log($(this).parent().find('span').text())
        // })
        // $('.searchTokenBottom').on('mouseout','img,.tokenName', function(){
        //   $(this).parent().removeClass('searchTokenMoveOn')
        // })
        $(".searchTokenBottom").on("click", "div", function () {
          $(this).removeClass("searchTokenMoveOn");
          const tokenName = $(this).find("span").text();
          const coinId = $(this).find("span").attr("data-coinid");
          console.log("bbbbbb" + coinId);
          clickToken(tokenName, coinId);
        });
        $(".searchTokenBottom").on("click", "img,.tokenName", function () {
          $(this).parent().removeClass("searchTokenMoveOn");
          const tokenName = $(this).parent().find("span").text();
          const coinId = $(this).parent().find("span").attr("data-coinid");
          console.log("cccccc" + coinId);
          clickToken(tokenName, coinId);
        });

        //alter tooltip parent class
        $(".w-e-tooltip-item-wrapper").addClass("w-e-tooltip-item-wrapper2");

        //searchInput content change event
        //search from getCoins[Array] with the input Keyword,then show the result
        const searchInput = document.getElementById("searchInput");
        const searchInputFn = (e) => {
          let changeCoins = [];
          getCoins.forEach(function (item, index) {
            if (
              item.symbol.indexOf(searchInput.value) == 0 &&
              changeCoins.length < 20
            ) {
              const newStr =
                "<div class='tokenItemRow'>\n" +
                '            <img src="' +
                item.logo +
                '" alt="" class="tokenImg">\n' +
                "            <span class='tokenName' data-coinid='" +
                item.id +
                "'>" +
                item.symbol +
                "</span>\n" +
                '            <img src="' +
                require("../../assets/img/add.png") +
                '" alt="" class="tokenAdd">\n' +
                "          </div>\n";
              changeCoins.push(newStr);
              $(".searchTokenBottom").html(changeCoins.join(""));
              //console.log(item.symbol)
            }
          });
          //console.log(123)
        };
        //listion input event
        searchInput.addEventListener("input", searchInputFn);
      };

      // hide the token page and remove related dom
      const hideSearchToken = () => {
        if (tooltip) {
          tooltip.remove();
          $(".thisone").remove();
          tooltip = null;
        }
      };

      return {
        showSearchToken,
        hideSearchToken,
      };
    };
    const bindSearchTokenEvent = (tokenAt) => {
      const { showSearchToken, hideSearchToken } = createShowHideFn();
      showSearchToken(tokenAt);
      // click other location,or scroll, hide the token page
      editor.txt.eventHooks.clickEvents.push(hideSearchToken);
      //editor.txt.eventHooks.keyupEvents.push(hideSearchToken)
      editor.txt.eventHooks.toolbarClickEvents.push(hideSearchToken);
      editor.txt.eventHooks.menuClickEvents.push(hideSearchToken);
      editor.txt.eventHooks.textScrollEvents.push(hideSearchToken);
      //press the delete keys event
      editor.txt.eventHooks.deleteDownEvents.push(function (event) {
        if (editor.txt.text().substr(-1, 1) == "$") {
          hideSearchToken();
        }
      });
    };

    //$token menu
    class AlertMenu extends BtnMenu {
      constructor(editor) {
        const $elem = E.$(
          `<div class="w-e-menu" data-title="inserttoken">
                <button style="border:0px;font-size: 18px">$</button>
            </div>`
        );
        super($elem, editor);
      }
      //$token menu click event
      clickHandler() {
        if (getCoins.length == 0) {
          OnlyMessage.error("Component loading, waiting...");
          return false;
        }
        //add $
        editor.cmd.do("insertHTML", '<i class="thisone tokenItemColor">$</i>');
        bindSearchTokenEvent(false);
      }
      tryChangeActive() {
        this.active();
      }
    }
    onMounted(() => {
      const menuKey = "alertMenuKey";

      E.registerMenu(menuKey, AlertMenu);

      document.body.scrollTop = 0;
      editor = new E(editorN.value);
      editor.config.placeholder = 'Type "$" for Tokens';
      editor.config.lang = "en";
      editor.config.uploadImgShowBase64 = true;
      editor.i18next = i18next;
      editor.config.customUploadImg = function (files, insert) {
        filesToBase64(files);
      };
      editor.config.onchange = function (theHtml) {
        // if(editor.txt.text().substr(-1,1) == '$' && tokenIsStart){
        //   tokenIsStart = false;
        //   const tokenAt = theHtml.lastIndexOf('$')
        //   const newHtml = theHtml.substring(0,tokenAt) + '<i style="color: #3A7FFF;display: inline" class="thisone">$</i>' + theHtml.substring(tokenAt+1)
        //
        //   editor.txt.html(newHtml)
        //   tokenIsStart = true;
        //   bindSearchTokenEvent()
        // }
      };

      editor.create();

      //key event
      //press the $ key
      editor.txt.eventHooks.keyupEvents.push(function (event) {
        console.log(event);
        if (event.key == "$") {
          if (getCoins.length == 0) {
            OnlyMessage.error("Component loading, waiting...");
            return false;
          }
          editor.cmd.do(
            "insertHTML",
            '<i class="thisone tokenItemColor">$</i>'
          );

          bindSearchTokenEvent(false);

          return;
          // const oldHtml = editor.txt.html()
          //
          // //console.log(event)
          // // if(tokenList.length>0){
          // //   tokenList.forEach(function (item, index){
          // //     oldHtml.replace(item.dom,'')
          // //   })
          // // }
          // const tmpHtml = oldHtml.replace('>$', '**');
          // const tokenAt = tmpHtml.lastIndexOf('$')
          // if(tokenAt != -1){
          //  // console.log(tokenAt)
          //   const newHtml = oldHtml.substring(0,tokenAt) + '<i class="thisone tokenItemColor">$</i>' + oldHtml.substring(tokenAt+1)
          //   editor.txt.html(newHtml)
          //   setTimeout(function(){
          //     bindSearchTokenEvent(tokenAt);
          //   },300)
          //
          // }
        }
      });
      //press delete key event,delete token
      editor.txt.eventHooks.deleteUpEvents.push(function (event) {
        if (tokenList.length > 0 && $(".tokenItem").length > 0) {
          const oldHtml = editor.txt.html();
          //console.log(tokenList)
          tokenList.forEach(function (item, index) {
            if ($("." + item.id).length > 0) {
              if ($("." + item.id).text() != "$" + item.name) {
                $("." + item.id).remove();
                tokenList.splice(index, 1);
                // console.log(tokenList)
              }
            } else {
              tokenList.splice(index, 1);
            }
          });
        } else {
          if ($(".tokenItem").length == 0) {
            tokenList = [];
          }
        }
      });
      getRecommendTopics();
      getToken();
    });
    const filesToBase64 = (files) => {
      files.map((item) => {
        var reader = new FileReader();
        reader.onload = function (e) {
          imageU(e.target.result);
        };

        reader.readAsDataURL(item);
      });
    };
    const baseurl = "https://www.crypnote.io";
    const imageU = async (result) => {
      try {
        const updatedResource = await postData(imageUp, {
          file: result,
          module: "word",
          name: route.params.id,
        });
        // console.log(updatedResource.data)
        if (updatedResource.success) {
          var img = baseurl + "/img/" + updatedResource.data.url;
          editor.cmd.do(
            "insertHtml",
            '<img src="' + img + '" style="max-width:100%;"/>'
          );
        }
      } catch {}
    };
    onUnmounted(() => {
      //ElMessage.closeAll();
    });

    let content = ref([]);
    let changeType = ref("");
    let timesShow = ref("");
    //getAllTokenList api
    const getToken = async () => {
      try {
        const updatedResource = await postData(getCoinList, {
          apptoken: apptoken,
        });
        if (updatedResource.success) {
          getCoins = updatedResource.data.list;
          console.log(getCoins);
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        console.log("errror", errorMessage);
        OnlyMessage.error(errorMessage);
      }
    };
    const unescape = (html) => {
      return html.replace(/&amp;/g, "&");
    };
    const getPointKeys = () => {
      let keyArr = [];
      if ($(".tokenItem").length > 0) {
        $(".tokenItem").elems.forEach(function (item, index) {
          const tokenArr = item.getAttribute("class").split(" ");
          keyArr.push(tokenArr[1]);
        });
        return keyArr.join(",");
      } else {
        return "";
      }
    };
    const showWord = async () => {

      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      try {
        const updatedResource = await postData(getWiki, {
          apptoken: apptoken,
          hash: route.params.id,
        });
        loading.close();
        if (updatedResource.success) {
          //console.log(updatedResource.data);
          timesShow.value = updatedResource.data.updateTime;
          articleId.value = updatedResource.data.id;
          let showContent = updatedResource.data.content;
          showContent = JSON.parse(decodeURI(showContent));
          title.value = decodeURI(updatedResource.data.title);
          editor.txt.setJSON(showContent);
          const contentHtml = editor.txt.html();
          //console.log(unescape(contentHtml))
          editor.txt.html(unescape(contentHtml));

          webLink.arLink = updatedResource.data.transactionID;
          //console.log($(".tokenItem"));
          $(".tokenItem").elems.forEach(function (item, index) {
            const tokenArr = item.getAttribute("class").split(" ");
            tokenList.push({
              dom: item.outerHTML,
              name: tokenArr[1],
              id: tokenArr[2],
            });
            //console.log(tokenList)
          });
          topicItems.value[0].topic = updatedResource.data.topic1;
          const tmpTopicArr = [
            updatedResource.data.topic2,
            updatedResource.data.topic3,
            updatedResource.data.topic4,
            updatedResource.data.topic5,
          ];
          tmpTopicArr.forEach(function (item, index) {
            if (item) {
              topicItems.value.push({
                topic: decodeURI(item),
                id: "topic" + (index + 2),
              });
            }
          });
          // console.log(updatedResource.data)
          //console.log(editor.txt.html())
          //webLink.fileLink = updatedResource.data.filaddress;
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        loading.close();
        console.log("errror", errorMessage);
        OnlyMessage.error(errorMessage);
      }
    };

    if (route.params.id) {
      showWord();
      changeType.value = true;
    } else {
      timesShow.value = getCurrentTime();
    }

    const getWord = (type) => {
      if (!title.value) {
        OnlyMessage.error("Article title cannot be empty！");
        return;
      }
      if (changeType.value) {

        upWord(type);
      } else {

        newWord(type);
      }
    };

    const newWord = async (type) => {
      if (type) {
        routers.replace("/dashboard/quills");
        return;
      }
      if (!topicItems.value[0].topic) {
        OnlyMessage.error("You must add one topic tag at least");
        return;
      }
      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      try {
        const updatedResource = await postData(saveWiki, {
          apptoken: apptoken,
          title: encodeURI(title.value),
          content: encodeURI(JSON.stringify(editor.txt.getJSON())),
          pointkeys: getPointKeys(),
          topic1: encodeURI(topicItems.value[0].topic),
          topic2: topicItems.value[1]
            ? encodeURI(topicItems.value[1].topic)
            : "",
          topic3: topicItems.value[2]
            ? encodeURI(topicItems.value[2].topic)
            : "",
          topic4: topicItems.value[3]
            ? encodeURI(topicItems.value[3].topic)
            : "",
          topic5: topicItems.value[4]
            ? encodeURI(topicItems.value[4].topic)
            : "",
          // groupId: route.params.groupId,
        });
        loading.close();
        if (updatedResource.success) {
          OnlyMessage.success("Content published successfully");
          setTimeout(() => {
            routers.replace("/dashboard/quills");
          }, 1000);
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        loading.close();
        OnlyMessage.error(errorMessage);
      }
    };
    const upWord = async (type) => {
      if (!topicItems.value[0].topic) {
        OnlyMessage.error("You must add one topic tag at least");
        return;
      }

      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      loading.close();
      try {
        const updatedResource = await postData(updateWiki, {
          apptoken: apptoken,
          //groupId: route.params.groupId,
          title: encodeURI(title.value),
          content: encodeURI(JSON.stringify(editor.txt.getJSON())),
          id: articleId.value,
          pointkeys: getPointKeys(),
          topic1: encodeURI(topicItems.value[0].topic),
          topic2: topicItems.value[1]
            ? encodeURI(topicItems.value[1].topic)
            : "",
          topic3: topicItems.value[2]
            ? encodeURI(topicItems.value[2].topic)
            : "",
          topic4: topicItems.value[3]
            ? encodeURI(topicItems.value[3].topic)
            : "",
          topic5: topicItems.value[4]
            ? encodeURI(topicItems.value[4].topic)
            : "",
        });
        if (updatedResource.success) {
          // ElMessage(updatedResource.msg);
          if (type != 1) {
            OnlyMessage.success("Modified successfully");
          }

          setTimeout(() => {
            routers.replace("/dashboard/quills");
          }, 2000);
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        loading.close();

        OnlyMessage.error(errorMessage);
      }
    };
    const historyClick = () => {
      routers.push({
        path: "/versionHistory/" + route.params.id,
      });
    };
    const exportWord = () => {

      const loading = ElLoading.service({
        lock: true,
        text: "Waiting...",
        background: "rgba(0, 0, 0, 0.5)",
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
      $(".exportW").html(editor.txt.html());
      $(".exportW").wordExport(title.value);
    };

    const getRecommendTopics = async () => {
      try {
        const updatedResource = await postData(recommendtopics, {
          apptoken: apptoken,
        });
        if (updatedResource.success) {
          console.log(updatedResource.data.list);
          recommendTopicArr.value = updatedResource.data.list;
        } else {
          OnlyMessage.error(updatedResource.msg);
        }
      } catch (errorMessage) {
        console.log("errror", errorMessage);
        OnlyMessage.error(errorMessage);
      }
    };
    const addNewTopicItem = () => {
      const newItemIndex = topicItems.value.length + 1;
      if (newItemIndex > 5) {
        manytopics.value = true;
      } else {
        const newItemName = "topic" + newItemIndex;
        topicItems.value.push({
          topic: "",
          id: newItemName,
        });
      }
    };
    const topicInputAction = (index) => {
      //console.log(topicItems.value);
      //console.log(topicItems.value[index])
    };
    const delTopicItem = (index) => {
      console.log("del topic");
      topicItems.value.splice(index, 1);
      let newArr = [];
      topicItems.value.forEach(function (item, index) {
        newArr.push({
          topic: item.topic,
          id: "topic" + (index + 1),
        });
      });
      topicItems.value = newArr;
      if (topicItems.value.length <= 5) {
        manytopics.value = false;
      }
    };
    const addRecommendTopic = (topic) => {
      let isAdded = false;
      try {
        topicItems.value.forEach(function (item, index) {
          if (item.topic == topic) {
            isAdded = true;
            OnlyMessage.error('"' + topic + '" is already exists.');
            throw new Error('"' + topic + '" is already exists.');
          }
        });
        topicItems.value.forEach(function (item, index) {
          if (!item.topic) {
            item.topic = topic;
            isAdded = true;
            throw new Error("end");
          }
        });
      } catch (e) {
        console.log(e.message);
      }
      if (!isAdded) {
        if (topicItems.value.length == 5) {
          manytopics.value = true;
        } else {
          topicItems.value.push({
            topic: topic,
            id: "topic" + (topicItems.value.length + 1),
          });
        }
      }
    };
    return {
      userName,
      editor,
      upWord,
      newWord,
      getWord,
      showWord,
      content,
      title,
      timesShow,
      creatDom,
      editorN,
      ...toRefs(webLink),
      historyClick,
      exportWord,
      imageU,
      addNewTopicItem,
      topicItems,
      topicInputAction,
      delTopicItem,
      manytopics,
      addRecommendTopic,
      recommendTopicArr,
    };
  },
});
</script>
<style >
.tokenItem {
  color: #3a7fff;
}
.tokenItemColor {
  color: #3a7fff;
  display: inline;
}
.w-e-tooltip2 {
  position: absolute;
  display: flex;
  color: #f1f1f1;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  text-align: center;
  height: 180px;
}
.w-e-tooltip-item-wrapper2 {
  margin: 0;
}
.searchTokenTop {
  border-bottom: 1px solid #f2f2f7;
  display: inline-block;
  padding: 13px 12px;
}
.searchTokenTop img {
  width: 14px;
  position: absolute;
  left: 20px;
  top: 19px;
}
.searchToken {
  width: 126px;
  height: 27px;
  background: rgba(118, 118, 128, 0.12);
  border-radius: 8px;
  font-size: 12px;
  font-family: AvenirNext-Medium, AvenirNext;
  font-weight: 500;
  color: rgba(60, 60, 67, 0.6);
  line-height: 27px;
  border: 0;
  text-align: center;
}
.searchTokenBottom {
  width: 150px;
  display: block;
  text-align: left;
  padding: 13px 0;
  height: 100px;
  overflow-y: scroll;
}
.searchTokenBottom div {
  width: 100%;
  display: inline-block;
  color: #000;
  line-height: 18px;
  padding-top: 4px;
  padding-bottom: 3px;
}
.searchTokenMoveOn {
  background: rgba(160, 207, 255, 0.3);
}
.tokenItemRow:hover {
  background: rgba(160, 207, 255, 0.3);
}
.searchTokenBottom div span {
  font-size: 9px;
  font-family: Avenir-Heavy, Avenir;
  font-weight: 800;
  color: #000000;
  line-height: 18px;
  margin-left: 8px;
}
.searchTokenBottom .tokenImg {
  width: 18px;
  float: left;
  margin-left: 12px;
}
.searchTokenBottom .tokenAdd {
  width: 14px;
  float: right;
  margin-top: 2px;
  margin-right: 12px;
}

.report .w-e-toolbar * {
  box-sizing: content-box !important;
}
.report .w-e-menu-panel * {
  box-sizing: content-box !important;
  background: #fafafa !important;
}
.report .w-e-text-container * {
  box-sizing: content-box !important;
}
.report .w-e-toolbar {
  padding: 0 !important;
  background-color: #fafafa !important  ;
}
.report .w-e-text-container {
  z-index: 1 !important;
  /*  padding: 0 20px !important;*/
  background: #fafafa !important;
}

.w-e-text {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  padding: 0;
}
.w-e-text::-webkit-scrollbar {
  width: 0 !important;
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
  margin-left: 10px;
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
  font-family: AvenirNextMedium;
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

/*Topic*/
.topicContent {
  margin: 35px auto;
  width: 72%;
  border-top: 1px solid #d1d1d6;
}
.topicAddTitle {
  font-size: 16px;
  font-family: AvenirNext-DemiBold, AvenirNext;
  font-weight: 600;
  color: #000000;
  line-height: 22px;
  margin-top: 21px;
}
.topicAddContent {
  width: 100%;
  margin-top: 12px;
}
.topicAddItem {
  margin-right: 16px;
  display: inline-block;
  position: relative;
}
.topicAddInput {
  padding: 0 10px;
  height: 24px;
  background: #eeeeef;
  border-radius: 12px;
  border: 0px;
  font-size: 12px;
  font-family: AvenirNext-Medium, AvenirNext;
  font-weight: 500;
  color: #000000;
  line-height: 24px;
  text-align: center;
}
.topicDelImg {
  width: 14px;
  height: 14px;
  position: absolute;
  right: -6px;
  top: -4px;
}
.topicAddImg {
  width: 24px;
  height: 24px;
  position: relative;
  top: 8px;
}
.manytopics {
  font-size: 12px;
  font-family: AvenirNext-Medium, AvenirNext;
  font-weight: 500;
  color: #ff453a;
  line-height: 16px;
  margin-top: 10px;
}
.recommendTopicTitle {
  font-size: 16px;
  font-family: AvenirNext-DemiBold, AvenirNext;
  font-weight: 600;
  color: #000000;
  line-height: 22px;
  margin-top: 14px;
}
.recommendTopicItem {
  margin-right: 16px;
  display: inline-block;
  position: relative;
  font-size: 12px;
  font-family: AvenirNext-Medium, AvenirNext;
  font-weight: 500;
  color: #000000;
  line-height: 24px;
  min-width: 72px;
  max-width: 300px;
  height: 24px;
  background: #eeeeef;
  border-radius: 12px;
  text-align: center;
  padding: 0 10px;
  margin-top: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.recommendTopicItem:hover {
  background: #1c1c1e;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.16);
  color: #e5e5ea;
}
</style>