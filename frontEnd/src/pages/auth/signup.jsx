import { Icon, FormControl, FormLabel, Stack, Input, Box, Container, Text, Button, InputGroup, InputRightElement, FormHelperText, useToast, Alert, AlertIcon, Flex, HStack } from '@chakra-ui/react';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import Page from '../../component/page';
import api from '../../lib/api';

const signupPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setrepeatPasswordVisible] = useState(false);

  const router = useRouter();
  const authSelector = useSelector((state) => state.auth);
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      email: '',
      full_name: '',
      repeatPassword: '',
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required('This field is required'),
      password: Yup.string()
        .required('This field is required')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, 'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'),
      email: Yup.string().required('This field is required').email('invalid email'),
      full_name: Yup.string().required('This field is required'),
      repeatPassword: Yup.string().required('This field is required'),
    }),
    validateOnChange: false,
    onSubmit: (values) => {
      console.log(values);
      setTimeout(async () => {
        try {
          const res = await api.post('/auth/register', values);

          if (res.data.message !== undefined) {
            toast({
              title: 'Account created.',
              description: `${res.data.message} check your email for verify your new account `,
              status: 'success',
              duration: 9000,
              isClosable: true,
            });
          }
          formik.setSubmitting(false);
        } catch (err) {
          console.log(err);
          formik.setSubmitting(false);
        }
      }, 3000);
    },
  });

  const inputHandler = (event) => {
    const { value, name } = event.target;
    formik.setFieldValue(name, value);
  };

  useEffect(() => {
    if (authSelector.id) {
      router.push('/');
    }
  }, [authSelector.id]);
  return (
    <>
      <Page
        title={`signup`}

      ></Page>
      <Container mt={8} alignItems="center" centerContent py="10">
        <Stack>
          <Box w="sm" shadow="2xl" p="8" borderRadius={10} borderColor="gray">
            <form>
              <FormControl isInvalid={formik.errors.username}>
                <FormLabel htmlFor="inputUsername">Username</FormLabel>
                <Input onChange={inputHandler} id="inputUsername" name="username" />
                <FormHelperText>{formik.errors.username}</FormHelperText>
              </FormControl>

              <FormControl isInvalid={formik.errors.email}>
                <FormLabel htmlFor="inputemail">Email</FormLabel>
                <Input onChange={inputHandler} id="inputemail" name="email" />
                <FormHelperText>{formik.errors.email}</FormHelperText>
              </FormControl>

              <FormControl isInvalid={formik.errors.full_name}>
                <FormLabel htmlFor="inputfull_name">Full Name</FormLabel>
                <Input onChange={inputHandler} id="inputfull_name" name="full_name" />
                <FormHelperText>{formik.errors.full_name}</FormHelperText>
              </FormControl>

              <FormControl isInvalid={formik.errors.password}>
                <FormLabel mt="4" htmlFor="inputPassword">
                  Password
                </FormLabel>
                <InputGroup>
                  <Input
                    type={passwordVisible ? 'text' : 'password'}
                    id="inputPassword"
                    onChange={inputHandler}
                    name="password"

                  />
                  <InputRightElement
                    children={<Button h='35px' size='sm' 
                    colorScheme='teal' 
                    variant='ghost'onClick={() => setPasswordVisible(!passwordVisible)}>{!passwordVisible? "show" : "hide" }</Button>}

                  />
                </InputGroup>
                <FormHelperText>{formik.errors.password}</FormHelperText>
              </FormControl>

              <FormControl isInvalid={formik.errors.repeatPassword}>
                <FormLabel mt="4" htmlFor="inputrepeatPassword">
                  Repeat Password
                </FormLabel>
                <InputGroup>
                  <Input
                    type={repeatPasswordVisible ? 'text' : 'password'}
                    id="inputrepeatPassword"
                    onChange={inputHandler}
                    repeatP
                    name="repeatPassword"

                  />
                  <InputRightElement
                    children={<Button h='35px' size='sm' 
                    colorScheme='teal' 
                    variant='ghost'onClick={() => setrepeatPasswordVisible(!repeatPasswordVisible)}>{!repeatPasswordVisible? "show" : "hide" }</Button>}

                  />
                </InputGroup>
                <FormHelperText>{formik.errors.repeatPassword}</FormHelperText>
              </FormControl>

              <Stack mt="10">
                <Button
                  onClick={formik.handleSubmit}
                  type="submit"
                  h='35px' size='sm' colorScheme='green' variant='solid'
                  disabled={formik.isSubmitting}

                >
                  Sign Up
                </Button>
              </Stack>
            </form>
            <Flex mt={4} justify="center">
              <Text me={2}>Already have an account ? </Text>
              <Link href={'/auth/login'}>
                <Text>
                  <Button fontSize="md" variant="link" colorScheme="green" size="sm">
                    Login
                  </Button>
                </Text>
              </Link>
            </Flex>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default signupPage;