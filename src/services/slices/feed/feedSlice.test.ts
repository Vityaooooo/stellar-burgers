import { feedSlice } from '@slices';
import { expect, test } from '@jest/globals';
import { getFeedsOrder } from '@actions';
import {
  feedInitialState as initialState,
  emptyAction,
  mockError,
  mockOrderData
} from '@mocks';

const reducer = feedSlice.reducer;

describe('Reducer: feedSlice', () => {
  test('должен вернуть initial state с пустым action', () => {
    const result = reducer(initialState, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('должен вернуть default initial state с пустым action', () => {
    const result = reducer(undefined, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('должен изменить статус загрузки на true с action "getFeedsOrder.pending"', () => {
    const expectedState = {
      ...initialState,
      loading: true
    };

    const result = reducer(initialState, getFeedsOrder.pending('', undefined));

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть ошибку с action "getFeedsOrder.rejected"', () => {
    const expectedState = {
      ...initialState,
      error: mockError
    };

    const result = reducer(
      initialState,
      getFeedsOrder.rejected(new Error(mockError), '', undefined)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть данные с action "getFeedsOrder.fulfilled"', () => {
    const expectedState = {
      ...initialState,
      ...mockOrderData
    };

    const result = reducer(
      initialState,
      getFeedsOrder.fulfilled(mockOrderData, '', undefined)
    );

    expect(result).toEqual(expectedState);
  });
});
