
import { coinToCurrency } from '@/containers/Swap/utils';
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { AMOUNT_LIQUIDITY, Field, Field_Sort, TOKEN_SORT_METADATA, TOKEN_SWAP_METADATA, checkSort } from '@/helpers/pools';

type CreateLiquidityContextProps = {
  token_swap: TOKEN_SWAP_METADATA;
  token_sort: TOKEN_SORT_METADATA;
  amount_liquidity: AMOUNT_LIQUIDITY
  slippage: number;
  onChangeSlippage: (value: number) => void;
  onSelectToken: (token: COIN_METADATA, field: Field) => void;
  onTypingValue: (value: string, field: Field) => void;
  onClearTypedValue: () => void;
}

// create context
const CreateLiquidityContext = createContext<CreateLiquidityContextProps>({
  token_swap: {
    [Field.INPUT]: undefined,
    [Field.OUTPUT]: undefined,
  },
  token_sort: {
    [Field_Sort.INPUT]: undefined,
    [Field_Sort.OUTPUT]: undefined,
  },
  amount_liquidity: {
    [Field.INPUT]: 0,
    [Field.OUTPUT]: 0,
  },
  slippage: 0.1,
  onChangeSlippage: () => { },
  onSelectToken: () => { },
  onTypingValue: () => { },
  onClearTypedValue: () => { }
})

export const useCreateLiquidity = () => useContext(CreateLiquidityContext)

// create provider context
export default function CreateLiquidityProvider({
  children,
}: {
  children: JSX.Element
}) {
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
  const [amountLiquidity, setAmountLiquidity] = useState<AMOUNT_LIQUIDITY>({
    [Field.INPUT]: 0,
    [Field.OUTPUT]: 0,
  })
  const [slippage, setSlippage] = useState(0.1);

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
      return;
    }

    // the normal case
    setTokenSwap((x: TOKEN_SWAP_METADATA) => ({
      ...x,
      [field]: token,
    }))

  }


  const onChangeSlippage = (value: number) => {
    setSlippage(value)
  }

  const onTypingValue = (value: string, field: Field) => {
    setAmountLiquidity((x: AMOUNT_LIQUIDITY) => ({
      ...x,
      [field]: value,
    }))
  }

  const onClearTypedValue = () => {
    setAmountLiquidity({
      [Field.INPUT]: 0,
      [Field.OUTPUT]: 0,
    })
  }

  const value = useMemo(
    () => ({
      token_swap: tokenSwap,
      token_sort: tokenSort,
      amount_liquidity: amountLiquidity,
      slippage: slippage || 0,
      onChangeSlippage,
      onSelectToken,
      onTypingValue,
      onClearTypedValue
    }),
    [
      tokenSwap,
      amountLiquidity,
      slippage,
      tokenSort
    ]
  )

  return (
    <CreateLiquidityContext.Provider value={value}>
      {children}
    </CreateLiquidityContext.Provider>
  )
}
