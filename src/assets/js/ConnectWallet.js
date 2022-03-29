import store from '../../store'
import { savewallet } from "@/actions/api";
import { postData } from "@/actions/index";
import Web3 from "web3";
import OnlyMessage from "./onlyMsgbox"
import { ElMessageBox } from 'element-plus';
import { getCookie } from "@/assets/js/Common"
export const connectWallet = async (path) => {

  const apptoken = getCookie("apptoken");
  const address = store.state.userInfo?.walletAddress;
  if (apptoken) {
    if (window.ethereum == null && window.web3 == null) {
      
      if (path.indexOf('/dashboard') == -1) {
        OnlyMessage.error(
        "Please install the MetaMask browser plug-in and Refresh the current page"
      );
      } else {
        ElMessageBox.alert('Please install the MetaMask browser plug-in and Refresh the current page', 'Waring', {
          confirmButtonText: 'OK',
          callback: () => {
            window.open("metamask.io","_blank")
          },
        })
      }
     
      store.dispatch("set_wallet", null);
      store.dispatch("set_walletAddr", null);
    } else {
      if (window.ethereum) {
        try {
          await window.ethereum.enable();
          window.ethereum.on("chainChanged", (chainId) => {
            window.location.reload();
          });
          window.ethereum.on("accountsChanged", (aa) => {
              store.dispatch("set_wallet", null);
              store.dispatch("set_walletAddr", null);
            window.location.reload();
          });
          ethereum.on("networkChanged", (networkIDstring) => {
            window.location.reload();
          });
          ethereum.on("disconnect", () => {
            window.location.reload();
          });
            const web3 = new Web3(window.ethereum);
            let accountMost = "";
            web3.eth.getAccounts().then((accounts) => {
              accountMost = accounts[0];
              const account =
                accounts[0].substring(0, 6) +
                "..." +
                accounts[0].substring(accounts[0].length - 3);
                store.dispatch("set_wallet", account);
                store.dispatch("set_walletAddr", accountMost);
             

              if (address == "") {
                postData(savewallet, {
                  apptoken: apptoken,
                  walletAddress: accountMost.toLowerCase(),
                })
                  .then((savewalletResource) => {
                    if (savewalletResource.success) {
                      let userInfo = store.state.userInfo;
                      userInfo.walletAddress = accountMost;
                      store.dispatch('set_userInfo',userInfo)
                    } else {
                      OnlyMessage.success(savewalletResource.msg);
                    }
                  })
                  .catch((error) => {
                    OnlyMessage.error(error);
                  });
              }
             
         
            });
        } catch (error) {
          console.log(error);
          OnlyMessage.error(
            "The failure of MetaMask authorization will prevent you from using this website normally"
          );
        }
      }
    }
  }
 }
