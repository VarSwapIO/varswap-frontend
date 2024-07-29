
export const getBaseLog = (x: number, y: number) => {
  if (y < 0) {
    console.log('y', y)
  }
  return Math.log(y) / Math.log(x);
}

export const formatMoneyCompact = (price: string, fixed = 2) => {
  const priceX = +parseFloat(price)?.toFixed(fixed)
  let dollarUS2 = Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
    compactDisplay: 'short',
  }) // 1M
  return dollarUS2.format(priceX)
}

export const formatNumberDisplay = (num: any, min_format?: string, fixed?: number) => {
  const min_start_format = min_format === 'thousand' ? 1000 : 1000000
  if (!num) {
    return 0
  }
  if (num >= min_start_format) {
    return formatMoneyCompact(num)
  }

  const num_short = num?.toString()?.split('.')
  if (num_short?.length > 1) {
    return `${num_short?.[0]
      ?.toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}.${num_short?.[1]?.length > 2 ? num_short?.[1].slice(0, fixed ?? 2) : num_short?.[1]
      }`
  }
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

}

export const formatPriceTokenDisplay = (value: any, disable_prefix?: boolean, disable_bot?: boolean) => {
  const num_price = Math.abs(parseFloat(value || 0));

  if (!num_price) {
    return `${disable_prefix ? '' : '$'}0`
  }
  const fixed_num = Math.floor(2 + getBaseLog(10, 1 / (num_price > 1 ? 1 : num_price)));
  const fixed_format_beauty = fixed_num >= 6 ? fixed_num + 2 : fixed_num
  const num = num_price?.toFixed(fixed_format_beauty)
  if (+num < 0.0000001) {
    const array_num = num?.toString()?.split(".");
    const arr1 = array_num[1] || '';
    let count = 0
    for (let index = 0; index < arr1.length; index++) {
      const element = arr1[index];
      if (element === '0') {
        count += 1
      }
    }
    return <div className='flex items-center '>
      <p>{disable_prefix ? '' : '$'}{array_num[0]},</p>
      <p>0</p>
      <p className='mt-6 text-xs mx-0.5'>{count - 1}</p>
      <p>{arr1?.replaceAll('0', '')}</p>
    </div>
  }

  if (+num >= 1000000) {
    return `${disable_prefix ? '' : '$'}${formatMoneyCompact(num)}`
  }

  const num_short = num_price?.toString()?.split('.')
  if (num_short?.length > 1) {
    return `${disable_prefix ? '' : '$'}${num_short?.[0]
      ?.toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${disable_bot ? '' : ','}`)}.${num_short?.[1]?.length > 2 ? num_short?.[1].slice(0, fixed_format_beauty) : num_short?.[1]
      }`
  }

  return num_price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `${disable_prefix ? '' : '$'}$1${disable_bot ? '' : ','}`)
}

export const formatAmountWithFixed = (value: any, fixed?: number) => {
  const num_price = parseFloat(value || 0)
  if (!num_price) {
    return `0`
  }
  const num_fixed = num_price < 100 ? 5 : Math.floor(2 + getBaseLog(10, 1 / (num_price > 1 ? 1 : num_price)))
  const num_short = num_price?.toString()?.split('.')
  if (num_short?.length > 1) {
    let amount_after_fixed = num_short?.[1].slice(0, num_fixed);
    const array_amount = Array.from(amount_after_fixed)
    for (let index = 0; index < num_fixed; index++) {
      if (!array_amount?.[index]) {
        amount_after_fixed += '0'
      }
    }
    return `${num_short?.[0]?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}.${amount_after_fixed}`
  }

  return num_price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

}