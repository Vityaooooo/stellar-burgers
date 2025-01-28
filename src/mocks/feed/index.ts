import { TOrdersData } from '@utils-types';

type TFeedState = TOrdersData & {
  error: string | null;
  loading: boolean;
};

export const feedInitialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
  loading: false
};
