import { HexString } from '@gear-js/api'
import { Percent } from './core'
import JSBI from 'jsbi'

/**
 * @deprecated use FACTORY_ADDRESS_MAP instead
 */
export const FACTORY_ADDRESS = '0x69cc707ff2d0fc3a98b4af00a0caa25a6abd6f91256b6d58c9f11dd00b4e7923'
export const ROUTER_ADDRESS = '0x798a886f135d199e560f835132dc80fb9f9227aeb1a71c29e5a76e0f044cc46e'
export const NETWORK = 'wss://testnet-archive.vara.network'

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

interface ContractSails {
    programId: HexString,
    idl: string
}


export const VFT_IDL = `
  constructor {
  New : (name: str, symbol: str, decimals: u8);
};

service Vft {
  Deposit : () -> bool;
  Withdraw : (value: u256) -> bool;
  Approve : (spender: actor_id, value: u256) -> bool;
  Transfer : (to: actor_id, value: u256) -> bool;
  TransferFrom : (from: actor_id, to: actor_id, value: u256) -> bool;
  query Allowance : (owner: actor_id, spender: actor_id) -> u256;
  query BalanceOf : (account: actor_id) -> u256;
  query Decimals : () -> u8;
  query Name : () -> str;
  query Symbol : () -> str;
  query TotalSupply : () -> u256;

  events {
    Deposit: struct { dst: actor_id, wad: u256 };
    Withdraw: struct { src: actor_id, wad: u256 };
    Approval: struct { owner: actor_id, spender: actor_id, value: u256 };
    Transfer: struct { from: actor_id, to: actor_id, value: u256 };
  }
};
`
export const LPR_IDL = `
constructor {
  New : (factory: actor_id, token_a: actor_id, token_b: actor_id, name: str, symbol: str, decimals: u8);
};

service LpService {
  Burn : (to: actor_id) -> result (struct { u256, u256 }, LpError);
  Mint : (to: actor_id) -> result (u256, LpError);
  Skim : (to: actor_id) -> result (null, LpError);
  Swap : (amount0_out: u256, amount1_out: u256, to: actor_id) -> result (null, LpError);
  Sync : () -> result (null, LpError);
  Approve : (spender: actor_id, value: u256) -> bool;
  Transfer : (to: actor_id, value: u256) -> bool;
  TransferFrom : (from: actor_id, to: actor_id, value: u256) -> bool;
  query GetReserves : () -> struct { u256, u256, u64 };
  query Allowance : (owner: actor_id, spender: actor_id) -> u256;
  query BalanceOf : (account: actor_id) -> u256;
  query Decimals : () -> u8;
  query Name : () -> str;
  query Symbol : () -> str;
  query TotalSupply : () -> u256;

  events {
    Mint: struct { sender: actor_id, amount: struct { u256, u256 } };
    Burn: struct { sender: actor_id, amount: struct { u256, u256 }, to: actor_id };
    Swap: struct { sender: actor_id, amount_in: struct { u256, u256 }, amount_out: struct { u256, u256 }, to: actor_id };
    GetReserves: struct { reserve_a: u128, reserve_b: u128, block_timestamp_last: u64 };
    Sync: struct { reserve_a: u256, reserve_b: u256 };
    Skim: struct { amount_a: u256, amount_b: u256, to: actor_id };
    Approval: struct { owner: actor_id, spender: actor_id, value: u256 };
    Transfer: struct { from: actor_id, to: actor_id, value: u256 };
  }
};
`

export const CONTRACT_DATA: ContractSails = {
    programId: ROUTER_ADDRESS,
    idl: `type RouterError = enum {
  PairAlreadyExists,
  TransferLiquidityFailed,
  TransferFromLiquidityFailed,
  TransferFromFailed,
  InsufficientFee,
  BurnLiquidityFailed,
  InsufficientVaraAmount,
  InsufficientTokenAmount,
  CreatePairFailed,
  WithdrawWvaraFailed,
  DepositWVARAFailed,
  SwapFailed,
  MintLiquidityFailed,
  Expired,
  PairNotFound,
  IdenticalAddresses,
  ZeroAddress,
  InsufficientBAmount,
  InsufficientAAmount,
  InsufficientLiquidity,
  InvalidPath,
  InsufficientOutputAmount,
  InsufficientInputAmount,
  InvalidLiquidityAmount,
  ExcessiveInputAmount,
  TransferFailed,
};

constructor {
  New : (factory: actor_id, wvara: actor_id);
};

service RouterService {
  AddLiquidity : (token_a: actor_id, token_b: actor_id, amount_a_desired: u256, amount_b_desired: u256, amount_a_min: u256, amount_b_min: u256, to: actor_id, deadline: u64) -> result (struct { u256, u256, u256 }, RouterError);
  AddLiquidityVara : (token: actor_id, amount_token_desired: u256, amount_token_min: u256, amount_vara_min: u256, to: actor_id, deadline: u64) -> result (struct { u256, u256, u256 }, RouterError);
  CreatePair : (token_a: actor_id, token_b: actor_id) -> result (null, RouterError);
  RemoveLiquidity : (token_a: actor_id, token_b: actor_id, liquidity: u256, amount_a_min: u256, amount_b_min: u256, to: actor_id, deadline: u64) -> result (struct { u256, u256 }, RouterError);
  RemoveLiquidityVara : (token: actor_id, liquidity: u256, amount_token_min: u256, amount_vara_min: u256, to: actor_id, deadline: u64) -> result (struct { u256, u256 }, RouterError);
  SwapExactTokensForTokens : (amount_in: u256, amount_out_min: u256, path: vec actor_id, to: actor_id, deadline: u64) -> result (vec u256, RouterError);
  SwapExactTokensForVara : (amount_in: u256, amount_out_min: u256, path: vec actor_id, to: actor_id, deadline: u64) -> result (vec u256, RouterError);
  SwapExactVaraForTokens : (amount_out_min: u256, path: vec actor_id, to: actor_id, deadline: u64) -> result (vec u256, RouterError);
  SwapTokensForExactTokens : (amount_out: u256, amount_in_max: u256, path: vec actor_id, to: actor_id, deadline: u64) -> result (vec u256, RouterError);
  SwapTokensForExactVara : (amount_out: u256, amount_in_max: u256, path: vec actor_id, to: actor_id, deadline: u64) -> result (vec u256, RouterError);
  SwapVaraForExactTokens : (amount_out: u256, path: vec actor_id, to: actor_id, deadline: u64) -> result (vec u256, RouterError);
  TransferFromLiquidity : (pair: actor_id, from: actor_id, to: actor_id, liquidity: u256) -> result (null, RouterError);
  TransferLiquidity : (pair: actor_id, to: actor_id, liquidity: u256) -> result (null, RouterError);
  query GetAmountIn : (amount_out: u256, reserve_in: u256, reserve_out: u256) -> result (u256, RouterError);
  query GetAmountOut : (amount_in: u256, reserve_in: u256, reserve_out: u256) -> result (u256, RouterError);
  query GetAmountsIn : (amount_out: u256, path: vec actor_id) -> result (vec u256, RouterError);
  query GetAmountsOut : (amount_in: u256, path: vec actor_id) -> result (vec u256, RouterError);
  query GetReserves : (token_a: actor_id, token_b: actor_id) -> result (struct { u256, u256, actor_id }, RouterError);
  query PairFor : (token_a: actor_id, token_b: actor_id) -> result (actor_id, RouterError);
  query Quote : (amount_a: u256, reserve_a: u256, reserve_b: u256) -> result (u256, RouterError);
  query SortTokens : (token_a: actor_id, token_b: actor_id) -> result (struct { actor_id, actor_id }, RouterError);

  events {
    CreatePair: struct { token_a: actor_id, token_b: actor_id, pair_address: actor_id };
    AddLiquidity: struct { token_a: actor_id, token_b: actor_id, amount_a: u256, amount_b: u256, to: actor_id, liquidity: u256 };
    AddLiquidityVARA: struct { token_a: actor_id, amount_a: u256, amount_vara: u256, to: actor_id, liquidity: u256 };
    RemoveLiquidity: struct { token_a: actor_id, token_b: actor_id, amount_a_received: u256, amount_b_received: u256, to: actor_id, liquidity: u256 };
    RemoveLiquidityVARA: struct { token_a: actor_id, amount_a_received: u256, amount_vara_received: u256, to: actor_id, liquidity: u256 };
    SwapExactTokensForTokens: struct { amount_in: u256, amount_out: u256, path: vec actor_id, to: actor_id };
    SwapTokensForExactTokens: struct { amount_out: u256, amount_in: u256, path: vec actor_id, to: actor_id };
    SwapExactVARAForTokens: struct { amount_in: u256, amount_out: u256, path: vec actor_id, to: actor_id };
    SwapTokensForExactVARA: struct { amount_out: u256, amount_in: u256, path: vec actor_id, to: actor_id };
    SwapExactTokensForVARA: struct { amount_in: u256, amount_out: u256, path: vec actor_id, to: actor_id };
    SwapVARAForExactTokens: struct { amount_out: u256, amount_in: u256, path: vec actor_id, to: actor_id };
  }
};

`
};

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const FIVE = JSBI.BigInt(5)
export const _997 = JSBI.BigInt(997)
export const _1000 = JSBI.BigInt(1000)
export const BASIS_POINTS = JSBI.BigInt(10000)

export const ZERO_PERCENT = new Percent(ZERO)
export const ONE_HUNDRED_PERCENT = new Percent(ONE)
export const BIPS_BASE = 10000
export const ONE_BIPS = new Percent(1, BIPS_BASE)

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(50, BIPS_BASE)