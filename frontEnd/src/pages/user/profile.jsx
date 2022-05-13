import { Alert, Avatar, Box, Button, Flex, FormControl, FormLabel, Heading, Icon, Input, Stack, Textarea, useToast } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../lib/api';
import { auth_types } from '../../redux/types';
import jsCookie from 'js-cookie';
import Navbar from '../../component/Navbar';
import { FaFileUpload } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { useRouter } from 'next/router';

const Profile = () => {
  const authSelector = useSelector((state) => state.auth);
  const inputFileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(authSelector.image_url);
  const dispatch = useDispatch();

  const toast = useToast();

  const router = useRouter();

  const [edit, setEdit] = useState();
  const [editPic, setEditPic] = useState();

  const formik = useFormik({
    initialValues: {
      id: authSelector.id,
      username: authSelector.username,
      email: authSelector.email,
      full_name: authSelector.full_name,
      bio: authSelector.bio,
      image_url: authSelector.image_url,
      is_verified: authSelector.is_verified,
    },
  });

  const inputHandler = (event) => {
    const { value, name } = event.target;

    formik.setFieldValue(name, value);
  };

  const handelFile = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log(event.target.files[0]);
  };

  const uploadProfilPicHandler = async () => {
    const formData = new FormData();

    formData.append('profile_image_file', selectedFile);

    try {
      const res = await api.patch('/auth/profile/picture', formData);
      const data = res.data.result;

      console.log(data);
      const updateData = { ...formik.values, ...data };
      console.log(updateData);
      const stringifyData = JSON.stringify(updateData);

      jsCookie.remove('user_data');
      jsCookie.set('user_data', stringifyData);

      const savedUserData = jsCookie.get('user_data');
      if (savedUserData) {
        const parsedUserData = JSON.parse(savedUserData);

        dispatch({
          type: auth_types.LOGIN_USER,
          payload: parsedUserData,
        });
      }
      formik.setSubmitting(false);
      setEditPic(!editPic);

    } catch (err) {
      console.log(err);
    }
  };
  const editProfilData = async () => {
    console.log(authSelector.id);
    try {
      const updateData = {
        username: formik.values.username ? formik.values.username : authSelector.username,
        id: authSelector.id,
        email: authSelector.email,
        bio: formik.values.bio ? formik.values.bio : authSelector.bio,
        image_url: authSelector.image_url,
        is_verified: authSelector.is_verified,
        full_name: formik.values.full_name ? formik.values.full_name : authSelector.full_name,
      };
      console.log(updateData);

      const res = await api.patch('/auth/profile', updateData);
      const data = res.data.result;

      console.log(data);
      const stringifyData = JSON.stringify(data);

      jsCookie.remove('user_data');
      jsCookie.set('user_data', stringifyData);

      const savedUserData = jsCookie.get('user_data');
      if (savedUserData) {
        const parsedUserData = JSON.parse(savedUserData);

        dispatch({
          type: auth_types.LOGIN_USER,
          payload: parsedUserData,
        });
      }
      formik.setSubmitting(false);
      setEdit(!edit);

    } catch (err) {
      console.log(err);
    }
  };

  // const resendVerifiedEmail = async () => {
  //   try {
  //     await api.post('/auth/resend-verification');

  //     toast({
  //       title: 'Verify Account',
  //       description: `Verify email has been send, check your email`,
  //       status: 'warning',
  //       duration: 9000,
  //       isClosable: true,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  console.log(authSelector);

  return (
    <>
      <Flex boxSizing="sm" justify={'center'} mt={4}>
        <Stack borderRadius={10} shadow="dark-lg">
          <Flex justifyContent="center">
            <Heading mt={3} lineHeight={1.1} fontSize={{ base: 'lg', sm: 'xl' }}>
              User Profile
            </Heading>
          </Flex>
          {/* <Flex hidden={authSelector.is_verified} justify={'center'}>
            <Button size="xs" colorScheme="yellow" cursor="pointer" onClick={() => resendVerifiedEmail()}>
              verifiy Account
            </Button>
          </Flex> */}
          <Flex mt={5} justify={'center'}>
            <Avatar size="xl" src={authSelector.image_url}></Avatar>
          </Flex>
          {editPic ? (
            <>
              <Flex mt={5} justify={'center'}>
                <Input accept="image/png, image/jpeg" display="none" type="file" id="image_url" name="image_url" onChange={handelFile} ref={inputFileRef} />
                <Button size="xs" onClick={() => inputFileRef.current.click()} colorScheme="facebook">
                  choose File
                </Button>
              </Flex>
              <Flex justify={'center'}>
                <Box>
                  <Icon as={FaFileUpload} boxSize={6} onClick={() => uploadProfilPicHandler()} color="green" disabled={formik.setSubmitting} />
                  <Icon ms="4" as={MdCancel} boxSize={6} onClick={() => setEditPic(!editPic)} color="red.600" disabled={formik.setSubmitting} />
                </Box>
              </Flex>
            </>
          ) : (
            <Flex justify="center">
              <Button size="xs" onClick={() => setEditPic(!editPic)} colorScheme="facebook">
                Change Profile Picture
              </Button>
            </Flex>
          )}

          <Box boxSizing="sm" p={6}>
            <Stack>
              <FormControl>
                <FormLabel fontSize="xs">Username</FormLabel>
                <Input size="xs" fontSize="sm" id="username" name="username" isDisabled={edit ? false : true} onChange={inputHandler} defaultValue={authSelector.username} />

                <FormLabel mt={2} fontSize="xs">
                  Full Name
                </FormLabel>
                <Input size="xs" fontSize="sm" isDisabled={edit ? false : true} id="full_name" name="full_name" onChange={inputHandler} defaultValue={authSelector.full_name} />

                <FormLabel fontSize="xs" mt={2}>
                  Email Address
                </FormLabel>
                <Input size="xs" fontSize="sm" isDisabled onChange={inputHandler} defaultValue={authSelector.email} />

                <FormLabel fontSize="xs" mt={2}>
                  Bio
                </FormLabel>
                <Textarea size="xs" fontSize="sm" id="bio" name="bio" isDisabled={edit ? false : true} onChange={inputHandler} defaultValue={authSelector.bio} />
              </FormControl>
            </Stack>
          </Box>

          <Flex justify={'end'}>
            {edit ? (
              <Button size="sm" mb={3} me={3} onClick={() => setEdit(!edit)} colorScheme="orange" >
                cancel
              </Button>
            ) : (
              <Button size="sm" mb={3} me={3} onClick={() => setEdit(!edit)} colorScheme="messenger" >
                edit
              </Button>
            )}
            <Button mb={3} me={3} size="sm" hidden={edit ? false : true} onClick={editProfilData} colorScheme="facebook">
              Submit
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </>
  );
};

export default Profile;