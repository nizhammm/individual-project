import { useDispatch, useSelector } from 'react-redux';
import { auth_types } from '../redux/types';
import { useEffect, useState } from 'react';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const authselector = useSelector((state) => state.auth);

  useEffect(() => {
    const token = jsCookie.get('auth_token');
    const savedUserData = jsCookie.get('user_data');
    if (savedUserData) {
      const parsedUserData = JSON.parse(savedUserData);

      dispatch({
        type: auth_types.LOGIN_USER,
        payload: parsedUserData,
      });
    }
  }, []);

  return <>{children}</>;
};

export default AuthProvider;