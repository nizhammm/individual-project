import { Center, Spinner } from '@chakra-ui/react';
import { Router, useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const index = () => {
  const authSelector = useSelector((state) => state.auth);
  const router = useRouter();
  useEffect(() => {
    // if (authSelector.id) {
      router.push('/home');
    // } 
    // else router.push('/auth/login');
  }, []);
  return (
    <>
      <Center>
        <Spinner />
        <div>Loading</div>
      </Center>
    </>
  );
};

export default index;