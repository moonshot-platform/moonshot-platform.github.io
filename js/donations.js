"use strict";

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;

// Address of the selected account
let selectedAccount;

function init() {

  if(location.protocol !== 'https:') {
    return;
  }

  const providerOptions = {
    
    walletconnect: {
      package: WalletConnectProvider,
      options: {
      //  infuraId: "1a599aa8982747f7859dd4b8204178fd",
        rpc: {
          1: 'https://bsc-dataseed.binance.org/',
          56: 'https://bsc-dataseed.binance.org/',
        },
      }
    },

  };

  web3Modal = new Web3Modal(
    {
      theme: "dark",
      cacheProvider: false, // optional
      providerOptions, // required
      disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    }
  );

  web3Modal.updateTheme({
    background: "rgba(0, 0, 0, 0.5)",
    main: "rgb(199, 199, 199)",
    secondary: "rgb(136, 136, 136)",
    border: "rgba(195, 195, 195, 0.14)",
    hover: "rgb(16, 26, 32)"
  });


  console.log("Web3Modal instance is", web3Modal);
}

async function fetchAccountData() {

  const web3 = new Web3(provider);
  const chainId = await web3.eth.getChainId();
  const chainData = evmChains.getChain(chainId);
  document.querySelector("#network-name").textContent = chainData.name;
  const accounts = await web3.eth.getAccounts();
  selectedAccount = accounts[0];
  document.querySelector("#selected-account").textContent = selectedAccount;

  const accountContainer = document.querySelector("#accounts");
  accountContainer.innerHTML = '';



  // Display fully loaded UI for wallet data
  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#connected").style.display = "block";
  document.querySelector("#network").style.display = "block";
}


async function refreshAccountData() {

  document.querySelector("#connected").style.display = "block";
  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#network").style.display = "block";
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled")
}

async function makeDonation() {
  const web3 = new Web3(provider);
  
  let beneficiary = '0x9d8a5d6B405c2Eb7cee724F4B2F67a902F0f0864';
  var amountToDonate = document.querySelector("#amount").value;
  var textElem = document.querySelector("#thankyou");
  
  web3.eth.sendTransaction(
    {
      to: beneficiary,
      from: selectedAccount,
      value:  web3.utils.toWei(amountToDonate, "ether")
    },
    (error, result) => {
      if (error) {
   
        textElem.innerHTML = error.message;
        let a = document.getElementById("fail");
        
        a.currentTime = 0;
        a.loop = false;
        a.play();
       
        return console.error(error);
      }
        let a = document.getElementById("rocket");
        
        a.currentTime = 0;
        a.loop = false;
        a.play();
        textElem.innerHTML = "Liftoff! We have a liftoff!";
    }
  );

}

async function onConnect() {
  console.log("Connect");
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
}

async function onDisconnect() {

  if(provider.close) {
    await provider.close();
    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;

  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#network").style.display = "none";

}

async function onDonate() {

  console.log("Make a donation");

  await makeDonation();
}


window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
  document.querySelector("#btn-donate").addEventListener("click", onDonate);
});
