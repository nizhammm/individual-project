import { Button, Center, Stack, Text } from '@chakra-ui/react';
import jsCookie from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { auth_types } from '../../redux/types';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const VerificationPage = () => {
  const authSelector = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: auth_types.LOGOUT_USER,
    });

    jsCookie.remove('user_data');
    jsCookie.remove('auth_token');
    router.push('/auth/login');
  });
  return (
    <Center mt="50">
      <Stack>
        <h1>Account has been verified</h1>

        <Text>Redirect to Login Page</Text>
      </Stack>
    </Center>
  );
};

export default VerificationPage;