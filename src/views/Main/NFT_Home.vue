<!-- author: nico -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: nft -->
<template>
  <div id="ct">
    <div id="mainHome">
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
        <div class="wrap4home flex-col">
          <div class="layer3 flex-col">
            <span class="info1">https://www.crypnote.io</span>
          </div>
          <div class="box2 flex-col">
            <img src="../../assets/img/CrypNote-NFTs-No-Frame.gif" />
          </div>
          <div class="box1 flex-col">
            <div
              class="layer4 flex-row justify-between"
              style="height: 26.1rem"
            >
              <div class="bd1 flex-col"></div>
              <div class="bd2 flex-col">
                <div class="infoBox2 dont-break-out" style="height: 100%">
                  <p>
                    The total number of CrypNote Genesis NFT is 1024, produced
                    by the CrypNote design team. Mint your unique NFT now.
                  </p>
                  <p>
                    CrypNote is a decentralised, encrypted permanent storage
                    note and collaboration platform. Through on-chain encrypted
                    storage to achieve content privacy, content sharing, editing
                    and collaboration, content ownership, content interaction,
                    aiming to build a web3, DAO infrastructure.
                  </p>
                </div>
              </div>
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
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import Web3 from "web3";
import { ElMessageBox } from "element-plus";
export default defineComponent({
  name: "NFT_Home",
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
      isConnected,
      connectWallet,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../../assets/style/Main/Common.scss";
@import "../../assets/style/Main/Home.scss";
</style>