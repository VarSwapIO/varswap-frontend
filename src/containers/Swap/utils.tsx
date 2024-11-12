import { BigNumber } from "@/helpers/big_number_cal";
import JSBI from "jsbi";
import { calculate_best_trade_exact_in, get_all_pairs, Router } from "../router_sdk";
import { CONTRACT_DATA, NETWORK } from "../router_sdk/constants";
import { ChainId, CurrencyAmount, Percent, Token, Vara } from "../router_sdk/core";
import SailsCalls from "../router_sdk/SailsCalls";

type EXAC_IN_SWAP_PROPS = {
  fromToken: COIN_METADATA;
  toToken: COIN_METADATA;
  fromTokenAmount: string;
  slippage: number,
  walletAddress: string;
}


const coinToCurrency = (token: COIN_METADATA) => {
  return token.address === "NATIVE" ? Vara.onChain(ChainId.TESTNET) : new Token(
    ChainId.TESTNET,
    token.address,
    token.decimals,
    token.symbol,
    token.name,
  )
}
export const ExactInSwapQuote = async (data: EXAC_IN_SWAP_PROPS) => {
  const sails = await SailsCalls.new({
    network: NETWORK,
    idl: CONTRACT_DATA.idl,
    contractId: CONTRACT_DATA.programId,
  });

  const currency_in = coinToCurrency(data.fromToken);
  const currency_out = coinToCurrency(data.toToken);
  const amount_in_decimals = BigNumber.parseNumberWithDecimals(data.fromTokenAmount, data.fromToken.decimals) || '0'
  const amount_in = CurrencyAmount.fromRawAmount(currency_in, JSBI.BigInt(amount_in_decimals));

  const all_pairs = await get_all_pairs(currency_in, currency_out, sails);
  const best_trades = calculate_best_trade_exact_in(all_pairs, amount_in, currency_out);
  if (!best_trades) {
    console.log('No best trade found');
    return {
      amount_in: amount_in_decimals,
      amount_out: '0',
      amount_out_formatted: '0',
      amount_in_formatted: data.fromTokenAmount,
      formatted_price1: '0',
      formatted_price2: "0",
      minimum_received: '0',
      price_impact: 0,
      router: undefined,
      payload: undefined
    };
  }
  const payload = Router.swapCallParameters(best_trades, {
    ttl: 50000 * 1000,
    allowedSlippage: new Percent(data.slippage, 10000), // slippage 1%
    recipient: data.walletAddress as string
  })
  const amount_in_string = best_trades?.inputAmount.quotient.toString();
  const amount_out_string = best_trades?.outputAmount.quotient.toString();

  const minimum_received: any = best_trades.minimumAmountOut(new Percent(data.slippage, 10000))?.quotient?.toString();
  let formatted_price1 = (+amount_out_string / +amount_in_string)?.toFixed(6);
  let formatted_price2 = (+amount_in_string / +amount_out_string)?.toFixed(6);
  console.log('best_trades :>> ', best_trades);
  let price_impact = +(+(best_trades?.priceImpact?.quotient?.toString() || 0) / 10 ** 6)?.toFixed(4);

  return {
    amount_in: amount_in_string,
    amount_out: amount_out_string,
    amount_out_formatted: BigNumber.parseNumberToOriginal(amount_out_string, currency_out.decimals) || '0',
    amount_in_formatted: BigNumber.parseNumberToOriginal(amount_in_string, currency_in.decimals) || '0',
    formatted_price1,
    formatted_price2,
    minimum_received: BigNumber.parseNumberToOriginal(minimum_received, currency_out.decimals) || '0',
    price_impact,
    router: best_trades?.route,
    payload: payload
  }
}

export const router_client = {
  ExactInSwapQuote
}