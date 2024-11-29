type NAV_CHILD = {
  id: string;
  title: string;
  descriptions: string;
  icon?: any;
  href: string;
  type?: string;
  is_blank?: boolean;
}

type ROUTER_NAV = {
  id: string;
  title: string;
  href: string;
  type?: string;
  icon?: any;
  childrens?: Array<NAV_CHILD>;
  is_blank?: boolean;
  similar_links?: string[];
  start_child_link?: string;
}

type MODAL_TYPE = {
  opened: boolean;
  close: () => void;
}
type CHAIN_NAME_TYPE = 'VARA'
type TOKEN_METADATA = {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  icon: string;
  verified?: boolean;
}

type YOUR_LIQUIDITY = {
  coin_x: TOKEN_METADATA;
  coin_y: TOKEN_METADATA;
  coin_x_amount: number;
  coin_y_amount: number;
  lp_amount: number;
  lp_percent: number;
}

type BALANCE_ACCOUNT = {
  amount?: string | number;
  name?: string;
  symbol?: string;
  decimals?: number;
  address: string;
  icon?: string;
}

type WALLET_PROVIDER = 'polkadot-js' | 'subwallet-js' | 'talisman' | 'enkrypt'
type WALLET_METADATA = {
  name: string;
  key: string;
  icon: string;
  url: string;
}

type COIN_METADATA = {
  name: string;
  symbol: string;
  address: string;
  icon: string;
  decimals: number;
  verified?: boolean;
  price_usd?: string | number;
  old_24h_price_usd?: string | number;
}

type POOL_LIQUIDITY_XY = {
  reserve_x: string;
  reserve_y: string;
  total_supply?: string;
  pool_id?: string;
}

type YOUR_LIQUIDITY_METADATA = {
  amount: string;
  coin_x?: COIN_METADATA;
  coin_y?: COIN_METADATA;
  decimals: number;
  name: string;
  symbol: string;
  pool_id: string;
}

type FARM_POOL_METADATA = {
  token_x: COIN_METADATA;
  token_y: COIN_METADATA;
  token_reward: COIN_METADATA;
  end_timestamp?: string;
  lp_stake_address?: string;
  acc_x_per_share?: string;
  x_per_second?: string;
  total_amount?: string;
  last_reward_timestamp?: string;
  farm_contract_address: string;
}