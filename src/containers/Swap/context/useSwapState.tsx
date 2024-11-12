import { routerReplaceURL } from '@/helpers/router';
import { useAssetStore } from '@/stores/assetStore';
import { useParams } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Field, TOKEN_SWAP_METADATA } from '../types';

type SwapStateContextProps = {
  token_swap: TOKEN_SWAP_METADATA
  independent_field: Field;
  typed_value: string;
  slippage: number;
  onChangeSlippage: (value: number) => void;
  onSelectToken: (token: COIN_METADATA, field: Field) => void;
  onSwitchToken: () => void;
  onTypingValue: (value: string, field: Field) => void;
}

// create context
const SwapStateContext = createContext<SwapStateContextProps>({
  token_swap: {
    [Field.INPUT]: undefined,
    [Field.OUTPUT]: undefined,
  },
  independent_field: Field.INPUT,
  typed_value: '',
  slippage: 0.1,
  onChangeSlippage: () => { },
  onSelectToken: () => { },
  onSwitchToken: () => { },
  onTypingValue: () => { }
})

export const useSwapState = () => useContext(SwapStateContext)

// create provider context
export default function SwapStateProvider({
  children,
}: {
  children: JSX.Element
}) {
  const params = useParams();
  const { cointype_by_chain_arr ,cointype_by_chain } = useAssetStore()

  const [tokenSwap, setTokenSwap] = useState<TOKEN_SWAP_METADATA>(
    {
      [Field.INPUT]: undefined,
      [Field.OUTPUT]: undefined,
    }
  )
  const [typedValue, setTypedValue] = useState<string>('');
  const [independentField, setIndependentField] = useState<Field>(Field.INPUT);
  const [slippage, setSlippage] = useState(0.1);

  // check default token swap by router
  useEffect(() => {
    if (params?.token_in && cointype_by_chain_arr.VARA?.length > 0) {
      const cointype_token_in = decodeURIComponent(params?.token_in?.toString() || '');
      const cointype_token_out = decodeURIComponent(params?.token_out?.toString() || '');

      const token_in_filter = cointype_by_chain?.VARA?.[cointype_token_in];
      const token_out_filter = cointype_by_chain?.VARA?.[cointype_token_out];

      if (!!token_in_filter && !token_out_filter) {
        routerReplaceURL(`/swap/${token_in_filter.address}`);
        setTokenSwap({
          [Field.INPUT]: token_in_filter,
          [Field.OUTPUT]: undefined
        })
        return;
      }

      if (!!token_in_filter && !!token_out_filter) {
        routerReplaceURL(`/swap/${token_in_filter.address}/${token_out_filter.address}`);
        setTokenSwap({
          [Field.INPUT]: token_in_filter,
          [Field.OUTPUT]: token_out_filter
        })
        return;
      }

      routerReplaceURL(`/swap`);
      setTokenSwap({
        [Field.INPUT]: undefined,
        [Field.OUTPUT]: undefined
      })

    }
  }, [params, cointype_by_chain_arr.VARA])

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
      // setIndependentField((ifield: Field) => ifield === Field.INPUT ? Field.OUTPUT : Field.INPUT);

      // start handle router
      if (!!token_swap_current[Field.OUTPUT] || field === Field.INPUT) {
        const pathname_current = `/swap/${token_swap_current[Field.OUTPUT]?.address}`
          + (token_swap_current[Field.INPUT]?.address ?
            `/${token_swap_current[Field.INPUT]?.address}` : ``);
        routerReplaceURL(pathname_current)
      } else {
        routerReplaceURL('/swap')
      }
      // end handle router

      return;
    }

    // the normal case
    setTokenSwap((x: TOKEN_SWAP_METADATA) => ({
      ...x,
      [field]: token,
    }))

    // start handle router
    if (!!token_swap_current[Field.INPUT] || field === Field.INPUT) {
      const pathname_current = `/swap/${field === Field.INPUT ? token.address : token_swap_current[Field.INPUT]?.address}`
        + ((field === Field.OUTPUT || token_swap_current[Field.OUTPUT]?.address) ?
          `/${field === Field.OUTPUT ? token.address : token_swap_current[Field.OUTPUT]?.address}` : ``);
      routerReplaceURL(pathname_current)
    } else {
      routerReplaceURL('/swap')
    }
    // end handle router
  }

  const onSwitchToken = () => {
    const token_swap_current = tokenSwap;

    if (!token_swap_current[Field.INPUT] && !token_swap_current[Field.OUTPUT]) {
      return;
    }

    //start handle router
    if (!!token_swap_current[Field.OUTPUT]) {
      const pathname_current = `/swap/${token_swap_current[Field.OUTPUT]?.address}`
        + (token_swap_current[Field.INPUT]?.address ?
          `/${token_swap_current[Field.INPUT]?.address}` : ``);
      routerReplaceURL(pathname_current);
    } else {
      routerReplaceURL('/swap');
    }
    //end handle router

    setTokenSwap({
      [Field.INPUT]: token_swap_current[Field.OUTPUT],
      [Field.OUTPUT]: token_swap_current[Field.INPUT]
    })
    // setIndependentField((ifield: Field) => ifield === Field.INPUT ? Field.OUTPUT : Field.INPUT);


  }

  const onChangeSlippage = (value: number) => {
    setSlippage(value)
  }

  const onTypingValue = (value: string, field: Field) => {
    setTypedValue(value);
    setIndependentField(field);
  }

  const value = useMemo(
    () => ({
      token_swap: tokenSwap,
      independent_field: independentField,
      typed_value: typedValue,
      slippage: slippage || 0,
      onChangeSlippage,
      onSelectToken,
      onSwitchToken,
      onTypingValue
    }),
    [
      tokenSwap,
      typedValue,
      independentField,
      slippage
    ]
  )

  return (
    <SwapStateContext.Provider value={value}>
      {children}
    </SwapStateContext.Provider>
  )
}
