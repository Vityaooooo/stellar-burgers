import {
  burgerConstructorSlice,
  addToConstructor,
  removeFromConstructor,
  reorderConstruct,
  cleanConstructor
} from '@slices';
import { expect, test } from '@jest/globals';
import {
  mockNanoId,
  burgerConstructorInitialState as initialState,
  mockIngredientBun,
  mockIngredientMain,
  emptyAction
} from '@mocks';

jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  nanoid: jest.fn(() => 'test-id')
}));

const reducer = burgerConstructorSlice.reducer;

describe('Reducer: burgerConstructor', () => {
  test('должен вернуть initial state с пустым action', () => {
    const result = reducer(initialState, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('должен вернуть default initial state с пустым action', () => {
    const result = reducer(undefined, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('должен вернуть новоe значение ingredient с action "addToConstructor"', () => {
    const expectedState = {
      ...initialState,
      indgredients: [{ ...mockIngredientMain, id: mockNanoId }]
    };

    const result = reducer(initialState, addToConstructor(mockIngredientMain));

    expect(result).toEqual(expectedState);
  });

  test('должен вернуть новоe значение bun с action "addToConstructor"', () => {
    const expectedState = {
      ...initialState,
      bun: { ...mockIngredientBun, id: mockNanoId }
    };

    const result = reducer(initialState, addToConstructor(mockIngredientBun));

    expect(result).toEqual(expectedState);
  });

  test('должен удалить значение bun с action "removeFromConstructor"', () => {
    const expectedState = initialState;

    const result = reducer(
      { ...initialState, bun: { ...mockIngredientBun, id: mockNanoId } },
      removeFromConstructor(mockNanoId)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен удалить значение из массива ingredients с action "removeFromConstructor"', () => {
    const expectedState = {
      ...initialState,
      indgredients: [{ ...mockIngredientMain, id: 'not_deleted' }]
    };

    const result = reducer(
      {
        ...initialState,
        indgredients: [
          { ...mockIngredientMain, id: mockNanoId },
          { ...mockIngredientMain, id: 'not_deleted' }
        ]
      },
      removeFromConstructor(mockNanoId)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен очищать конструктор с action "cleanConstructor"', () => {
    const expectedState = initialState;

    const result = reducer(
      {
        bun: { ...mockIngredientBun, id: mockNanoId },
        indgredients: [{ ...mockIngredientMain, id: mockNanoId }]
      },
      cleanConstructor()
    );

    expect(result).toEqual(expectedState);
  });

  test('должен поменять порядок ingredients в конструкторе с action "reorderConstruct"', () => {
    const expectedState = {
      ...initialState,
      indgredients: [
        { ...mockIngredientMain, id: '2' },
        { ...mockIngredientMain, id: '1' }
      ]
    };

    const result = reducer(
      {
        ...initialState,
        indgredients: [
          { ...mockIngredientMain, id: '1' },
          { ...mockIngredientMain, id: '2' }
        ]
      },
      reorderConstruct({ from: 0, to: 1 })
    );

    expect(result).toEqual(expectedState);
  });
});
