import dynamic from 'next/dynamic'

export const VaraAccountProvider = dynamic(() => import('@gear-js/react-hooks').then((module) => module.AccountProvider ), { ssr: false });
export const VaraAPIProvider = dynamic(() => import('@gear-js/react-hooks').then((module) => module.ApiProvider ), { ssr: false });
export const VaraAlertProvider = dynamic(() => import('@gear-js/react-hooks').then((module) => module.AlertProvider ), { ssr: false });
