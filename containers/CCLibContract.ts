import { createContainer } from "unstated-next";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getAbi } from "../utils/getAbi";

import Connection from "./Connection";

// hardcoded address for now
const CCLIB_ADDRESS = new Map<string, string>();
CCLIB_ADDRESS.set("1", "0xb0A395D8F3ae483d757EC1c83eFFc61DF96eCfa4");

// type CContract = {
//   contract: ethers.Contract;
// };

function useContract() {
  const { signer, network } = Connection.useContainer();
  const [cclib, setCCLib] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (signer == null) {
      setCCLib(null);
      return;
    }
    let chainId = "1";
    if (network) {
      chainId = network.chainId.toString();
    }
    const cclibAddress = CCLIB_ADDRESS.get(chainId.toString());
    if (cclibAddress) {
      const instance = new ethers.Contract(cclibAddress, getAbi("CCLib"), signer);
      setCCLib(instance);
    }
  }, [network, signer]);

  return { cclib };
}

const Contract = createContainer(useContract);

export default Contract;
