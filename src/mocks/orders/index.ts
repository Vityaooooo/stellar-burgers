import { TOrder } from '@utils-types';

type TOrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

export const ordersInitialState: TOrdersState = {
  orders: [],
  loading: false,
  error: null
};
