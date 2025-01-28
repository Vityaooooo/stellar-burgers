import { TOrder } from '@utils-types';

type TOrderState = {
  newOrderData: TOrder | null;
  newOrderLoading: boolean;
  newOrderError: string | null;
  orderByNumber: TOrder | null;
  orderByNumberLoading: boolean;
  orderByNumberError: string | null;
};

export const orderInitialState: TOrderState = {
  newOrderData: null,
  newOrderLoading: false,
  newOrderError: null,
  orderByNumber: null,
  orderByNumberLoading: false,
  orderByNumberError: null
};
