import { HexString } from '@gear-js/api'
import { Percent } from './core'
import JSBI from 'jsbi'
import { ENV_VARSWAP } from '@/config/env'

/**
 * @deprecated use FACTORY_ADDRESS_MAP instead
 */
export const FACTORY_ADDRESS = ENV_VARSWAP.FACTORY_ADDRESS
export const ROUTER_ADDRESS = ENV_VARSWAP.ROUTER_ADDRESS as `0x${string}`
export const NETWORK = ENV_VARSWAP.NETWORK

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
export const FARM_IDL = `
type LpStakingError = enum {
  ErrorNotAdmin,
  ErrorCoinNotPublished,
  ErrorInvalidLpToken,
  ErrorLpTokenExist,
  ErrorWithdrawInsufficient,
  ErrorInvalidMoveRate,
  ErrorPidNotExist,
  ErrorCoinNotRegistered,
  ErrorMoveRewardOverflow,
  ErrorInvalidCoinDecimal,
  ErrorPoolUserInfoNotExist,
  ErrorZeroAccount,
  ErrorUpkeepElapsedOverCap,
  ErrorInputBalance,
  EPoolStillLive,
  EConnectToken,
  ETransferTokenFailed,
  TransferTokenFromFailed,
  TransferTokenFailed,
  TransferFromLiquidityFailed,
  EAmountWithdrawToHight,
  TransferLiquidityFailed,
  EPoolEnd,
  LPStakingStatusIncorrect,
  ErrorInsufficientBalance,
};

type PoolStakingInfo = struct {
  total_user: u64,
  total_amount: u256,
  acc_x_per_share: u256,
  x_per_second: u256,
  minimum_deposit_amount: u256,
  last_reward_timestamp: u64,
  end_timestamp: u64,
  staked_token: actor_id,
  reward_token: actor_id,
  admin: actor_id,
  precision_factor: u256,
};

type UserInfo = struct {
  amount: u256,
  reward_debt: u256,
  unclaimed_reward: u256,
};

constructor {
  New : (end_time: u64, staked_token: actor_id, reward_token: actor_id, x_per_second: u256, minimum_deposit_amount: u256, admin: actor_id);
};

service LpStakingService {
  ChangeRewardToken : (new_reward_token: actor_id) -> result (bool, LpStakingError);
  ClaimReward : () -> result (bool, LpStakingError);
  Deposit : (amount: u256) -> result (bool, LpStakingError);
  RecoverToken : (token: actor_id) -> result (bool, LpStakingError);
  SetAdmin : (new_admin: actor_id) -> result (bool, LpStakingError);
  UpdateEndPool : (new_time_end: u64) -> result (bool, LpStakingError);
  UpdateMinimumDepositAmount : (new_minimum_amount: u256) -> result (bool, LpStakingError);
  UpdateRewardPerSecond : (new_reward_per_second: u256) -> result (bool, LpStakingError);
  Withdraw : (_amount: u256) -> result (bool, LpStakingError);
  query CheckLiquidityBalance : (_user: actor_id) -> u256;
  query CheckRewardBalance : (_user: actor_id) -> u256;
  query PendingReward : (_user: actor_id) -> u256;
  query PoolInfo : () -> PoolStakingInfo;
  query UserInfo : (_user: actor_id) -> UserInfo;

  events {
    Deposit: struct {
      user: actor_id,
      amount: u256,
      total_lp_staked: u256,
      staked_token: actor_id,
    };
    Withdraw: struct {
      user: actor_id,
      amount: u256,
      total_lp_staked: u256,
      staked_token: actor_id,
    };
    TokenRecovery: struct {
      token: actor_id,
      amount: u256,
    };
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
  TransferAFailed,
  TransferBFailed,
  IncorrectState,
  Overflow,
  DivisionError,
  InsufficientAllowance,
  NotAdmin,
  NoPendingFunds,
  SkimPairLiquidityFailed,
};

type LiquidityJoin = struct {
  token_a: actor_id,
  token_b: actor_id,
  pair: actor_id,
};

constructor {
  New : (factory: actor_id, wvara: actor_id, admin_addr: actor_id, fund_addr: actor_id, swap_fee_bps: u128);
};

service RouterService {
  AddLiquidity : (token_a: actor_id, token_b: actor_id, amount_a_desired: u256, amount_b_desired: u256, amount_a_min: u256, amount_b_min: u256, to: actor_id, deadline: u64) -> result (struct { u256, u256, u256 }, RouterError);
  AddLiquidityVara : (token: actor_id, amount_token_desired: u256, amount_token_min: u256, amount_vara_min: u256, to: actor_id, deadline: u64) -> result (struct { u256, u256, u256 }, RouterError);
  CreatePair : (token_a: actor_id, token_b: actor_id) -> result (null, RouterError);
  LockRouter : () -> result (null, RouterError);
  RecoverPendingLiquidity : (user: actor_id) -> result (null, RouterError);
  RefundToken : (token_addr: actor_id, amount: u256) -> result (bool, RouterError);
  RefundVara : (amount: u128) -> result (bool, RouterError);
  RemoveLiquidity : (token_a: actor_id, token_b: actor_id, liquidity: u256, amount_a_min: u256, amount_b_min: u256, to: actor_id, deadline: u64) -> result (struct { u256, u256 }, RouterError);
  RemoveLiquidityVara : (token: actor_id, liquidity: u256, amount_token_min: u256, amount_vara_min: u256, to: actor_id, deadline: u64) -> result (struct { u256, u256 }, RouterError);
  SkimPairLiquidity : (pair: actor_id) -> result (null, RouterError);
  SwapExactTokensForTokens : (amount_in: u256, amount_out_min: u256, path: vec actor_id, to: actor_id, deadline: u64) -> result (vec u256, RouterError);
  SwapExactTokensForVara : (amount_in: u256, amount_out_min: u256, path: vec actor_id, to: actor_id, deadline: u64) -> result (vec u256, RouterError);
  SwapExactVaraForTokens : (amount_out_min: u256, path: vec actor_id, to: actor_id, deadline: u64) -> result (vec u256, RouterError);
  SwapTokensForExactTokens : (amount_out: u256, amount_in_max: u256, path: vec actor_id, to: actor_id, deadline: u64) -> result (vec u256, RouterError);
  SwapTokensForExactVara : (amount_out: u256, amount_in_max: u256, path: vec actor_id, to: actor_id, deadline: u64) -> result (vec u256, RouterError);
  SwapVaraForExactTokens : (amount_out: u256, path: vec actor_id, to: actor_id, deadline: u64) -> result (vec u256, RouterError);
  UnlockRouter : () -> result (null, RouterError);
  UpdateFundAddr : (new_fund_addr: actor_id) -> result (bool, RouterError);
  UpdateNewAdmin : (new_addr: actor_id) -> result (bool, RouterError);
  UpdateNewFactorty : (new_factory_addr: actor_id) -> result (bool, RouterError);
  UpdateNewWrapvara : (new_wvara_addr: actor_id) -> result (bool, RouterError);
  UpdateSwapFeeBps : (new_swap_fee_bps: u128) -> result (bool, RouterError);
  query GetAdmin : () -> actor_id;
  query GetAmountIn : (amount_out: u256, reserve_in: u256, reserve_out: u256) -> result (u256, RouterError);
  query GetAmountOut : (amount_in: u256, reserve_in: u256, reserve_out: u256) -> result (u256, RouterError);
  query GetAmountsIn : (amount_out: u256, path: vec actor_id) -> result (vec u256, RouterError);
  query GetAmountsOut : (amount_in: u256, path: vec actor_id) -> result (vec u256, RouterError);
  query GetFactory : () -> actor_id;
  query GetFundAddr : () -> actor_id;
  query GetLiquidityJoin : (user: actor_id) -> vec LiquidityJoin;
  query GetLock : () -> bool;
  query GetReserves : (token_a: actor_id, token_b: actor_id) -> result (struct { u256, u256, actor_id }, RouterError);
  query GetSwapFeeBps : () -> u128;
  query GetWvara : () -> actor_id;
  query PairFor : (token_a: actor_id, token_b: actor_id) -> result (actor_id, RouterError);
  query Quote : (amount_a: u256, reserve_a: u256, reserve_b: u256) -> result (u256, RouterError);
  query SortTokens : (token_a: actor_id, token_b: actor_id) -> result (struct { actor_id, actor_id }, RouterError);

  events {
    CreatePair: struct {
      token_a: actor_id,
      token_b: actor_id,
      pair_address: actor_id,
    };
    AddLiquidity: struct {
      token_a: actor_id,
      token_b: actor_id,
      amount_a: u256,
      amount_b: u256,
      to: actor_id,
      liquidity: u256,
    };
    AddLiquidityVARA: struct {
      token_a: actor_id,
      amount_a: u256,
      amount_vara: u256,
      to: actor_id,
      liquidity: u256,
    };
    RemoveLiquidity: struct {
      token_a: actor_id,
      token_b: actor_id,
      amount_a_received: u256,
      amount_b_received: u256,
      to: actor_id,
      liquidity: u256,
    };
    RemoveLiquidityVARA: struct {
      token_a: actor_id,
      amount_a_received: u256,
      amount_vara_received: u256,
      to: actor_id,
      liquidity: u256,
    };
    SwapExactTokensForTokens: struct {
      amount_in: u256,
      amount_out: u256,
      path: vec actor_id,
      to: actor_id,
    };
    SwapTokensForExactTokens: struct {
      amount_out: u256,
      amount_in: u256,
      path: vec actor_id,
      to: actor_id,
    };
    SwapExactVARAForTokens: struct {
      amount_in: u256,
      amount_out: u256,
      path: vec actor_id,
      to: actor_id,
    };
    SwapTokensForExactVARA: struct {
      amount_out: u256,
      amount_in: u256,
      path: vec actor_id,
      to: actor_id,
    };
    SwapExactTokensForVARA: struct {
      amount_in: u256,
      amount_out: u256,
      path: vec actor_id,
      to: actor_id,
    };
    SwapVARAForExactTokens: struct {
      amount_out: u256,
      amount_in: u256,
      path: vec actor_id,
      to: actor_id,
    };
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