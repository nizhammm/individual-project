import { Box, Flex, Spinner, Text, useToast } from '@chakra-ui/react';
import Head from 'next/head';
import ContentCard from '../component/ContentCard';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { comment_types, post_types } from '../redux/types';
import api from '../lib/api';
import Page from '../component/page';
import { useRouter } from 'next/router';

export default function Home() {
  const [page, setPage] = useState(1);
  const [more, setmore] = useState(1);
  const [count, setCount] = useState();
  const toast = useToast();

  const router = useRouter();
  const authSelector = useSelector((state) => state.auth);

  const dispatch = useDispatch([]);
  const postSelector = useSelector((state) => state.post);

  const limitPage = 100;

  const fetchNextPage = () => {
    setPage(page + 1);
  };

  const fetchPost = async () => {
    console.log('hit')
    const res = await api.get('/posts', {
      params: {
        _limit: limitPage,
        _page: [page, more],
      },
    });

    console.log(res.data.rows)
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

    // }

    setCount(res?.data?.result?.count);
  };

  // console.log(postSelector);

  const data = postSelector.postList;
  const datalength = data.length;

  useEffect(() => {
    if (!authSelector.id) {
      router.push('/');
    } 
  
      fetchPost();
  }, [page]);

  const renderPost = () => {
    return data.map((post, index) => {
      return (
        <Box m={4}>
          <ContentCard
            caption={post?.caption}
            profilPic={post?.User?.image_url}
            userId={post?.UserId}
            username={post?.User?.username}
            location={post?.location}
            likes={post?.like_count}
            image={post?.image_url}
            id={post?.id}
            comment={post?.Comments}
            createDate={post?.createdAt}
            index={index}
          />
        </Box>
      );
    });
  };

  return (
    <>
      <Page
        title={`Home || ${authSelector.username}`}
        // description={post.caption}
        // image={post.image_url}
        // url={`${WEB_URL}${router.asPath}`}
        //
      ></Page>
      <InfiniteScroll
        dataLength={datalength}
        next={() => fetchNextPage()}
        // hasMore={(page * limitPage) % count === page * limitPage ? true : false}
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
        //
      >
        {renderPost()}
      </InfiniteScroll>
    </>
  );
}
