
import { BigNumber } from '@/helpers/big_number_cal';
import { routerReplaceURL } from '@/helpers/router';
import { useAssetStore } from '@/stores/assetStore';
import { useParams } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AMOUNT_ADD_LIQUIDITY, Field, Field_Liquidity, Field_Sort, TOKEN_SORT_METADATA, TOKEN_SWAP_METADATA, checkSort, quote, convertToAddressNative } from '@/helpers/pools';
import { coinToCurrency } from '@/containers/Swap/utils';
import SailsCalls from '@/containers/router_sdk/SailsCalls';
import { CONTRACT_DATA, NETWORK } from '@/containers/router_sdk/constants';

type AddLiquidityContextProps = {
  token_swap: TOKEN_SWAP_METADATA;
  token_sort: TOKEN_SORT_METADATA;
  amount_liquidity: AMOUNT_ADD_LIQUIDITY
  slippage: number;
  loading_pool: boolean;
  pool_current: POOL_LIQUIDITY_XY | undefined;
  onChangeSlippage: (value: number) => void;
  onSelectToken: (token: COIN_METADATA, field: Field) => void;
  onTypingValue: (value: string, field: Field) => void;
  onClearTypedValue: () => void;
  getDataPool: (disable_loading?: boolean) => void;
}

// create context
const AddLiquidityContext = createContext<AddLiquidityContextProps>({
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
  pool_current: undefined,
  loading_pool: true,
  onChangeSlippage: () => { },
  onSelectToken: () => { },
  onTypingValue: () => { },
  onClearTypedValue: () => { },
  getDataPool: () => { }
})

export const useAddLiquidity = () => useContext(AddLiquidityContext)

// create provider context
export default function AddLiquidityProvider({
  children,
}: {
  children: JSX.Element
}) {
  const params = useParams();
  const { cointype_by_chain_arr } = useAssetStore();

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
  const [inputAmount, setInputAmount] = useState<{
    amount: string | number;
    field: Field
  }>({
    amount: 0,
    field: Field.INPUT
  })

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

  // check default token swap by router
  useEffect(() => {
    if (params?.token_in && cointype_by_chain_arr.VARA?.length > 0) {
      const cointype_token_in = decodeURIComponent(params?.token_in?.toString() || '');
      const cointype_token_out = decodeURIComponent(params?.token_out?.toString() || '');

      const token_in_filter = cointype_by_chain_arr.VARA?.find((x: COIN_METADATA) => x.address === cointype_token_in);
      const token_out_filter = cointype_by_chain_arr.VARA?.find((x: COIN_METADATA) => x.address === cointype_token_out);

      if (!!token_in_filter && !token_out_filter) {
        routerReplaceURL(`/liquidity/add/${token_in_filter.address}`);
        setTokenSwap({
          [Field.INPUT]: token_in_filter,
          [Field.OUTPUT]: undefined
        })
        return;
      }

      if (!!token_in_filter && !!token_out_filter) {
        routerReplaceURL(`/liquidity/add/${token_in_filter.address}/${token_out_filter.address}`);
        setTokenSwap({
          [Field.INPUT]: token_in_filter,
          [Field.OUTPUT]: token_out_filter
        })
        return;
      }

      routerReplaceURL(`/liquidity/add`);
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

      let interval = setInterval(() => {
        getDataPool(true)
      }, 5000);

      return () => clearInterval(interval)
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
        console.log('pool_info :>> ', pool_info);
        if (pool_info?.ok?.length > 0) {
          const value_reserve_x = BigInt(pool_info?.ok?.[0]?.toString())?.toString() || '0';
          const value_reserve_y = BigInt(pool_info?.ok?.[1]?.toString())?.toString() || '0';

          setPoolCurrent({
            reserve_x: value_reserve_x,
            reserve_y: value_reserve_y,
            total_supply: Math.round(Math.sqrt(+value_reserve_x * +value_reserve_y))?.toString(),
          })
        }

      } catch (error) {
        setPoolCurrent(undefined)
      } finally {
        setLoadingPool(false);
      }
    }
  }


  const onSelectToken = useCallback(
    (token: COIN_METADATA, field: Field) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT;
      const token_swap_current = tokenSwap;
      console.log('token_swap_current :>> ', token_swap_current);
      // the case where we have to swap the order
      if (token.address === token_swap_current[otherField]?.address) {
        setTokenSwap((x: TOKEN_SWAP_METADATA) => ({
          ...x,
          [field]: token,
          [otherField]: token_swap_current[field]
        }))

        // start handle router

        if (!!token_swap_current[Field.OUTPUT] || field === Field.INPUT) {
          const pathname_current = `/liquidity/add/${token_swap_current[Field.OUTPUT]?.address}`
            + (token_swap_current[Field.INPUT]?.address ?
              `/${token_swap_current[Field.INPUT]?.address}` : ``);
          routerReplaceURL(pathname_current)
        } else {
          routerReplaceURL('/liquidity/add')
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
      console.log('token_swap_current[Field.OUTPUT]', token_swap_current[Field.OUTPUT], field === Field.INPUT)
      if (!!token_swap_current[Field.INPUT] || field === Field.INPUT) {
        const pathname_current = `/liquidity/add/${field === Field.INPUT ? token.address : token_swap_current[Field.INPUT]?.address}`
          + ((field === Field.OUTPUT || token_swap_current[Field.OUTPUT]?.address) ?
            `/${field === Field.OUTPUT ? token.address : token_swap_current[Field.OUTPUT]?.address}` : ``);
        routerReplaceURL(pathname_current)
      } else {
        routerReplaceURL('/liquidity/add')
      }
      // end handle router

    },
    [tokenSwap?.token_in, tokenSwap?.token_out],
  )


  const onChangeSlippage = (value: number) => {
    setSlippage(value)
  }

  const onTypingValue = (value: string, field: Field) => {
    setInputAmount({
      amount: value,
      field: field
    })

  }

  useEffect(() => {
    if (!!tokenSort.token_x && !!tokenSort.token_y) {
      handleCalculateAddLiquidity()
    }

  }, [poolCurrent, tokenSort, tokenSwap, inputAmount, slippage])

  const handleCalculateAddLiquidity = () => {
    console.log('poolCurrent', poolCurrent, tokenSort, tokenSwap);

    const value = inputAmount.amount;
    const field = inputAmount.field;


    if (!value || +value === 0) {
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
      setAmountLiquidity((x: AMOUNT_ADD_LIQUIDITY) => ({
        ...x,
        [field]: value,
      }))
    } else {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT;
      const token_input_current = tokenSwap?.[field];
      const token_output_current = tokenSwap?.[otherField];

      const check_is_sort = token_input_current?.address === convertToAddressNative(tokenSort?.token_x?.wrapped?.address || '');
      const poolValueX = check_is_sort ? poolCurrent?.reserve_x : poolCurrent?.reserve_y;
      const poolValueY = check_is_sort ? poolCurrent?.reserve_y : poolCurrent?.reserve_x;

      const amount_x = BigNumber.parseNumberWithDecimals(value, token_input_current?.decimals) || '0'
      let outputY = quote(+amount_x, +poolValueX, +poolValueY) || 0

      let arrr_1 = []
      let amount_y_optimal = quote(+amount_x, +poolValueX, +poolValueY);
      if (amount_y_optimal <= outputY) {
        arrr_1 = [+amount_x, amount_y_optimal]
      } else {
        let amount_x_optimal = quote(outputY, +poolValueY, +poolValueX);
        arrr_1 = [amount_x_optimal, outputY]
      }
      const minimumReceived = Math.round(arrr_1[1] * (1 - slippage / 100));
      const minimumInput = Math.round(arrr_1[0] * (1 - slippage / 100));

      const output_amount = BigNumber.parseNumberToOriginal(Math.round(arrr_1[1]), token_output_current?.decimals) || '0';
      const lp_amount = Math.round(Math.sqrt(+(arrr_1[1] || 0) * +(amount_x || 0)))?.toString();
      const share_percent = ((+lp_amount / (+(poolCurrent?.total_supply || 1) + +lp_amount)) * 100)?.toFixed(2);

      const pool_x_original = BigNumber.parseNumberToOriginal(poolCurrent?.reserve_x, tokenSort?.token_x?.decimals) || '1';
      const pool_y_original = BigNumber.parseNumberToOriginal(poolCurrent?.reserve_y, tokenSort?.token_y?.decimals) || '1';
      console.log('amout_x , out', check_is_sort, amount_x, output_amount, pool_y_original, pool_x_original)
      const price_xy = (check_is_sort ? (+output_amount / +value) : (+value / +output_amount)) || +pool_y_original / +pool_x_original

      setAmountLiquidity({
        [Field_Liquidity.INPUT]: field === Field.INPUT ? value : output_amount,
        [Field_Liquidity.OUTPUT]: field === Field.OUTPUT ? value : output_amount,
        [Field_Liquidity.MINIMUM_INPUT]: field === Field.INPUT ? minimumInput : minimumReceived,
        [Field_Liquidity.MINIMUM_OUTPUT]: field === Field.INPUT ? minimumReceived : minimumInput,
        [Field_Liquidity.LP_AMOUNT]: BigNumber.parseNumberToOriginal(lp_amount, 12) || '0',
        [Field_Liquidity.LP_AMOUNT_PERCENT]: share_percent,
        [Field_Liquidity.PRICE_XY]: price_xy,
        [Field_Liquidity.PRICE_YX]: 1 / price_xy
      })
    }
  }
  const onClearTypedValue = () => {
    setInputAmount({
      field: Field.INPUT,
      amount: 0
    })
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
      onChangeSlippage,
      onSelectToken,
      onTypingValue,
      onClearTypedValue,
      getDataPool
    }),
    [
      tokenSwap,
      amountLiquidity,
      slippage,
      tokenSort,
      poolCurrent,
      loadingPool
    ]
  )

  return (
    <AddLiquidityContext.Provider value={value}>
      {children}
    </AddLiquidityContext.Provider>
  )
}
