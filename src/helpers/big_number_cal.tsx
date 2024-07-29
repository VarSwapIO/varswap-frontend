import JSBI from 'jsbi'
type InputBignumber = string | number | JSBI | null

const parseFloatToInt = (num: string | number | JSBI) => {
	if (!num)
		return {
			num: 0,
			dec: 0,
		}
	let numString = num.toString().split('.')

	if (numString.length == 1) {
		return {
			num: numString[0],
			dec: 0,
		}
	}

	if (numString.length == 2) {
		return {
			num: numString.join(''),
			dec: numString[1].length,
		}
	}
	return {
		num: 0,
		dec: 0,
	}
}

const add = (a: InputBignumber, b: InputBignumber, type = 'string') => {
	if (!a || !b) {
		return null
	}

	const bn_a = JSBI.BigInt(parseFloatToInt(a)?.num)
	const bn_b = JSBI.BigInt(parseFloatToInt(b)?.num)
	const add = JSBI.add(bn_a, bn_b)
	if (type === 'bignumber') {
		return add
	}
	return String(add)
}

const subtract = (a: InputBignumber, b: InputBignumber, type = 'string') => {
	if (!a || !b) {
		return null
	}

	const bn_a = JSBI.BigInt(parseFloatToInt(a)?.num)
	const bn_b = JSBI.BigInt(parseFloatToInt(b)?.num)
	const subtract = JSBI.subtract(bn_a, bn_b)
	if (type === 'bignumber') {
		return subtract
	}
	return String(subtract)
}

const multiply = (a: InputBignumber, b: InputBignumber, type = 'string') => {
	if (!a || !b) {
		return null
	}

	const bn_a = JSBI.BigInt(parseFloatToInt(a)?.num)
	const bn_b = JSBI.BigInt(parseFloatToInt(b)?.num)
	const multiply = JSBI.multiply(bn_a, bn_b)
	if (type === 'bignumber') {
		return multiply
	}
	return String(multiply)
}

const divide = (a: InputBignumber, b: InputBignumber, type = 'string') => {
	if (!a || !b) {
		return null
	}

	const bn_a = JSBI.BigInt(parseFloatToInt(a)?.num)
	const bn_b = JSBI.BigInt(parseFloatToInt(b)?.num)
	const divide = JSBI.divide(bn_a, bn_b)
	if (type === 'bignumber') {
		return divide
	}
	return String(divide)
}

const exponentiate = (
	a: InputBignumber,
	b: InputBignumber,
	type = 'string'
) => {
	if (!a || !b) {
		return null
	}

	const bn_a = JSBI.BigInt(parseFloatToInt(a)?.num)
	const bn_b = JSBI.BigInt(parseFloatToInt(b)?.num)
	const exponentiate = JSBI.exponentiate(bn_a, bn_b)
	if (type === 'bignumber') {
		return exponentiate
	}
	return String(exponentiate)
}

const parseNumberToOriginal = (a_input: InputBignumber, decimals = 18) => {
	if (!a_input) {
		return null
	}
	const a = parseFloatToInt(a_input)
	if (a_input?.toString()?.length < 36 && a.dec === 0) {
		const num_with_decimal =
			exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals), 'string') || 1
		const divide_cal = +a_input / +num_with_decimal
		const arr_num = divide_cal?.toString()?.split('.')
		const fixded_num = arr_num?.[1]?.length || 0

		if (divide_cal?.toString()?.includes('.99999')) {
			return `${arr_num?.[0]}.99999`
		}
		return (+a_input / +num_with_decimal)?.toFixed(
			fixded_num > 0 ? (fixded_num > 5 ? 5 : fixded_num) : 0
		)
	}
	const num_with_decimal =
		exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals + a.dec), 'string') || 1
	const original = divide(a.num, num_with_decimal)
	return String(original)
}

const parseNumberWithDecimals = (a_input: InputBignumber, decimals = 18) => {
	if (!a_input) {
		return null
	}
	const a = parseFloatToInt(a_input)
	const bn_a = JSBI.BigInt(a?.num)
	const num_with_decimal = exponentiate(
		JSBI.BigInt(10),
		JSBI.BigInt(decimals - a.dec)
	)
	const num_decimal = multiply(bn_a, num_with_decimal)
	return String(num_decimal)
}
export const BigNumber = {
	add,
	subtract,
	multiply,
	divide,
	parseNumberToOriginal,
	parseNumberWithDecimals,
}
