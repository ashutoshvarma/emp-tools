import { createContainer } from "unstated-next";
import { useState, useEffect } from "react";
import { ethers, BigNumber, utils, BigNumberish } from "ethers";
import { weth } from "@studydefi/money-legos/erc20";

import Connection from "./Connection";

function useContract() {
  const {
    signer,
    address,
    block$,
    provider,
    network,
  } = Connection.useContainer();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [ethBalance, setEthBalance] = useState<BigNumberish | null>(null);
  const [wethBalance, setWethBalance] = useState<BigNumberish | null>(null);

  const getTokenInfo = async () => {
    if (contract && address) {
      // const wethBalanceRaw: BigNumber = await contract.balanceOf(address);
      const wethBalanceRaw: BigNumber = BigNumber.from(0);
      const wethBalance = utils.formatEther(wethBalanceRaw);
      setWethBalance(wethBalance);
    }

    if (provider && address) {
      const ethBalanceRaw: BigNumber = await provider.getBalance(address);
      const ethBalance = utils.formatEther(ethBalanceRaw);
      setEthBalance(ethBalance);
    }
  };

  // get token info when contract changes or when address is reset
  useEffect(() => {
    setWethBalance(null);
    setEthBalance(null);
    getTokenInfo();
  }, [contract, address, provider]);

  // get token info on each new block
  useEffect(() => {
    if (block$) {
      const sub = block$.subscribe(() => getTokenInfo());
      return () => sub.unsubscribe();
    }
  }, [block$, contract, address, provider]);

  useEffect(() => {
    if (signer && network) {
      const instance = new ethers.Contract(
        network.chainId === 42
          ? "0xd0a1e359811322d97991e03f863a0c30c2cf029c"
          : weth.address, // Uses Kovan WETH contract if on Kovan, otherwise Mainnet WETH contract
        weth.abi,
        signer
      );
      setContract(instance);
    }
  }, [signer, network]);

  return { contract, ethBalance, wethBalance };
}

const Contract = createContainer(useContract);

export default Contract;
