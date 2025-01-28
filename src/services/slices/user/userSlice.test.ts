import { userSlice } from '@slices';
import { expect, test } from '@jest/globals';
import { AuthStatus, TUser } from '@utils-types';
import {
  getUser,
  updateUser,
  loginUser,
  logoutUser,
  registerUser
} from '@actions';
import {
  userInitialState as initialState,
  mockLoginData,
  mockRegisterData,
  mockUserData,
  emptyAction,
  mockError
} from '@mocks';

const reducer = userSlice.reducer;

describe('Reducer: userSlice', () => {
  test('должен вернуть initial state с пустым action', () => {
    const result = reducer(initialState, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('должен вернуть default initial state с пустым action', () => {
    const result = reducer(undefined, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('должен изменить статус загрузки входа на true с action "loginUser.pending"', () => {
    const expectedState = {
      ...initialState,
      loading: true
    };

    const result = reducer(initialState, loginUser.pending('', mockLoginData));

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть ошибку с action "loginUser.rejected"', () => {
    const expectedState = {
      ...initialState,
      error: mockError,
      authStatus: AuthStatus.NoAuth
    };

    const result = reducer(
      {
        ...initialState,
        authStatus: AuthStatus.NoAuth
      },
      loginUser.rejected(new Error(mockError), '', mockLoginData)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть данные с action "loginUser.fulfilled"', () => {
    const expectedState = {
      ...initialState,
      userData: mockUserData,
      authStatus: AuthStatus.Auth
    };

    const result = reducer(
      {
        ...initialState,
        authStatus: AuthStatus.Auth
      },
      loginUser.fulfilled(mockUserData, '', mockLoginData)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки регистрации на true с action "registerUser.pending"', () => {
    const expectedState = {
      ...initialState,
      loading: true
    };

    const result = reducer(
      initialState,
      registerUser.pending('', mockRegisterData)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть ошибку с action "registerUser.rejected"', () => {
    const expectedState = {
      ...initialState,
      error: mockError,
      authStatus: AuthStatus.NoAuth
    };

    const result = reducer(
      {
        ...initialState,
        authStatus: AuthStatus.NoAuth
      },
      registerUser.rejected(new Error(mockError), '', mockRegisterData)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть данные с action "registerUser.fulfilled"', () => {
    const expectedState = {
      ...initialState,
      userData: mockUserData,
      authStatus: AuthStatus.Auth
    };

    const result = reducer(
      {
        ...initialState,
        authStatus: AuthStatus.Auth
      },
      registerUser.fulfilled(mockUserData, '', mockRegisterData)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки выхода на true с action "logoutUser.pending"', () => {
    const expectedState = {
      ...initialState,
      loading: true
    };

    const result = reducer(initialState, logoutUser.pending('', undefined));

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть ошибку с action "logoutUser.rejected"', () => {
    const expectedState = {
      ...initialState,
      error: mockError,
      authStatus: AuthStatus.Auth
    };

    const result = reducer(
      {
        ...initialState,
        authStatus: AuthStatus.Auth
      },
      logoutUser.rejected(new Error(mockError), '', undefined)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть данные с action "logoutUser.fulfilled"', () => {
    const expectedState = {
      ...initialState,
      authStatus: AuthStatus.NoAuth
    };

    const result = reducer(
      {
        ...initialState,
        authStatus: AuthStatus.NoAuth
      },
      logoutUser.fulfilled(undefined, '', undefined)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки проверки входа пользователя на true с action "getUser.pending"', () => {
    const expectedState = {
      ...initialState,
      loading: true
    };

    const result = reducer(initialState, getUser.pending('', undefined));

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть ошибку с action "getUser.rejected"', () => {
    const expectedState = {
      ...initialState,
      error: mockError,
      authStatus: AuthStatus.NoAuth
    };

    const result = reducer(
      {
        ...initialState,
        authStatus: AuthStatus.NoAuth
      },
      getUser.rejected(new Error(mockError), '', undefined)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть данные с action "getUser.fulfilled"', () => {
    const expectedState = {
      ...initialState,
      userData: mockUserData,
      authStatus: AuthStatus.Auth
    };

    const result = reducer(
      {
        ...initialState,
        authStatus: AuthStatus.Auth,
        userData: {
          name: 'before-update',
          email: 'before-update'
        }
      },
      getUser.fulfilled(mockUserData, '', undefined)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки обновления пользователя на true с action "updateUser.pending"', () => {
    const expectedState = {
      ...initialState,
      authStatus: AuthStatus.Auth,
      loading: true
    };

    const result = reducer(
      {
        ...initialState,
        authStatus: AuthStatus.Auth
      },
      updateUser.pending('', mockUserData)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть ошибку с action "updateUser.rejected"', () => {
    const expectedState = {
      ...initialState,
      authStatus: AuthStatus.Auth,
      error: mockError
    };

    const result = reducer(
      {
        ...initialState,
        authStatus: AuthStatus.Auth
      },
      updateUser.rejected(new Error(mockError), '', mockUserData)
    );

    expect(result).toEqual(expectedState);
  });

  test('должен изменить статус загрузки на false и вернуть данные с action "getUser.fulfilled"', () => {
    const expectedState = {
      ...initialState,
      userData: mockUserData,
      authStatus: AuthStatus.Auth
    };

    const result = reducer(
      initialState,
      getUser.fulfilled(mockUserData, '', undefined)
    );

    expect(result).toEqual(expectedState);
  });
});
