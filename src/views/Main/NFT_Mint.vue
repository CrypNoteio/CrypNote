<!-- author: nico -->
<!-- date: 2022-02-23 13:31:28 -->
<!-- description: nft -->
<template>
  <div id="ct">
    <div id="mainMint">
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
        <div class="wrap4mint flex-col">
          <div class="layer3 flex-col">
            <span class="txt11">MINT.EXE</span>
          </div>
          <div class="box2mint flex-col">
            <img
              src="../../assets/img/CrypNote-NFTs-No-Frame.gif"
              v-if="!mintSuccess"
            />
            <img :src="nftImg" v-else />
          </div>
          <div class="box1 flex-col">
            <div class="section4 flex-col"></div>
            <div class="section5mint flex-col" v-if="mintSuccess">
              <div class="CRYPNOTENFT">CRYPNOTE NFT</div>
              <div class="common_class">JOIN THE DISCORD</div>
              <div class="link">
                <a href="https://discord.com/invite/SnZrf2X953"
                  >https://discord.com/invite/SnZrf2X953</a
                >
              </div>
              <div class="common_class">
                JOIN THE MAILING LIST FOR THE INVITATION CODE TO BE ISSUED.
              </div>
              <div class="email-input">
                <input
                  class="Email-intput"
                  v-model="Email"
                  placeholder="Enter your E-mail"
                />
              </div>
              <div class="sendEmailBtn">
                <img
                  src="../../assets/img/sendEmailBtn.png"
                  @click="sendEmail"
                />
              </div>
              <div class="common_class" style="text-align: center">
                AVAILABLE: {{ currentNum }} / 1024
              </div>
            </div>
            <div class="section5mint flex-col" v-else>
              <div class="main22 flex-row justify-between">
                <div class="bd11">
                  <span class="infoBox22">
                    Legendary
                    <br />
                    Epic
                    <br />
                  </span>
                  <span class="word44">rare</span>
                  <span class="paragraph11">
                    <br />
                    Common
                  </span>
                  <span class="paragraph11">Total</span>
                </div>
                <div class="bd22">
                  <span class="word55"></span>
                  <span class="info22">4</span>
                  <span class="infoBox33">
                    <br />
                  </span>
                  <span class="info33">32</span>
                  <span class="paragraph22">
                    <br />
                  </span>
                  <span class="txt33">96</span>
                  <span class="infoBox44">
                    <br />
                  </span>
                  <span class="txt44">892</span>
                  <span class="infoBox44">
                    <br />
                  </span>
                  <span class="paragraph22">{{ currentNum }}/1024</span>
                </div>
              </div>
              <div v-if="!soldOut">
                <textarea
                  class="main33 flex-col"
                  v-model="saysoming"
                  placeholder="Customize your words，25 Characters limited"
                  minlength="2"
                  maxlength="25"
                ></textarea>
                <img
                  src="../../assets/img/mintbutton@2x.png"
                  class="main44img"
                  @click="mint"
                  v-if="!isMint"
                />
                <div v-else class="minting">MINTING....</div>
              </div>
              <div v-else>
                <div
                  class="main33 flex-col"
                  style="line-height: 6.5rem"
                  v-if="!isMint"
                >
                  Sold Out!
                </div>
                <div class="viewOnOpensea">
                  <a
                    href="https://opensea.io/collection/crypnote"
                    target="_blank"
                    >View on Opensea</a
                  >
                </div>
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
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import Web3 from "web3";
import nft from "../../assets/js/nft.json";
import { postData } from "../../actions/index";
import { ElMessageBox, ElMessage } from "element-plus";
import OnlyMessage from "@/assets/js/onlyMsgbox";
import load from "load-json-xhr";
export default defineComponent({
  name: "NFT_Mint",
  setup() {
    let isConnected = ref(false);
    let saysoming = ref("");
    let isMint = ref(false);
    let mintSuccess = ref(false);
    let walletAddress = "";
    let soldOut = ref(false);
    let currentNum = ref(0);
    let Email = ref("");
    let nftImg = ref(require("../../assets/img/default.gif"));
    let Contract = "0xa9f6446d5a3eec75a77e9330070d500409151e82";

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
                walletAddress = accounts[0];
                isConnected.value = true;
                const instance = new web3.eth.Contract(nft.abi, Contract);

                instance.methods
                  .tokenId()
                  .call()
                  .then((tokenId) => {
                    currentNum.value = tokenId;
                    if (tokenId >= 1024) {
                      soldOut.value = true;
                    }
                  })
                  .catch((error) => {});

                instance.methods
                  .balanceOf(walletAddress)
                  .call()
                  .then((amount) => {
                    if (amount > 0) {
                      mintSuccess.value = true;
                      for (var i = 0; i < parseInt(amount); i++) {
                        instance.methods
                          .tokenOfOwnerByIndex(walletAddress, i)
                          .call()
                          .then((tokenId) => {
                            instance.methods
                              .tokenURI(tokenId)
                              .call()
                              .then((uri) => {
                                load(uri, function (err, data) {
                                  if (err) throw err;
                                  nftImg.value = data.image;
                                });
                              })
                              .catch((tokenIderror) => {
                                ElMessage.warning(tokenIderror);
                              });
                          })
                          .catch((error) => {
                            ElMessage.warning(error);
                          });
                      }
                    }
                  });
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

    const mint = () => {
      connectWallet(true);
      const web3 = new Web3(window.ethereum);
      const instance = new web3.eth.Contract(nft.abi, Contract);
      instance.methods
        .tokenId()
        .call()
        .then((tokenId) => {
          if (tokenId == 124) {
            OnlyMessage.error("The CrypNote NFTs of Whitelist are sold out!");
            return;
          }
        })
        .catch((error) => {});
      postData(
        "https://crypnote.io/api/checkwhite.do?walletAddress=" + walletAddress,
        null
      )
        .then((result) => {
          if (result.success) {
            if (!result.data.result) {
              OnlyMessage.error(
                "The address of your wallet is not on the whitelist."
              );
              return;
            } else {
              if (!saysoming.value) {
                OnlyMessage.error(
                  "Customize your words，25 Characters limited"
                );
                return;
              }
              if (/[^\A-Za-z\ \.\,\!\?\@]/g.test(saysoming.value)) {
                OnlyMessage.error(
                  "Customize your words，25 Characters limited"
                );
                return;
              }
              isMint.value = true;
              const parmas = {
                content: saysoming.value.toUpperCase(),
                walletAddress,
              };
              postData("https://crypnote.io/api/backup.do", parmas).then(
                (backupRes) => {
                  console.log("backupRes===", backupRes);
                }
              );
              instance.methods
                .mint()
                .send({
                  from: walletAddress,
                  to: Contract,
                  value: web3.utils.toWei("0.05", "ether"),
                })
                .then((result) => {
                  getTransactionResult(
                    result.transactionHash,
                    instance,
                    walletAddress
                  );
                })
                .catch((error) => {
                  isMint.value = false;
                  saysoming.value = "";
                  OnlyMessage.error("Minting Failure");
                });
            }
          } else {
            OnlyMessage.error(result.msg);
          }
        })
        .catch((error) => {
          OnlyMessage.error("error");
        });
    };

    const getTransactionResult = (transactionHash, instance, walletAddress) => {
      const web3 = new Web3(window.ethereum);
      web3.eth
        .getTransactionReceipt(transactionHash)
        .then((transactionResult) => {
          if (transactionResult == null) {
            setTimeout(() => {
              getTransactionResult(transactionHash, instance, walletAddress);
            }, 3000);
          } else {
            if (transactionResult.status) {
              instance.methods
                .balanceOf(walletAddress)
                .call()
                .then((amount) => {
                  for (var i = 0; i < parseInt(amount); i++) {
                    instance.methods
                      .tokenOfOwnerByIndex(walletAddress, i)
                      .call()
                      .then((tokenId) => {
                        const parmas = {
                          content: saysoming.value.toUpperCase(),
                          tokenId,
                          walletAddress,
                        };
                        createNft(parmas, instance, tokenId);
                        saysoming.value = "";
                      })
                      .catch((tokenIderror) => {
                        isMint.value = false;
                        saysoming.value = "";
                      });
                  }
                });
            } else {
              isMint.value = false;
              OnlyMessage.error("Minting Failure");
            }
          }
        });
    };
    const sendEmail = () => {
      if (!Email.value) {
        OnlyMessage.error("Please enter your E-mail");
        return;
      }
      const emailReg =
        /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
      if (!emailReg.test(Email.value)) {
        OnlyMessage.error("Incorrect E-mail format");
        return;
      }
      postData(
        "https://crypnote.io/api/saveEmail.do?Email=" + Email.value,
        null
      )
        .then((result) => {
          OnlyMessage.success("E-mail submitted successfully");
          Email.value = "";
        })
        .catch((error) => {
          OnlyMessage.error("error");
        });
    };

    const createNft = (parmas, instance, tokenId) => {
      postData("https://crypnote.io/api/createnft.do", parmas)
        .then((result) => {
          if (result.success) {
            loadURI(instance, tokenId);
          } else {
            setTimeout(() => {
              createNft(parmas, instance, tokenId);
            }, 3000);
          }
        })
        .catch((error) => {
          setTimeout(() => {
            createNft(parmas, instance, tokenId);
          }, 3000);
        });
    };

    const loadURI = (instance, tokenId) => {
      instance.methods
        .tokenURI(tokenId)
        .call()
        .then((uri) => {
          load(uri, function (err, data) {
            if (err) {
              setTimeout(() => {
                loadURI(instance, tokenId);
              }, 3000);
            } else {
              nftImg.value = data.image;
              mintSuccess.value = true;
              currentNum.value++;
              isMint.value = true;
              OnlyMessage.success("Mint successfully");
            }
          });
        })
        .catch((tokenIderror) => {
          isMint.value = false;
          saysoming.value = "";
          setTimeout(() => {
            loadURI(instance, tokenId);
          }, 3000);
        });
    };
    onMounted(() => {
      connectWallet();
    });
    return {
      connectWallet,
      isConnected,
      mint,
      isMint,
      saysoming,
      mintSuccess,
      soldOut,
      currentNum,
      Email,
      sendEmail,
      nftImg,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../../assets/style/Main/Common.scss";
@import "../../assets/style/Main/Mint.scss";
</style>