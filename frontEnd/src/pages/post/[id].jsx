import {
    Icon,
    Box,
    Button,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    useDisclosure,
    PopoverBody,
    PopoverCloseButton,
    PopoverArrow,
    PopoverHeader,
    Image,
    Flex,
    Avatar,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Text,
    Divider,
  } from '@chakra-ui/react';
  import { useRouter } from 'next/router';
  import { BiCopy } from 'react-icons/bi';
  import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
  import ContentCard from '../../component/ContentCard';
  import Page from '../../component/page';
  import { useEffect, useState } from 'react';
  import { WEB_URL } from '../../configs/url';
  import api from '../../lib/api';
  import { MdShare } from 'react-icons/md';
  import NextLink from 'next/link';
  import { BsThreeDotsVertical } from 'react-icons/bs';
  import moment from 'moment';

  const postDetail = ({ post }) => {
    const router = useRouter();
    const [count, setCount] = useState();

    const copyLinkBtnHandler = () => {
      navigator.clipboard.writeText(` https://some-vans-see-149-110-147-85.loca.lt${router.asPath}`);

    };

    const { isOpen, onOpen, onClose } = useDisclosure();
    const shareToggle = () => {
      return (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Share This Post</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Stack mt={2} direction="row">
                <TwitterShareButton url={`${WEB_URL}${router.asPath}`} quote={`Cek ${post.caption} sekarang juga! By ${post.username}`}>
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
                <TwitterShareButton title={`Cek ${post.caption} sekarang juga!`} url={`${WEB_URL}${router.asPath}`}>
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
                <LinkedinShareButton url={`${WEB_URL}${router.asPath}`} title={`Cek ${post.caption} sekarang juga! By ${post.username}`} summary={post.caption}>
                  <LinkedinIcon size={40} round />
                </LinkedinShareButton>
                <IconButton onClick={copyLinkBtnHandler} borderRadius="50%" icon={<Icon as={BiCopy} />} />
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      );
    };

    useEffect(() => {
      onOpen();
      console.log(post);
    }, []);
    return (
      <Page
        title={`${post.User.username} || ${post.caption}`}
        description={post.caption}
        image={post.image_url}
        url={`${WEB_URL}${router.asPath}`}
      >
        <Box>
          {shareToggle()}
          <Flex justify={'center'} mt={8}>
            <Stack w="sm" boxSizeing="sm" borderRadius="lg" padding={3} shadow="dark-lg">
              <Flex justifyContent="space-between" alignItems="center">
                <NextLink href={`/user/${post.UserId}`}>
                  <Flex cursor="pointer">
                    <Avatar border="2px solid teal" name={post.User.username} src={post.User.image_url} />
                    <Box ms={3}>
                      <Text fontWeight="medium">{post.User.username}</Text>
                      <Text fontSize="sm" fontWeight="sm">
                        {post.location}
                      </Text>
                    </Box>
                  </Flex>
                </NextLink>

                <Box>
                  <Popover placement="bottom-end" size="xs">
                    <PopoverTrigger>
                      <Button bgColor="transparent">
                        <Icon boxSize={6} as={BsThreeDotsVertical} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverHeader fontWeight="semibold">Option</PopoverHeader>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        <NextLink href={`/posts/${post.PostId}`}>
                          <Button w="100%" bgColor="transparent" justifyContent="space-between">
                            <Text>Share</Text>
                            <Icon as={MdShare} />
                          </Button>
                        </NextLink>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Box>
              </Flex>

              <NextLink href={`/posts/${post.PostId}`}>
                <Image objectFit="cover" maxW="100%" src={post.image_url} />
              </NextLink>
              <Flex justify="space-between">
                <Text fontSize="xs">{moment(post.createDate).format('Do MMMM YYYY')}</Text>
              </Flex>
              <Box>
                <Text fontWeight="medium" fontSize="small">
                  {post.like_count?.toLocaleString()} Likes
                </Text>
                <Flex justify="space-between" mb="2">
                  <Text fontSize="m">
                    <span style={{ fontWeight: 'bold' }}>{post.User.username}</span>&nbsp;{post.caption}
                  </Text>
                </Flex>

                <Divider colorScheme="whatsapp" />
              </Box>

            </Stack>
          </Flex>
        </Box>
      </Page>
    );
  };

  export async function getServerSideProps(context) {
    const { id } = context.params;

    try {

      const res = await api.get(`/posts/${id}`, {

      });
      const post = res.data.result;
      
      return { props: { post } };
    } catch (err) {
      console.log(err);
      return {
        props: {},
      };
    }
  }
  export default postDetail;