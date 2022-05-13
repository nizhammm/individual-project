import { Icon, FormControl, FormLabel, Stack, Input, Box, Container, Text, Button, Divider, HStack, Spacer, InputGroup, InputRightElement, FormHelperText, useToast } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { ApiError } from 'next/dist/server/api-utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import Page from '../../component/page';
import { userLogin } from '../../redux/action/auth';

const loginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const dispatch = useDispatch();

  const router = useRouter();
  const authSelector = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required('This field is required'),
      password: Yup.string().required('This field is required'),
    }),
    validateOnChange: false,
    onSubmit: (values) => {
      setTimeout(() => {
        dispatch(userLogin(values, formik.setSubmitting));
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
      <Page title={`Login`}></Page>
      <Container mt={8} alignItems="center" centerContent py="10">
        <Stack>
          <Box w="sm" shadow="2xl" p="8" borderRadius={10} borderColor="gray">
            <form>
              <FormControl isInvalid={formik.errors.username}>
                <FormLabel htmlFor="inputUsername">Username</FormLabel>
                <Input onChange={inputHandler} id="inputUsername" name="username" />
                <FormHelperText>{formik.errors.username}</FormHelperText>
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
                  <InputRightElement children={<Button h='35px' size='sm' colorScheme='teal' variant='ghost'onClick={() => setPasswordVisible(!passwordVisible)}>{!passwordVisible? "show" : "hide" }</Button>} />
                </InputGroup>
                <FormHelperText>{formik.errors.password}</FormHelperText>
              </FormControl>

              <Stack mt="10">
                <Button
                  onClick={formik.handleSubmit}
                  type="submit"
                  colorScheme='green' 
                  variant= 'solid'
                  disabled={formik.isSubmitting}

                >
                  Sign In
                </Button>
              </Stack>
            </form>

            <Stack mt={3} spacing={3}>
            {/* <Link href="./requestResetPassword">
                <Button variant="link" colorScheme="green" size="sm">
                  Forgot password?
                </Button>
              </Link> */}
              <HStack>
                <Spacer />
                <Text fontSize="md" color="muted">
                  Don't have an account?
                </Text>
                <Text>
                  <Link href={'./signup'}>
                    <Button fontSize="md" variant="link" colorScheme="green" size="sm">
                      Sign up
                    </Button>
                  </Link>
                </Text>
                <Spacer />
              </HStack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default loginPage;