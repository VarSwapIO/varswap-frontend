import { CONTRACT_DATA, LPR_IDL, NETWORK, VFT_IDL } from "@/containers/router_sdk/constants";
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

export const getPoolLiquidityByUser = async (user_address: string) => {
  const router_sails = await SailsCalls.new({
    network: NETWORK,
    idl: CONTRACT_DATA.idl,
    contractId: CONTRACT_DATA.programId,
  });

  const response = await router_sails.query('RouterService/GetLiquidityJoin', {
    callArguments: [
      user_address
    ]
  });
  return response || []
}

export const getBalanceLP = async (contractID: string, address: string) => {

  const lpr_sails = await SailsCalls.new({
    network: NETWORK,
    idl: LPR_IDL,
    contractId: contractID as `0x${string}`,
  });

  const response = await lpr_sails.query('LpService/BalanceOf', {
    callArguments: [
      address
    ]
  });
  const balance_string = BigInt(response?.toString())?.toString() || '0'
  return balance_string
}

export const getLPMetadata = async (lp_address: string) => {
  const lpr_sails = await SailsCalls.new({
    network: NETWORK,
    idl: LPR_IDL,
    contractId: lp_address as `0x${string}`,
  });
  const [name, symbol, decimals] = await Promise.all([
    lpr_sails.query('LpService/Name', {
      callArguments: [
      ]
    }),
    lpr_sails.query('LpService/Symbol', {
      callArguments: [
      ]
    }),
    lpr_sails.query('LpService/Decimals', {
      callArguments: [
      ]
    })
  ])
  if (!!name && !!symbol && !!decimals) {
    return {
      icon: '/images/features/image-placeholder.png',
      symbol: symbol,
      name: name,
      decimals: decimals,
      address: lp_address
    }
  }
  return undefined
}

export const getTokenMetadata = async (contractID: string) => {
  if (!contractID) return;
  const vft_sails = await SailsCalls.new({
    network: NETWORK,
    idl: VFT_IDL,
    contractId: contractID as `0x${string}`,
  });

  const [name, symbol, decimals] = await Promise.all([
    vft_sails.query('Vft/Name', {
      callArguments: [
      ]
    }),
    vft_sails.query('Vft/Symbol', {
      callArguments: [
      ]
    }),
    vft_sails.query('Vft/Decimals', {
      callArguments: [
      ]
    })
  ])

  if (!!name && !!symbol && !!decimals) {
    return {
      icon: '/images/features/image-placeholder.png',
      symbol: symbol,
      name: name,
      decimals: decimals,
      address: contractID
    }
  }
  return undefined
}

// export const getAllListToken = async() => {

// }

