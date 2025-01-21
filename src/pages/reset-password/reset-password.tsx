import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../../hooks/useForm';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

type ResetPasswordForm = {
  password: string;
};

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const { values, handleChange } = useForm<ResetPasswordForm>({
    password: ''
  });
  const password = values.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    resetPasswordApi({ password, token })
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      })
      .catch((err) => setError(err));
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      handleChange={handleChange}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
