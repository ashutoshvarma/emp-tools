// Export contracts in the form [address, type, version]
// See getAbi file for full list of versions and types available
export type ContractArguments = [string, string, string];
export const Contracts: { [networkId: number]: ContractArguments[] } = {
  1: [
    ["0x02bD62088A02668F29102B06E4925791Cd0fe4C5", "EMP", "1"], // UMAc35-0421
  ],
  42: [
    ["0x2B7dF40F8828B5c3E91b74C411186D1FA6f3E94F", "EMP", "1"], // // kUMAc35-0421
    ["0xdB9C99870Ab025dB4939996463DA5dfCB1C0D585", "EMP", "1"], // expired
  ],
};
