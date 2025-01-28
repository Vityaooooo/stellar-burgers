import { ingredientsSlice } from '@slices';
import { expect, test } from '@jest/globals';
import { getIngredients } from '@actions';
import {
  ingredientInitialState as initialState,
  emptyAction,
  mockIngredientMain as mockIngredient,
  mockError
} from '@mocks';

const reducer = ingredientsSlice.reducer;

describe('Reducer: ingredientSlice', () => {
  test('должен вернуть initial state с пустым action', () => {
    const result = reducer(initialState, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('должен вернуть default initial state с пустым action', () => {
    const result = reducer(undefined, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('должен изменить статус загрузки на true с action "getIngredients.pending"', () => {
    const expectedState = {
      ...initialState,
      loading: true
    };

    const result = reducer(initialState, getIngredients.pending('', undefined));

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть ошибку с action "getIngredients.rejected"', () => {
    const expectedState = {
      ...initialState,
      error: mockError
    };

    const result = reducer(
      initialState,
      getIngredients.rejected(new Error(mockError), '', undefined)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть данные с action "getIngredients.fulfilled"', () => {
    const expectedState = {
      ...initialState,
      ingredients: [mockIngredient]
    };

    const result = reducer(
      initialState,
      getIngredients.fulfilled([mockIngredient], '', undefined)
    );

    expect(result).toEqual(expectedState);
  });
});
