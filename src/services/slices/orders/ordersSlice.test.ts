import { ordersSlice } from '@slices';
import { expect, test } from '@jest/globals';
import { getOrders } from '@actions';
import {
  ordersInitialState as initialState,
  mockOrder,
  mockError,
  emptyAction
} from '@mocks';

const reducer = ordersSlice.reducer;

describe('Reducer: ordersSlice', () => {
  test('должен вернуть initial state с пустым action', () => {
    const result = reducer(initialState, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('должен вернуть default initial state с пустым action', () => {
    const result = reducer(undefined, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('должен изменить статус заказов на true с action "getOrders.pending"', () => {
    const expectedState = {
      ...initialState,
      loading: true
    };

    const result = reducer(initialState, getOrders.pending('', undefined));

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть ошибку с action "getOrders.rejected"', () => {
    const expectedState = {
      ...initialState,
      error: mockError
    };

    const result = reducer(
      initialState,
      getOrders.rejected(new Error(mockError), '', undefined)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть данные с action "getOrders.fulfilled"', () => {
    const expectedState = {
      ...initialState,
      orders: [mockOrder, mockOrder]
    };

    const result = reducer(
      initialState,
      getOrders.fulfilled([mockOrder, mockOrder], '', undefined)
    );

    expect(result).toEqual(expectedState);
  });
});
