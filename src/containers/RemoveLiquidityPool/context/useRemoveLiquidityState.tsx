
import { useConnectWallet } from '@/context/useConnectWallet';
import { routerReplaceURL } from '@/helpers/router';
import { useAssetStore } from '@/stores/assetStore';
import { useParams } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { AMOUNT_ADD_LIQUIDITY, Field, Field_Liquidity, Field_Sort, TOKEN_SORT_METADATA, TOKEN_SWAP_METADATA, checkSort } from '@/helpers/pools';
import { coinToCurrency } from '@/containers/Swap/utils';
import SailsCalls from '@/containers/router_sdk/SailsCalls';
import { CONTRACT_DATA, LPR_IDL, NETWORK } from '@/containers/router_sdk/constants';
import { getBalanceLP, getBalanceToken } from '@/services/token.services';

type RemoveLiquidityContextProps = {
  token_swap: TOKEN_SWAP_METADATA;
  token_sort: TOKEN_SORT_METADATA;
  amount_liquidity: AMOUNT_ADD_LIQUIDITY
  slippage: number;
  loading_pool: boolean;
  pool_current: POOL_LIQUIDITY_XY | undefined;
  your_liquidity: number;
  percent_lp: number;
  getYourLiquidity: () => void;
  onChangeSlippage: (value: number) => void;
  onSelectToken: (token: COIN_METADATA, field: Field) => void;
  onTypingValue: (value: number, field: Field) => void;
  onClearTypedValue: () => void;
  getDataPool: (disable_loading?: boolean) => void;
}

// create context
const RemoveLiquidityContext = createContext<RemoveLiquidityContextProps>({
  token_swap: {
    [Field.INPUT]: undefined,
    [Field.OUTPUT]: undefined,
  },
  token_sort: {
    [Field_Sort.INPUT]: undefined,
    [Field_Sort.OUTPUT]: undefined,
  },
  amount_liquidity: {
    [Field_Liquidity.INPUT]: 0,
    [Field_Liquidity.OUTPUT]: 0,
    [Field_Liquidity.MINIMUM_INPUT]: 0,
    [Field_Liquidity.MINIMUM_OUTPUT]: 0,
    [Field_Liquidity.LP_AMOUNT]: 0,
    [Field_Liquidity.LP_AMOUNT_PERCENT]: 0,
    [Field_Liquidity.PRICE_XY]: 0,
    [Field_Liquidity.PRICE_YX]: 0
  },
  slippage: 0.1,
  percent_lp: 25,
  pool_current: undefined,
  loading_pool: true,
  your_liquidity: 0,
  onChangeSlippage: () => { },
  onSelectToken: () => { },
  onTypingValue: () => { },
  onClearTypedValue: () => { },
  getDataPool: () => { },
  getYourLiquidity: () => { }
})

export const useRemoveLiquidity = () => useContext(RemoveLiquidityContext)

// create provider context
export default function RemoveLiquidityProvider({
  children,
}: {
  children: JSX.Element
}) {
  const params = useParams();
  const { cointype_by_chain_arr } = useAssetStore();
  const { accountConnected } = useConnectWallet()

  const [tokenSwap, setTokenSwap] = useState<TOKEN_SWAP_METADATA>(
    {
      [Field.INPUT]: undefined,
      [Field.OUTPUT]: undefined,
    }
  )
  const [tokenSort, setTokenSort] = useState<TOKEN_SORT_METADATA>(
    {
      [Field_Sort.INPUT]: undefined,
      [Field_Sort.OUTPUT]: undefined,
    }
  )
  const [inputAmount, setInputAmount] = useState<number>(25)

  const [amountLiquidity, setAmountLiquidity] = useState<AMOUNT_ADD_LIQUIDITY>({
    [Field_Liquidity.INPUT]: 0,
    [Field_Liquidity.OUTPUT]: 0,
    [Field_Liquidity.MINIMUM_INPUT]: 0,
    [Field_Liquidity.MINIMUM_OUTPUT]: 0,
    [Field_Liquidity.LP_AMOUNT]: 0,
    [Field_Liquidity.LP_AMOUNT_PERCENT]: 0,
    [Field_Liquidity.PRICE_XY]: 0,
    [Field_Liquidity.PRICE_YX]: 0
  })
  const [slippage, setSlippage] = useState(0.1);
  const [loadingPool, setLoadingPool] = useState<boolean>(false);
  const [poolCurrent, setPoolCurrent] = useState<POOL_LIQUIDITY_XY | undefined>(undefined);
  const [yourLiquidity, setYourLiquidity] = useState(0)
  console.log('poolCurrent1234 :>> ', poolCurrent);
  // check default token swap by router
  useEffect(() => {
    if (params?.token_in && cointype_by_chain_arr.VARA?.length > 0) {
      const cointype_token_in = decodeURIComponent(params?.token_in?.toString() || '');
      const cointype_token_out = decodeURIComponent(params?.token_out?.toString() || '');

      const token_in_filter = cointype_by_chain_arr.VARA?.find((x: COIN_METADATA) => x.address === cointype_token_in);
      const token_out_filter = cointype_by_chain_arr.VARA?.find((x: COIN_METADATA) => x.address === cointype_token_out);

      if (!!token_in_filter && !token_out_filter) {
        routerReplaceURL(`/liquidity/remove/${token_in_filter.address}`);
        setTokenSwap({
          [Field.INPUT]: token_in_filter,
          [Field.OUTPUT]: undefined
        })
        return;
      }

      if (!!token_in_filter && !!token_out_filter) {
        routerReplaceURL(`/liquidity/remove/${token_in_filter.address}/${token_out_filter.address}`);
        setTokenSwap({
          [Field.INPUT]: token_in_filter,
          [Field.OUTPUT]: token_out_filter
        })
        return;
      }

      routerReplaceURL(`/liquidity/remove`);
      setTokenSwap({
        [Field.INPUT]: undefined,
        [Field.OUTPUT]: undefined
      })

    }
  }, [params, cointype_by_chain_arr.VARA])

  useEffect(() => {
    if (tokenSwap?.token_in && tokenSwap?.token_out) {
      getTokenSort()
    }
  }, [tokenSwap])

  const getTokenSort = () => {
    if (!!tokenSwap.token_in && !!tokenSwap.token_out) {
      const tokenA = coinToCurrency(tokenSwap.token_in);
      const tokenB = coinToCurrency(tokenSwap.token_out);

      const check_sort = checkSort(tokenA?.wrapped?.address || '', tokenB?.wrapped?.address || '');
      if (check_sort) {
        setTokenSort({
          [Field_Sort.INPUT]: tokenA,
          [Field_Sort.OUTPUT]: tokenB,
        })
      } else {
        setTokenSort({
          [Field_Sort.INPUT]: tokenB,
          [Field_Sort.OUTPUT]: tokenA,
        })
      }

    }
  }

  useEffect(() => {
    if (!!tokenSort.token_x && !!tokenSort.token_y) {
      getDataPool();
    }
  }, [tokenSort])

  const getDataPool = async (disable_loading?: boolean) => {
    if (!!tokenSort.token_x && !!tokenSort.token_y) {
      try {
        !disable_loading && setLoadingPool(true)
        const sails = await SailsCalls.new({
          network: NETWORK,
          idl: CONTRACT_DATA.idl,
          contractId: CONTRACT_DATA.programId,
        });

        const pool_info = await sails?.query(
          `RouterService/GetReserves`,
          {
            callArguments: [
              tokenSort.token_x.wrapped.address,
              tokenSort.token_y.wrapped.address
            ]
          }
        )
        console.log('pool_info_123 :>> ', pool_info);
        if (pool_info?.ok?.length > 0) {
          const value_reserve_x = BigInt(pool_info?.ok?.[0]?.toString())?.toString() || '0';
          const value_reserve_y = BigInt(pool_info?.ok?.[1]?.toString())?.toString() || '0';

          const lpr_sails = await SailsCalls.new({
            network: NETWORK,
            idl: LPR_IDL,
            contractId: pool_info?.ok?.[2]?.toString(),
          });

          const total_supply = await lpr_sails.query('LpService/TotalSupply', {
            callArguments: []
          });
          const total_supply_string = BigInt(total_supply?.toString())?.toString() || '0'
          setPoolCurrent({
            reserve_x: value_reserve_x,
            reserve_y: value_reserve_y,
            total_supply: total_supply_string,
            pool_id: pool_info?.ok?.[2]?.toString()
          })
        }
      } catch (error) {
        setPoolCurrent(undefined)
      } finally {
        setLoadingPool(false);
      }
    }
  }

  useEffect(() => {
    if (!!tokenSort.token_x && !!tokenSort.token_y && accountConnected?.address && poolCurrent?.pool_id) {
      getYourLiquidity()
    } else {
      setYourLiquidity(0)
    }
  }, [accountConnected, tokenSort, poolCurrent?.pool_id])

  const getYourLiquidity = async (disable_loading?: boolean) => {
    if (!!tokenSort.token_x && !!tokenSort.token_y && accountConnected?.address && !!poolCurrent?.pool_id) {
      try {
        const balance_lp = await getBalanceLP(poolCurrent?.pool_id, accountConnected?.address_decoded);
        console.log('balance_lp', balance_lp)
        setYourLiquidity(+balance_lp || 0)
      } catch (error) {
        setYourLiquidity(0)
      } finally {
      }
    }

  }


  const onSelectToken = (token: COIN_METADATA, field: Field) => {
    const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT;
    const token_swap_current = tokenSwap;
    // the case where we have to swap the order
    if (token.address === token_swap_current[otherField]?.address) {
      setTokenSwap((x: TOKEN_SWAP_METADATA) => ({
        ...x,
        [field]: token,
        [otherField]: token_swap_current[field]
      }))

      // start handle router
      if (!!token_swap_current[Field.OUTPUT] || field === Field.INPUT) {
        const pathname_current = `/liquidity/remove/${token_swap_current[Field.OUTPUT]?.address}`
          + (token_swap_current[Field.INPUT]?.address ?
            `/${token_swap_current[Field.INPUT]?.address}` : ``);
        routerReplaceURL(pathname_current)
      } else {
        routerReplaceURL('/liquidity/remove')
      }
      // end handle router
      onClearTypedValue();
      return;
    }

    if (token.address === token_swap_current[field]?.address) {
      return;
    }
    // the normal case
    setTokenSwap((x: TOKEN_SWAP_METADATA) => ({
      ...x,
      [field]: token,
    }))

    onClearTypedValue();

    // start handle router
    if (!!token_swap_current[Field.INPUT] || field === Field.INPUT) {
      const pathname_current = `/liquidity/remove/${field === Field.INPUT ? token.address : token_swap_current[Field.INPUT]?.address}`
        + ((field === Field.OUTPUT || token_swap_current[Field.OUTPUT]?.address) ?
          `/${field === Field.OUTPUT ? token.address : token_swap_current[Field.OUTPUT]?.address}` : ``);
      routerReplaceURL(pathname_current)
    } else {
      routerReplaceURL('/liquidity/remove')
    }
    // end handle router

  }

  const onChangeSlippage = (value: number) => {
    setSlippage(value)
  }

  const onTypingValue = (value: number, field: Field) => {
    setInputAmount(value)

  }

  useEffect(() => {
    if (!!tokenSort.token_x && !!tokenSort.token_y) {
      handleCalculateRemoveLiquidity()
    }

  }, [poolCurrent, tokenSort, tokenSwap, inputAmount, slippage, yourLiquidity])

  const handleCalculateRemoveLiquidity = () => {
    console.log('poolCurrent', poolCurrent, tokenSort, tokenSwap);

    const value = inputAmount;


    if (!value || +value === 0 || !yourLiquidity) {
      setAmountLiquidity({
        [Field_Liquidity.INPUT]: 0,
        [Field_Liquidity.OUTPUT]: 0,
        [Field_Liquidity.MINIMUM_INPUT]: 0,
        [Field_Liquidity.MINIMUM_OUTPUT]: 0,
        [Field_Liquidity.LP_AMOUNT]: 0,
        [Field_Liquidity.LP_AMOUNT_PERCENT]: 0,
        [Field_Liquidity.PRICE_XY]: 0,
        [Field_Liquidity.PRICE_YX]: 0
      })
      return;
    }

    if (!poolCurrent) {
      return;
    } else {
      const balance_lp_percent = Math.round(yourLiquidity * (value / 100))
      const totalSupply = +(poolCurrent?.total_supply || 1)
      const token1_amount = +poolCurrent?.reserve_x * (balance_lp_percent / totalSupply)
      const token2_amount = +poolCurrent?.reserve_y * (balance_lp_percent / totalSupply)

      const min_token1_amount = Math.round(token1_amount * (1 - slippage / 100)).toString();
      const min_token2_amount = Math.round(token2_amount * (1 - slippage / 100)).toString();
      setAmountLiquidity({
        [Field_Liquidity.INPUT]: min_token1_amount,
        [Field_Liquidity.OUTPUT]: min_token2_amount,
        [Field_Liquidity.MINIMUM_INPUT]: 0,
        [Field_Liquidity.MINIMUM_OUTPUT]: 0,
        [Field_Liquidity.LP_AMOUNT]: balance_lp_percent,
        [Field_Liquidity.LP_AMOUNT_PERCENT]: 0,
        [Field_Liquidity.PRICE_XY]: 0,
        [Field_Liquidity.PRICE_YX]: 0
      })
    }
  }
  const onClearTypedValue = () => {
    setInputAmount(25)
    setAmountLiquidity({
      [Field_Liquidity.INPUT]: 0,
      [Field_Liquidity.OUTPUT]: 0,
      [Field_Liquidity.MINIMUM_INPUT]: 0,
      [Field_Liquidity.MINIMUM_OUTPUT]: 0,
      [Field_Liquidity.LP_AMOUNT]: 0,
      [Field_Liquidity.LP_AMOUNT_PERCENT]: 0,
      [Field_Liquidity.PRICE_XY]: 0,
      [Field_Liquidity.PRICE_YX]: 0
    })
  }

  const value = useMemo(
    () => ({
      token_swap: tokenSwap,
      token_sort: tokenSort,
      amount_liquidity: amountLiquidity,
      slippage: slippage || 0,
      pool_current: poolCurrent,
      loading_pool: loadingPool,
      your_liquidity: yourLiquidity,
      percent_lp: inputAmount,
      onChangeSlippage,
      onSelectToken,
      onTypingValue,
      onClearTypedValue,
      getDataPool,
      getYourLiquidity
    }),
    [
      tokenSwap,
      amountLiquidity,
      slippage,
      tokenSort,
      poolCurrent,
      loadingPool,
      yourLiquidity,
      inputAmount
    ]
  )

  return (
    <RemoveLiquidityContext.Provider value={value}>
      {children}
    </RemoveLiquidityContext.Provider>
  )
}
