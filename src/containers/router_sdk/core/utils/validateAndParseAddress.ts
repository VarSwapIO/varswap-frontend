
// Checks a string starts with 0x, is 42 characters long and contains only hex characters after 0x
const startsWith0xLen42HexRegex = /^0x[0-9a-fA-F]{64}$/

/**
 * Checks if an address is valid by checking 0x prefix, length === 66 and hex encoding.
 * @param address the unchecksummed hex address
 */
export function checkValidAddress(address: string): string {
  if (startsWith0xLen42HexRegex.test(address)) {
    return address
  }
  throw new Error(`${address} is not a valid address.`)
}
