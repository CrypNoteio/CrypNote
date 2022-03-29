<!-- author: nico -->
<!-- date: 2022-02-12 14:31:32 -->
<!-- description: home -->
<template>
  <div class="all">
    <div class="lattice">
      <div class="banner"></div>
    </div>
    <div class="ModuleII">
      <div class="ModuleIILeft"></div>
      <div class="ModuleIIRight">
        <div>Decentralized Permanent Storage Double Backup</div>
        <div>Return the value of the data to the individuals</div>
      </div>
    </div>
    <div class="ModuleIII">
      <div class="ModuleIIILeft">
        <div>One Wallet for All</div>
        <div>
          Continuous connection to web3 Metamask
          brightID,&nbsp;&nbsp;DAS&nbsp;&nbsp;ENS,&nbsp;&nbsp;Twitter,&nbsp;&nbsp;E-mail
        </div>
      </div>
      <div class="ModuleIIIRight"></div>
    </div>
    <div class="ModuleⅣ">
      <div class="ModuleⅣLeft">
        <img src="../../assets/img/img1.png" />
      </div>
      <div class="ModuleIVRight">
        <div>
          Collaboration suitable for DAO organizations Creating, motivating,
          sharing, synchronining
        </div>
        <div>
          CrypNote satisfies the synchronization and collaboration of DAO
          organizations. DAO organizations encourage users to create values and
          share insights through incentive pools to solve efficiency problems.
        </div>
      </div>
    </div>
    <div class="ModuleV2">
      <div class="title2">Roadmap</div>
      <div class="center2">
        <ul style="margin-left: 20px">
          <li>
            <div class="spot2"></div>
            CrypNote Beta1.0 launch
          </li>
          <li>
            <div class="spot2"></div>
            Design and release Genesis NFT
          </li>
        </ul>
        <ul></ul>
        <ul style="margin-left: 20px">
          <li>
            <div class="spot2"></div>
            Win & macOS clients development launch
          </li>
          <li>
            <div class="spot2"></div>
            Product function optimization
          </li>
          <li>
            <div class="spot2"></div>
            Knowledge base content mining
          </li>
        </ul>
        <ul></ul>
      </div>
      <div class="line2">
        <div class="text2">
          <span>2022 Q1</span>
          <span>2022 Q2</span>
          <span>2022 Q3</span>
          <span>2022 Q4</span>
        </div>
        <div class="hr2">
          <img src="../../assets/img/img11.png" />
          <img src="../../assets/img/img11.png" />
          <img src="../../assets/img/img11.png" />
          <img src="../../assets/img/img11.png" />
        </div>
      </div>
      <div class="center2">
        <ul></ul>
        <ul style="margin-left: 15%">
          <li>
            <div class="spot2"></div>
            iOS Android development launch
          </li>
          <li>
            <div class="spot2"></div>
            Product function optimization
          </li>
          <li>
            <div class="spot2"></div>
            Template base open platform
          </li>
          <li>
            <div class="spot2"></div>
            Knowledge base 1.0
          </li>
        </ul>
        <ul></ul>
        <ul>
          <li>
            <div class="spot2"></div>
            Knowledge base opening
          </li>
          <li>
            <div class="spot2"></div>
            Establish web3.0 search
          </li>
        </ul>
      </div>
    </div>
    <div class="s">
      <span class="Partners">Partners</span>
      <div class="partners_items">
        <a href="https://da.systems/" target="_blank"
          ><img src="../../assets/img/Cooperation.png"
        /></a>
        <a href="https://5Degrees.io/" target="_blank"
          ><img src="../../assets/img/5d.png"
        /></a>
      </div>
    </div>
    <div class="footer2">
      <div class="left2">© 2022 CrypNote, Inc.</div>
      <div class="right2">
        <a
          class="mouseHand router-link-active"
          style="color: rgba(174, 174, 178, 1)"
          href="https://twitter.com/CrypNoteio"
          target="_blank"
          ><img src="../../assets/img/img4.png"
        /></a>
        <a
          class="mouseHand router-link-active"
          style="color: rgba(174, 174, 178, 1)"
          href="https://discord.com/invite/SnZrf2X953"
          target="_blank"
          ><img src="../../assets/img/img5.png"
        /></a>
        <a
          class="mouseHand router-link-active"
          style="color: rgba(174, 174, 178, 1)"
          href="https://opensea.io/collection/crypnote"
          target="_blank"
          ><img src="../../assets/img/img12.png"
        /></a>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
  name: "Home",
  setup() {
    const route = useRoute();
    let store = useStore();
    store.dispatch("set_isDashboard", false);
    return {};
  },
});
</script>

<style scoped lang="scss">
@import "../../assets/style/Main/index.scss";
</style>