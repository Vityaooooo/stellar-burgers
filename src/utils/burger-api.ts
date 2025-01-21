import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TUser } from './types';

const URL = process.env.BURGER_API_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

const checkSuccess = <T>(res: TServerResponse<T>) => {
  if (res && res.success) {
    return res;
  }
  return Promise.reject(res);
};

const request = <T extends { success: boolean }>(
  endpoint: string,
  options?: RequestInit
): Promise<T> =>
  fetch(`${URL}${endpoint}`, options)
    .then((res) => checkResponse<T>(res))
    .then(checkSuccess);

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

type TOrdersResponse = TServerResponse<{
  data: TOrder[];
}>;

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export type TLoginData = {
  email: string;
  password: string;
};

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getIngredientsApi = () =>
  request<TIngredientsResponse>('ingredients');

// export const getIngredientsApi = () =>
//   fetch(`${URL}/ingredients`)
//     .then((res) => checkResponse<TIngredientsResponse>(res))
//     .then((data) => {
//       if (data?.success) return data.data;
//       return Promise.reject(data);
//     });

export const getFeedsApi = () => request<TFeedsResponse>('orders/all');

// export const getFeedsApi = () =>
//   fetch(`${URL}/orders/all`)
//     .then((res) => checkResponse<TFeedsResponse>(res))
//     .then((data) => {
//       if (data?.success) return data;
//       return Promise.reject(data);
//     });

export const getOrdersApi = () =>
  request<TFeedsResponse>('orders', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  });

// export const getOrdersApi = () =>
//   fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json;charset=utf-8',
//       authorization: getCookie('accessToken')
//     } as HeadersInit
//   }).then((data) => {
//     if (data?.success) return data.orders;
//     return Promise.reject(data);
//   });

export const orderBurgerApi = (data: string[]) =>
  request<TServerResponse<TNewOrderResponse>>('orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  });

// export const orderBurgerApi = (data: string[]) =>
//   fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json;charset=utf-8',
//       authorization: getCookie('accessToken')
//     } as HeadersInit,
//     body: JSON.stringify({
//       ingredients: data
//     })
//   }).then((data) => {
//     if (data?.success) return data;
//     return Promise.reject(data);
//   });

export const getOrderByNumberApi = (number: number) =>
  request<TOrderResponse>(`orders/${number}`);

// export const getOrderByNumberApi = (number: number) =>
//   fetch(`${URL}/orders/${number}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   }).then((res) => checkResponse<TOrderResponse>(res));

export const registerUserApi = (data: TRegisterData) =>
  request<TAuthResponse>('auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

// export const registerUserApi = (data: TRegisterData) =>
//   fetch(`${URL}/auth/register`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json;charset=utf-8'
//     },
//     body: JSON.stringify(data)
//   })
//     .then((res) => checkResponse<TAuthResponse>(res))
//     .then((data) => {
//       if (data?.success) return data;
//       return Promise.reject(data);
//     });

export const loginUserApi = (data: TLoginData) =>
  request<TAuthResponse>('auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

// export const loginUserApi = (data: TLoginData) =>
//   fetch(`${URL}/auth/login`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json;charset=utf-8'
//     },
//     body: JSON.stringify(data)
//   })
//     .then((res) => checkResponse<TAuthResponse>(res))
//     .then((data) => {
//       if (data?.success) return data;
//       return Promise.reject(data);
//     });

export const forgotPasswordApi = (data: { email: string }) =>
  request<TServerResponse<{}>>('password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

// export const forgotPasswordApi = (data: { email: string }) =>
//   fetch(`${URL}/password-reset`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json;charset=utf-8'
//     },
//     body: JSON.stringify(data)
//   })
//     .then((res) => checkResponse<TServerResponse<{}>>(res))
//     .then((data) => {
//       if (data?.success) return data;
//       return Promise.reject(data);
//     });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  request<TServerResponse<{}>>('password-reset/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

// export const resetPasswordApi = (data: { password: string; token: string }) =>
//   fetch(`${URL}/password-reset/reset`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json;charset=utf-8'
//     },
//     body: JSON.stringify(data)
//   })
//     .then((res) => checkResponse<TServerResponse<{}>>(res))
//     .then((data) => {
//       if (data?.success) return data;
//       return Promise.reject(data);
//     });

export const getUserApi = () =>
  request<TUserResponse>('auth/user', {
    headers: {
      authorization: getCookie('accessToken')
    } as HeadersInit
  });

// export const getUserApi = () =>
//   fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
//     headers: {
//       authorization: getCookie('accessToken')
//     } as HeadersInit
//   });

export const updateUserApi = (user: Partial<TRegisterData>) =>
  request<TUserResponse>('auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });

// export const updateUserApi = (user: Partial<TRegisterData>) =>
//   fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json;charset=utf-8',
//       authorization: getCookie('accessToken')
//     } as HeadersInit,
//     body: JSON.stringify(user)
//   });

export const logoutApi = () =>
  request<TServerResponse<{}>>('auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  });

// export const logoutApi = () =>
//   fetch(`${URL}/auth/logout`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json;charset=utf-8'
//     },
//     body: JSON.stringify({
//       token: localStorage.getItem('refreshToken')
//     })
//   }).then((res) => checkResponse<TServerResponse<{}>>(res));
