'use server'
import axios from "axios"
import { cookies } from 'next/headers'

export const setCookiesSV = (key: string, value: any) => {
  if (!key) {
    return
  }
  cookies().set(key, value)
}

export const getCookiesSV = (key: string) => {
  if (!key) return null;
  return cookies().get(key)?.value
}

export const removeCookiesSV = (key: string) => {
  if (!key) return;
  cookies().delete(key)
}
export const getSVAsync = async (url: string, param?: any) => {
  let data: any = undefined;
  let isError = false;
  let error = "";
  try {
    const access_token_cookie = cookies().get('access_token')?.value
    const res = await axios({
      method: "GET",
      url,
      headers: {
        Authorization: access_token_cookie ? `Bearer ${access_token_cookie}` : '',
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      params: param || "",
    });
    data = res.data
  } catch (e: any) {
    isError = true;

    const error_data = e?.response?.data || {}
    if (e?.response?.status === 401 && (!error_data?.Message && !error_data?.Error && !error_data?.err)) {
      removeCookiesSV('access_token');
      error = 'Unauthorized';
      return { data, isError, error };
    }
    if (error_data?.Message || error_data?.Error || error_data?.err) {
      error = `${error_data?.Message ? `${error_data?.Message}.` : ''} ${error_data?.err}` || error_data?.Error || error_data?.err
    } else {
      if (typeof e === "string") error = e;
      else if (e instanceof Error) error = e.message;
      else error = "Error";
    }
  }

  return { data, isError, error };
}

export const postSVAsync = async (url: string, data_body: any, header_config?: any) => {
  let data: any = undefined;
  let isError = false;
  let error = "";

  try {
    const access_token_cookie = cookies().get('access_token')?.value
    const header_config_default = {
      headers: {
        Authorization: access_token_cookie ? `Bearer ${access_token_cookie}` : '',
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
    const res = await axios.post(url, data_body, header_config ?? header_config_default);
    data = res.data
  } catch (e: any) {
    isError = true;
    const error_data = e?.response?.data || {}
    if (e?.response?.status === 401 && (!error_data?.Message && !error_data?.Error && !error_data?.err)) {
      removeCookiesSV('access_token');
      error = 'Unauthorized';
      return { data, isError, error };
    }

    if (error_data?.Message || error_data?.Error || error_data?.err) {
      error = `${error_data?.Message ? `${error_data?.Message}.` : ''} ${error_data?.err}` || error_data?.Error || error_data?.err
    } else {
      if (typeof e === "string") error = e;
      else if (e instanceof Error) error = e.message;
      else error = "Error";
    }
  }

  return { data, isError, error };
}

export const generateURL = (url: string) => {
  return `${process.env.NEXT_PUBLIC_API_BE}${url}`
}