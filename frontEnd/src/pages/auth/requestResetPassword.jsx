import { Box, Button, Flex, FormControl, FormHelperText, FormLabel, Input, Text, useToast } from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import api from '../../lib/api';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSelector } from 'react-redux';

const requestResetPassword = () => {
  const toast = useToast();
  const router = useRouter();

  const authSelector = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required('This field is required').email('invalid email'),
    }),
    validateOnChange: false,
    onSubmit: (values) => {
      console.log(values);
      setTimeout(async () => {
        try {
          await api.post(`/auth/forgot-password-email`, formik.values);

          console.log(formik.values);
          toast({
            title: 'Reset Password',
            description: 'confirmation has been send to your email',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
          router.push('/auth/login');
        } catch (err) {
          console.log(err);
          toast({
            title: 'error',
            description: err.message,
            status: 'error',
          });
        }
      }, 3000);
      formik.setSubmitting(false);
    },
  });

  const inputHandler = (event) => {
    const { value, name } = event.target;
    formik.setFieldValue(name, value);
  };

  useEffect(() => {
    if (authSelector.id) {
      router.push('/home');
    }
  }, []);

  return (
    <Flex justify="center" mt="10">
      <Box w="sm" shadow="2xl" p="8" borderRadius={10} bgColor="gray.100">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Reset password
        </Text>
        <Text textAlign="center">Enter your email to reset your password</Text>
        <form>
          <FormControl mt="2" isInvalid={formik.errors.email}>
            <FormLabel htmlFor="inputEmail">Email</FormLabel>
            <Input onChange={inputHandler} id="inputEmail" name="email" bgColor="white" />
            <FormHelperText>{formik.errors.email}</FormHelperText>
          </FormControl>

          <Flex mt="3" justify="center">
            <Button
              onClick={formik.handleSubmit}
              type="submit"
              colorScheme="blue"
              disabled={formik.isSubmitting}

            >
              Reset password
            </Button>
          </Flex>
        </form>
        <Flex mt={4} justify="center">
          <Text me={2}>Back to </Text>
          <Link href={'/auth/login'}>
            <Text>
              <Button fontSize="md" variant="link" colorScheme="blue" size="sm">
                Login
              </Button>
            </Text>
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
};

export default requestResetPassword;