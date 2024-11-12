import JSBI from 'jsbi';
import { Currency, CurrencyAmount, Percent, Price } from '../entities'

/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */
export function computePriceImpact<TBase extends Currency, TQuote extends Currency>(
  midPrice: Price<TBase, TQuote>,
  inputAmount: CurrencyAmount<TBase>,
  outputAmount: CurrencyAmount<TQuote>
): Percent {
  const quotedOutputAmount = midPrice.quote(inputAmount);
  // calculate price impact := (exactQuote - outputAmount) / exactQuote
  const priceImpact = quotedOutputAmount.subtract(outputAmount).divide(quotedOutputAmount);
  const percent = +priceImpact.numerator?.toString() / +priceImpact.denominator?.toString();
  return new Percent(JSBI.BigInt(Math.floor(+percent?.toFixed(5) * (10 ** 8))))
}
