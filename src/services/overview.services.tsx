import { ENV_VARSWAP } from "@/config/env"
import axios from "axios"

export interface ApiResponse {
  error?: object,
  data?: any,
  meta?: any
}

const baseURL = ENV_VARSWAP.API_URL || ''

const renderUrl = (url: string, params?: string) => {
  return `${baseURL}${url}${params ? `?${params}` : ''}`
}
const processResponse = (promise: Promise<ApiResponse>) => {
  return promise.then(response => {
    if (!response.data?.error)
      return { error: null, data: response.data?.data ?? response.data, meta: response?.data?.meta }
    else
      return { error: response.data?.error, data: response.data?.data ?? response.data, meta: response?.data?.meta }
  }).catch(error => ({ error: error?.response?.data?.error?.details, data: error?.response?.data?.data ?? error?.response?.data ?? error?.response ?? error, meta: null }))
}

export const buildGetParams = (params: object) => {
  if (!params || Object.keys(params).length === 0) {
    return ''
  }
  return `?${Object.entries(params).map(x => (`${x[0]}=${x[1]}`)).join('&')}`
}

export const get_dex_data = () => {
  return processResponse(axios.get(renderUrl(`/dex-data`)))
}

export const get_chart_data = (params?: any) => {
  return processResponse(axios.get(renderUrl('/data-history24hs', params)))
}

export const get_list_token = (params?: any) => {
  return processResponse(axios.get(renderUrl('/tokens', params)))
}

export const get_list_user_trading = (params?: any) => {
  return processResponse(axios.get(renderUrl(`/user-tradings`, params)))
}

export const get_swap_history = (params?: any) => {
  return processResponse(axios.get(renderUrl(`/transaction-histories`, params)))
}