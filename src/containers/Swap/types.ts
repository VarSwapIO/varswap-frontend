import { BaseCurrency } from "../router_sdk/core/entities/baseCurrency";

export enum Field {
  INPUT = 'token_in',
  OUTPUT = 'token_out',
}

export type TOKEN_SWAP_METADATA = { [key in Field]: COIN_METADATA | undefined };