import { createContainer } from "unstated-next";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import uma from "@studydefi/money-legos/uma";
import { getAbi } from "../utils/getAbi";

import EmpAddress from "./EmpAddress";
import Connection from "./Connection";

function useContract() {
  const { signer } = Connection.useContainer();
  const { empAddress, isValid } = EmpAddress.useContainer();
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (empAddress === null) {
      setContract(null);
    }
    if (empAddress && isValid && signer) {
      const instance = new ethers.Contract(empAddress, getAbi("EMP"), signer);
      setContract(instance);
    }
  }, [empAddress, isValid, signer]);

  return { contract };
}

const Contract = createContainer(useContract);

export default Contract;
