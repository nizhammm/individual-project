import { Avatar, Box, Button, Flex, HStack, MenuButton, MenuItem, MenuList, Text, Menu, Icon } from '@chakra-ui/react';
import jsCookie from 'js-cookie';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth_types } from '../redux/types';
import { useRouter } from 'next/router';
import PostContent from './Upload';
import Link from 'next/link';
import { ImHome } from 'react-icons/im';

const Navbar = ({ hidden }) => {
  const authSelector = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const logoutBtnHandler = () => {
    dispatch({
      type: auth_types.LOGOUT_USER,
    });

    jsCookie.remove('user_data');
    jsCookie.remove('auth_token');
    router.push('/auth/login');
  };

  if (!authSelector.id) {
    return null;
  }
  return (
    <Flex hidden={hidden} height="20" bgColor="teal.400" alignItems="center" justifyContent="space-between">
      <HStack>
        <Menu>
          <MenuButton>
            <Avatar size="lg" ms={6} name={authSelector.full_name} src={authSelector.image_url} />
          </MenuButton>
          <MenuList>
            <Link href={'/user/profile'}>
              <MenuItem>Profile</MenuItem>
            </Link>
            <MenuItem onClick={logoutBtnHandler}>Sign out</MenuItem>
          </MenuList>
        </Menu>
        <Box>
          <Text>{authSelector.username}</Text>
          <Text fontWeight={'medium'}>{authSelector.full_name}</Text>
        </Box>
      </HStack>

      <HStack me={6} spacing={4}>
        <Link href={'/'}>
          <Icon boxSize={8} as={ImHome} cursor="pointer" />
        </Link>
        <PostContent />
      </HStack>
    </Flex>
  );
};

export default Navbar;