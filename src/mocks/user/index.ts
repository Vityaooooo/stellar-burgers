import { AuthStatus, TUser } from '@utils-types';

type TUSerState = {
  userData: TUser;
  error: string | null;
  loading: boolean;
  authStatus: AuthStatus;
};

export const userInitialState: TUSerState = {
  authStatus: AuthStatus.Unknown,
  userData: {
    email: '',
    name: ''
  },
  error: null,
  loading: false
};

export const mockLoginData = {
  email: 'mock-email',
  password: 'mock-password'
};

export const mockRegisterData = {
  ...mockLoginData,
  name: 'mock-name'
};

export const mockUserData = {
  email: 'mock-email',
  name: 'mock-name'
};
