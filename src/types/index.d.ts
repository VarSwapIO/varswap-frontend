import { Injected } from "@polkadot/extension-inject/types";

export { }
declare global {
  interface Window {
    injectedWeb3: {
      'polkadot-js': {
        enable: () => Promise<Injected>
      };
      'subwallet-js': {
        enable: () => Promise<Injected>
      };
      'talisman': {
        enable: () => Promise<Injected>
      };
      'enkrypt': {
        enable: () => Promise<Injected>
      }
    }
  }
}
