import { NETWORK, VFT_IDL } from "@/containers/router_sdk/constants";
import SailsCalls from "@/containers/router_sdk/SailsCalls";

export const getBalanceToken = async (contractID: string, address: string) => {

  const vft_sails = await SailsCalls.new({
    network: NETWORK,
    idl: VFT_IDL,
    contractId: contractID as `0x${string}`,
  });

  const response = await vft_sails.query('Vft/BalanceOf', {
    callArguments: [
      address
    ]
  });
  const balance_string = BigInt(response?.toString())?.toString() || '0'
  return balance_string
}