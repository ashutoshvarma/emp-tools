import { ethers } from "ethers";
// import ExpiringMultiPartyArtifact from "@uma/core/build/contracts/ExpiringMultiParty.json";
import { parseFixed } from "@ethersproject/bignumber";
import { getAbi } from "./getAbi";
import { hexConcat } from "@ethersproject/bytes";

// import { EthereumAddress } from "../types";

const TAG = "0x6565F48dEDb329c19BD499828c1e6957BfEaDaA7";
const ExpiringMultiPartyABI = getAbi("EMP");

export const encodeCreateFunction = (
  collateralToSend: number,
  tokensToCreate: number,
  collateralDecimals: number,
  tokenDecimals: number
) => {
  const emp = new ethers.utils.Interface(ExpiringMultiPartyABI);
  return emp.encodeFunctionData("create", [
    { rawValue: parseFixed(`${collateralToSend}`, collateralDecimals) },
    { rawValue: parseFixed(`${tokensToCreate}`, tokenDecimals) },
  ]);
};

// This takes encoded data field and just appends the tag, tag must be valid hex
export const getTaggedData = (
  collateralToSend: number,
  tokensToCreate: number,
  collateralDecimals: number,
  tokenDecimals: number
) => {
  const encodedCreateFunctionData = encodeCreateFunction(
    collateralToSend,
    tokensToCreate,
    collateralDecimals,
    tokenDecimals
  );
  return hexConcat([encodedCreateFunctionData, TAG]);
};

export const makeTransaction = (
  from: string,
  empAddress: string,
  data: string
) => {
  return {
    from,
    to: empAddress,
    data,
  };
};
