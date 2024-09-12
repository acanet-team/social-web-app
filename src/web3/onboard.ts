import coinbaseWalletModule from "@web3-onboard/coinbase";
import walletConnectModule from "@web3-onboard/walletconnect";
import injectedModule from "@web3-onboard/injected-wallets";
import { ethers } from "ethers";
import { truncateAddress, toHex } from "../utils/index";
import Onboard from "@web3-onboard/core";
import { init } from "@web3-onboard/react";

const coinbaseWalletSdk = coinbaseWalletModule();
const walletConnect = walletConnectModule({
  projectId: "fecbae3c128f3f1f51c5b3e72219074f",
});
const injected = injectedModule();

const modules = [coinbaseWalletSdk, walletConnect, injected];

const ETH_MAINNET_RPC_URL = `https://rpc.payload.de`;
const KLAYTN_MAINNET_URL = `Paste KLAYTN MAINNET URL`;
const KLAYTN_BAOBAB_URL = `Paste KLAYTN BAOBAB URL`;
const MOVE_RPC_URL = "https://mevm.devnet.imola.movementlabs.xyz";

export const initWeb3Onboard = () =>
  init({
    // An array of wallet modules that you would like to be presented to the user to select from when connecting a wallet.
    wallets: modules,
    // An array of Chains that your app supports
    chains: [
      {
        id: 30732,
        token: "MOVE",
        namespace: "evm",
        label: "MEVM",
        rpcUrl: MOVE_RPC_URL,
      },
      {
        id: "0x1",
        token: "ETH",
        namespace: "evm",
        label: "Ethereum Mainnet",
        rpcUrl: ETH_MAINNET_RPC_URL,
      },
    ],
    appMetadata: {
      name: "Acanet", // change to your dApp name
      icon: "/assets/images/logo/logo.png", // paste your icon
      logo: "/assets/images/logo/logo-horizontal-dark.png", // paste your logo
      description: "Acanet Social Network",
      recommendedInjectedWallets: [
        { name: "Coinbase", url: "https://wallet.coinbase.com/" },
        { name: "MetaMask", url: "https://metamask.io" },
      ],
    },
    theme: "light",
    connect: {
      autoConnectLastWallet: true,
      autoConnectAllPreviousWallet: true,
    },
  });
