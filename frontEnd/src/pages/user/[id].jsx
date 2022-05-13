import { Avatar, Box, Flex, Spacer, Spinner, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import ContentCard from '../../component/ContentCard';
import useFetch from '../../lib/hooks/usefetch';
import useFetchUser from '../../lib/hooks/useFetchUser';
import moment from 'moment';
import NextLink from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { post_types } from '../../redux/types';
import Page from '../../component/page';
import InfiniteScroll from 'react-infinite-scroll-component';

const UserDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch([]);
  const postSelector = useSelector((state) => state.post);
  const authSelector = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);

  const { id } = router.query;
  const [profile] = useFetchUser(`/auth/user/${id}`);
  const [activitiesData] = useFetchUser(`/posts/like/${id}`);
  const [count, setCount] = useState();

  const limitPage = 5;

  const fetchNextPage = () => {
    setPage(page + 1);
  };

  const fetchPost = async () => {
    const res = await api.get(`/posts/user/${id}`, {
      params: {
        _limit: limitPage,
        _page: page,
      },
    });

    if (page === 1) {
      dispatch({
        type: post_types.FETCH_POST,
        payload: res?.data?.result?.rows,
      });
    } else {
      dispatch({
        type: post_types.UPDATE_POST,
        payload: res?.data?.result?.rows,
      });
    }

    setCount(res?.data?.result?.count);
  };

  const data = postSelector.postList;

  const renderPost = () => {
    return data.map((post, index) => {
      return (
        <ContentCard
          caption={post.caption}
          profilPic={post.User.image_url}
          userId={post.UserId}
          username={post.User.username}
          location={post.location}
          likes={post.like_count}
          image={post.image_url}
          id={post.id}
          comment={post.Comments}
          createDate={post.createdAt}
          index={index}
          //
        />
      );
    });
  };

  const datalength = data.length;

  useEffect(() => {
    if (router.isReady) {
      fetchPost();
    } else if (authSelector.is_verifed) {
      router.push('user/profile');
    }
  }, [router.isReady, page]);

  const renderProfile = () => {
    return (
      <Box w={200} padding={3} ms="5" mt={8} shadow="inner" bgColor="gray.100" borderRadius="4">
        <Flex justify="center">
          <Avatar size="xl" src={profile.image_url} border="3px solid teal" />
        </Flex>
        <Text fontWeight="bold" textAlign="center">{`@${profile.username}`}</Text>
        <Text textAlign="center">{profile.full_name}</Text>
        <Text textAlign="center">{profile.bio}</Text>
      </Box>
    );
  };
  const renderActivities = () => {
    return activitiesData.map((val) => {
      return (
        <NextLink href={`/posts/${val.Post.id}`}>
          <Box cursor="pointer" padding={3} mt="2" shadow="lg" bgColor="gray.100" borderRadius="4">
            <Text textAlign="center">{`${profile.username} loved ${val.Post.User.username} Post, ${moment(val.createdAt).startOf('day').fromNow()}`}</Text>
          </Box>
        </NextLink>
      );
    });
  };

  return (
    <>
      <Page title={`${authSelector.full_name} || ${authSelector.username}`}></Page>
      <Box>
        <Flex justify="space-around">
          <Box>
            <Box>{renderProfile()}</Box>
            <Box mt={8}>{renderActivities()}</Box>
          </Box>

          <InfiniteScroll
            dataLength={datalength}
            next={() => fetchNextPage()}

            hasMore={datalength === count ? false : true}
            loader={
              <Flex mt="5" alignItems="center" justifyContent="center">
                <Spinner />
                <h4>Loading...</h4>
              </Flex>
            }
            endMessage={<Text textAlign="center">you have seen all!</Text>}
            scrollThreshold={1}
            onScroll

          >
            {renderPost()}
          </InfiniteScroll>
        </Flex>
      </Box>
    </>
  );
};

export default UserDetails;