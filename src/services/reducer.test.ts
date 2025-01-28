import { rootReducer } from './reducer';
import { expect, test, describe } from '@jest/globals';
import store from './store';

describe('RootReducer initial', () => {
  test('should initiate correctly and return the initial state', () => {
    const initAction = { type: '@@INIT' };
    const expectedState = store.getState();

    const resultState = rootReducer(undefined, initAction);

    expect(resultState).toEqual(expectedState);
  });
});
