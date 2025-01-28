import { orderSlice, clearOrder } from '@slices';
import { expect, test } from '@jest/globals';
import { getOrderByNumber, postNewOrder } from '@actions';
import {
  orderInitialState as initialState,
  mockError,
  emptyAction,
  mockOrder,
  mockIngredientOrder
} from '@mocks';

const reducer = orderSlice.reducer;

describe('Reducer: orderSlice', () => {
  test('должен вернуть initial state с пустым action', () => {
    const result = reducer(initialState, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('должен вернуть default initial state с пустым action', () => {
    const result = reducer(undefined, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('должен изменить статус загрузки заказа по номеру на true с action "getOrderByNumber.pending"', () => {
    const expectedState = {
      ...initialState,
      orderByNumberLoading: true
    };

    const result = reducer(initialState, getOrderByNumber.pending('', 1));

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть ошибку с action "getOrderByNumber.rejected"', () => {
    const expectedState = {
      ...initialState,
      orderByNumberError: mockError
    };

    const result = reducer(
      initialState,
      getOrderByNumber.rejected(new Error(mockError), '', 1)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть данные с action "getOrderByNumber.fulfilled"', () => {
    const expectedState = {
      ...initialState,
      orderByNumber: mockOrder
    };

    const result = reducer(
      initialState,
      getOrderByNumber.fulfilled([mockOrder], '', 1)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки заказа по номеру на true с action "postNewOrder.pending"', () => {
    const expectedState = {
      ...initialState,
      newOrderLoading: true
    };

    const result = reducer(
      initialState,
      postNewOrder.pending('', mockIngredientOrder)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки о новом заказе на false и вернуть ошибку с action "postNewOrder.rejected"', () => {
    const expectedState = {
      ...initialState,
      newOrderError: mockError
    };

    const result = reducer(
      initialState,
      postNewOrder.rejected(new Error(mockError), '', mockIngredientOrder)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки о новом заказе на false и вернуть данные с action "postNewOrder.fulfilled"', () => {
    const expectedState = {
      ...initialState,
      newOrderData: mockOrder
    };

    const result = reducer(
      initialState,
      postNewOrder.fulfilled(mockOrder, '', mockIngredientOrder)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен очистить информацию о новом заказе с action "clearOrder"', () => {
    const expectedState = initialState;

    const result = reducer(
      {
        ...initialState,
        newOrderData: mockOrder
      },
      clearOrder()
    );

    expect(result).toEqual(expectedState);
  });
});
