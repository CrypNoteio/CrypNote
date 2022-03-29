<!-- author: nico -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: nft -->
<template>
  <div id="ct">
    <div id="mainAbout">
      <div class="wrap1 flex-row">
        <div class="wrap2 flex-col">
          <router-link :to="{ name: 'NFT_Home' }">
            <div class="router-div">
              <img
                class="home homelink"
                referrerpolicy="no-referrer"
                src="../../assets/img/home@2x.png"
              />
              <span class="txt1 homelink">Home</span>
            </div>
          </router-link>

          <router-link :to="{ name: 'NFT_Mint' }">
            <div class="router-div">
              <img
                class="mint mintlink"
                referrerpolicy="no-referrer"
                src="../../assets/img/mint@2x.png"
              />
              <span class="txt2 mintlink">Mint</span>
            </div>
          </router-link>

          <router-link :to="{ name: 'NFT_About' }">
            <div class="router-div">
              <img
                class="about aboutlink"
                referrerpolicy="no-referrer"
                src="../../assets/img/about@2x.png"
              />
              <span class="txt3 aboutlink">About&nbsp;Us</span>
            </div>
          </router-link>
          <div
            class="wallet_box"
            v-if="!isConnected"
            @click="connectWallet(true)"
          >
            <img
              class="connect connectlink"
              referrerpolicy="no-referrer"
              src="../../assets/img/connect@2x.png"
            />
            <span class="txt4 connectlink">
              Connect
              <br />
              Wallet
            </span>
          </div>
          <div class="wallet_box" v-else>
            <img
              class="connect connectlink"
              referrerpolicy="no-referrer"
              src="../../assets/img/connected.png"
            />
            <span class="txt4 connectlink">
              Wallet
              <br />
              Connected
            </span>
          </div>
        </div>
        <div class="wrap4about flex-col">
          <div class="layer3 flex-col">
            <span class="txt11">ABOUT&nbsp;US</span>
          </div>
          <div class="contentabout">
            <div class="aboutsection4 flex-row justify-between">
              <img
                class="aboutlayer1"
                referrerpolicy="no-referrer"
                src="../../assets/img/about-img.png"
              />
            </div>
            <span class="abouttxt1">What&nbsp;is&nbsp;CrypNote&nbsp;NFT?</span>
            <span class="aboutword3 dont-break-out" style="line-height: 25px">
              The commemorative product produced by the CrypNote design team
              will be launched before the launch of crypnote, and will not
              release the Genesis version of NFT in the future. This is a
              limited edition.
            </span>
            <span class="abouttxt1">What&nbsp;is&nbsp;CrypNote?</span>
            <span class="aboutword3 dont-break-out" style="line-height: 25px">
              CrypNote is a Web3 permanent storage note collaboration product.
              Through encrypted storage on the chain, it can achieve content
              privacy, content sharing, editing and collaboration, content
              ownership, and on-chain content interaction to build a Web3 and
              DAO infrastructure.
            </span>
            <span class="abouttxt1">
              What&nbsp;is&nbsp;CrypNote&nbsp;used&nbsp;for?
            </span>
            <p class="aboutword3 dont-break-out" style="line-height: 25px">
              CrypNote 🪶is a note-taking collaboration + creation space
              high-frequency content interaction product that strives to become
              a WEB3 portal and DAO infrastructure. Through the way of NFT to
              give certain rights to early loyal users, and continue to bring
              more rights to NFT holders.
            </p>
            <p class="aboutword3 dont-break-out" style="line-height: 25px">
              Product inviting code
            </p>
            <p class="aboutword3 dont-break-out" style="line-height: 25px">
              ● Users who hold NFT are qualified to experience the product.
            </p>
            <p class="aboutword3 dont-break-out" style="line-height: 25px">
              ● The product experience inviting code will be obtained
              continuously during the using of the product.
            </p>
            <p class="aboutword3 dont-break-out" style="line-height: 25px">
              To get the test tokens
            </p>
            <p class="aboutword3 dont-break-out" style="line-height: 25px">
              During the product upgrade process, users with NFT will get test
              tokens.
            </p>
            <p class="aboutword3 dont-break-out" style="line-height: 25px">
              The test tokens will be obtained continuously during the use of
              the product.
            </p>
            <p class="aboutword3 dont-break-out" style="line-height: 25px">
              In the future, test tokens have a certain percentage of token
              value.
            </p>
            <p class="aboutword3 dont-break-out" style="line-height: 25px">
              Project promotion
            </p>
            <p class="aboutword3 dont-break-out" style="line-height: 25px">
              *You can get once free content promotion in CrypNote.
            </p>
            <p class="aboutword3 dont-break-out" style="line-height: 25px">
              *This interest applies to members who are developing projects in
              the blockchain industry.
            </p>
            <p class="aboutword3 dont-break-out" style="line-height: 25px">
              IDO participation
            </p>
            <p class="aboutword3 dont-break-out" style="line-height: 25px">
              ➤ Priority can be obtained in future IDO activities.
            </p>
            <p class="aboutword3 dont-break-out" style="line-height: 25px">
              ➤ The NFT holders will be taken a snapshot when IDO.
            </p>
            <p class="aboutword3 dont-break-out" style="line-height: 25px">
              Rights and interests of creating task
            </p>
            <p class="aboutword3 dont-break-out" style="line-height: 25px">
              ✪ Give priority to acquire the creating tasks of the promotion
              project.
            </p>
            <p class="aboutword3 dont-break-out" style="line-height: 25px">
              ✪ This right applies to KOLs with certain creative ability or
              influence.
            </p>

            <span class="abouttxt1">
              Launch&nbsp;time&nbsp;and&nbsp;mint&nbsp;rules&nbsp;of<br />CrypNote&nbsp;NFT
            </span>
            <span class="aboutword3 dont-break-out" style="line-height: 25px">
              The launch time of the whitelist is Jan. 25, 2022 UTC PM 04:00,
              and the public offering time is to be determined. Limit 1 per
              address, and the offering price is 0.05ETH.
            </span>
            <span class="abouttxt1">
              About&nbsp;the&nbsp;CrypNote&nbsp;NFT&nbsp;whitelist
            </span>
            <span class="aboutword3 dont-break-out" style="line-height: 25px">
              The total number of NFTs is 1024: the number of whitelists is 124,
              including team members, early community volunteers, and
              participants in Discord and Twitter activities; the rest are
              through public sale, which is 900.
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="bottom" class="justify-center flex-col">
    <div class="flex-row">
      <router-link :to="{ path: '/home' }">
        <img id="lb" src="../../assets/img/lb@2x.png" />
      </router-link>
      <a href="https://twitter.com/crypnoteio" target="_blank"
        ><img
          class="img2"
          referrerpolicy="no-referrer"
          src="../../assets/img/rb01@2x.png"
      /></a>
      <a href="https://discord.gg/KDgQHnFNXZ" target="_blank"
        ><img
          class="pic5"
          referrerpolicy="no-referrer"
          src="../../assets/img/rb02@2x.png"
      /></a>
      <a href="https://opensea.io/collection/crypnote" target="_blank"
        ><img
          class="pic6"
          referrerpolicy="no-referrer"
          src="../../assets/img/rb03@2x.png"
      /></a>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import Web3 from "web3";
import { ElMessageBox } from "element-plus";
export default defineComponent({
  name: "NFT_About",
  setup() {
    let isConnected = ref(false);
    const connectWallet = async (connect) => {
      if (window.ethereum == null && window.web3 == null) {
        if (connect) {
          ElMessageBox.alert("Please install MetaMask", "Warning", {
            confirmButtonText: "OK",
          });
        }
      } else {
        if (window.ethereum) {
          try {
            await window.ethereum.enable();
            window.ethereum.on("chainChanged", (chainId) => {
              history.go(0);
            });
            window.ethereum.on("accountsChanged", (chainId) => {
              history.go(0);
            });
            if (window.ethereum.networkVersion != "1") {
              if (connect) {
                ElMessageBox.alert(
                  "Please connect MetaMask to the ETH network, otherwise you will not be able to use this website properly",
                  "Warning",
                  {
                    confirmButtonText: "OK",
                  }
                );
              }
            } else {
              const web3 = new Web3(window.ethereum);
              let accountMost = "";
              web3.eth.getAccounts().then((accounts) => {
                accountMost = accounts[0];
                isConnected.value = true;
              });
            }
          } catch (error) {
            if (connect) {
              ElMessageBox.alert(
                "The failure of MetaMask authorization will make it impossible for you to use this website normally.",
                "Warning",
                {
                  confirmButtonText: "OK",
                }
              );
            }
            return;
          }
        }
      }
    };
    return {
      connectWallet,
      isConnected,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../../assets/style/Main/Common.scss";
@import "../../assets/style/Main/About.scss";
</style>