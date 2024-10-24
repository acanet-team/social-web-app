import contracts from "@/web3/contracts";
import type { Chain } from "@web3-onboard/common";
import type { ConnectedChain, WalletState } from "@web3-onboard/core";
import { useConnectWallet, useSetChain, useWallets } from "@web3-onboard/react";
import { ethers } from "ethers";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import rateAbi from "@/web3/abi/rate.json";
import communityAbi from "@/web3/abi/community.json";
import donateAbi from "@/web3/abi/donate.json";
import nftAbi from "@/web3/abi/nft.json";
import nftMarketAbi from "@/web3/abi/nft-market.json";
import airdrop from "@/web3/abi/airDrop.json";
import { useSession } from "next-auth/react";
import { updateWalletAddress } from "@/api/wallet";
import { set } from "zod";

interface WalletContextType {
  chains: Chain[];
  connectedChain: ConnectedChain | null;
  setChain: (options: any) => Promise<boolean>;
  wallet: WalletState | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  connectedWallets: WalletState[];
  account: Account | null;
  setAccount: React.Dispatch<React.SetStateAction<Account | null>>;
  provider: ethers.providers.Web3Provider | null | undefined;
  setProvider: React.Dispatch<
    React.SetStateAction<ethers.providers.Web3Provider | null | undefined>
  >;
  signer: any;
  rateContract: any;
  communityContract: any;
  donateContract: any;
  nftContract: any;
  nftMarketContract: any;
  airDropContract: any;
}

export interface Account {
  address: string;
  ens: { name?: string; avatar?: string };
  balance: Record<string, string> | null;
}

const getContract = (abi: any, address: string, signer: any) => {
  const contract = new ethers.Contract(address, abi, signer);
  return contract;
};

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined,
);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [
    {
      chains, // the list of chains that web3-onboard was initialized with
      connectedChain, // the current chain the user's wallet is connected to
      settingChain, // boolean indicating if the chain is in the process of being set
    },
    setChain, // function to call to initiate user to switch chains in their wallet
  ] = useSetChain();

  const [
    {
      wallet, // the wallet that has been connected or null if not yet connected
      connecting, // boolean indicating if connection is in progress
    },
    connect, // function to call to initiate user to connect wallet
    disconnect, // function to call to with wallet<DisconnectOptions> to disconnect wallet
  ] = useConnectWallet();
  const connectedWallets = useWallets();
  const [account, setAccount] = useState<Account | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const { data: session, update } = useSession();
  const [provider, setProvider] = useState<any>(
    new ethers.providers.JsonRpcProvider(chains[0]?.rpcUrl as string),
  );

  const [rateContract, setRateContract] = useState<any>(
    new ethers.Contract(
      contracts.Rate["0x61"] as string,
      rateAbi as any,
      provider,
    ),
  );

  const [communityContract, setCommunityContract] = useState<any>(
    new ethers.Contract(
      contracts.Community["0x61"] as string,
      communityAbi as any,
      provider,
    ),
  );

  const [donateContract, setDonateContract] = useState<any>(
    new ethers.Contract(
      contracts.Donate["0x61"] as string,
      donateAbi as any,
      provider,
    ),
  );

  const [nftContract, setNftContract] = useState<any>(
    new ethers.Contract(
      contracts.Nft["0x61"] as string,
      nftAbi as any,
      provider,
    ),
  );

  const [nftMarketContract, setNftMarketContract] = useState<any>(
    new ethers.Contract(
      contracts.NftMarket["0x61"] as string,
      nftMarketAbi as any,
      provider,
    ),
  );

  const [airDropContract, setAirDropContract] = useState<any>(
    new ethers.Contract(
      contracts.Airdrop["0x61"] as string,
      airdrop as any,
      provider,
    ),
  );

  const updateUserWalletAddress = (address: string) => {
    // Update address in DB
    updateWalletAddress(address);
    // Update wallet address in session
    update({
      ...session,
      user: {
        ...session?.user,
        wallet_address: address,
      },
    });
  };

  useEffect(() => {
    if (connectedChain) {
      const rate = new ethers.Contract(
        contracts.Rate[connectedChain?.id] as string,
        rateAbi as any,
        signer || provider,
      );
      setRateContract(rate);
      const community = new ethers.Contract(
        contracts.Community[connectedChain?.id] as string,
        communityAbi as any,
        signer || provider,
      );
      setCommunityContract(community);

      const donate = new ethers.Contract(
        contracts.Donate[connectedChain?.id] as string,
        donateAbi as any,
        signer || provider,
      );
      setDonateContract(donate);

      const nft = new ethers.Contract(
        contracts.Nft[connectedChain?.id] as string,
        nftAbi as any,
        signer || provider,
      );
      setNftContract(nft);

      const nftMarket = new ethers.Contract(
        contracts.NftMarket[connectedChain?.id] as string,
        nftMarketAbi as any,
        signer || provider,
      );
      setNftMarketContract(nftMarket);

      const airDrop = new ethers.Contract(
        contracts.Airdrop[connectedChain?.id] as string,
        airdrop as any,
        signer || provider,
      );
      setAirDropContract(airDrop);
    }
  }, [provider, signer, connectedChain]);

  useEffect(() => {
    // If `wallet` is defined then the user is connected
    // console.log('waaa', wallet);
    if (!wallet) {
      setAccount(null);
      return;
    }
    if (wallet) {
      const { name, avatar }: any = wallet?.accounts?.[0]?.ens ?? {};
      setAccount({
        address: wallet?.accounts?.[0]?.address as string,
        balance: wallet?.accounts[0]?.balance as any,
        ens: { name, avatar: avatar?.url },
      });
      // if user has no wallet address in DB
      if (!session?.user?.walletAddress) {
        updateUserWalletAddress(wallet?.accounts?.[0]?.address as string);
      }
    }
  }, [wallet]);

  useEffect(() => {
    if (wallet?.provider) {
      setChain({ chainId: wallet.chains[0]?.id as string });
      setProvider(new ethers.providers.Web3Provider(wallet.provider, "any"));
      (document.querySelector("onboard-v2") as any).shadowRoot.append(
        Object.assign(document.createElement("STYLE"), {
          innerText: `.powered-by-container {display:none;}`,
        }),
      );
    }
  }, [wallet]);

  const connectWallet = () => {
    if (account) {
      return;
    }
    connect({});
    setTimeout(() => {
      (document.querySelector("onboard-v2") as any).shadowRoot.append(
        Object.assign(document.createElement("STYLE"), {
          innerText: `.sidebar div:not([class]) {display:none !important;}`,
        }),
      );
      // const aaa = document.querySelector("img.svelte-obaru3");
      // console.log('mm', aaa);
      // (document.querySelector(".svelte-obaru3") as HTMLImageElement).append(
      //   Object.assign(document.createElement("STYLE"), {
      //     innerText: `{
      //       object-fit: contain;
      //       margin-left: -15px;
      //     }`,
      //   }),
      // );
    });
  };

  const disconnectWallet = () => {
    if (wallet?.label) {
      disconnect({ label: wallet?.label });
      setAccount(null);
    }
  };

  useEffect(() => {
    setSigner(provider?.getSigner());
  }, [provider]);

  return (
    <WalletContext.Provider
      value={{
        chains,
        connectedChain,
        setChain,
        wallet,
        connectWallet,
        disconnectWallet,
        connectedWallets,
        account,
        setAccount,
        provider,
        setProvider,
        signer,
        rateContract,
        communityContract,
        donateContract,
        nftContract,
        nftMarketContract,
        airDropContract,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWeb3 = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWeb3 must be used within a WalletProvider");
  }
  return context;
};
