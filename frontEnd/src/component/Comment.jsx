import { Box, Icon, Text, Input, InputRightElement, InputGroup, FormLabel, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Flex } from '@chakra-ui/react';
import moment from 'moment';
import useFetch from '../lib/hooks/usefetch';
import { useFormik } from 'formik';
import { useState } from 'react';

const MoreComment = ({ id }) => {

  const [page, setPage] = useState(1);

  const [data, count] = useFetch(`/posts/${id}/comment`, 1, 0);

  const formik = useFormik({
    initialValues: {
      PostId: id,
      UserId: '',
      comment: '',
      caption: '',
    },
    validateOnChange: false,
  });

  const inputHandler = (event) => {
    const { value, name } = event.target;
    formik.setFieldValue(name, value);
  };

  const postCommentHandler = async () => {
    const dataComment = {
      PostId: formik.values.PostId,
      UserId: formik.values.UserId,
      comment: formik.values.comment,
    };
    await api.post(`/posts/${id}-comment`, dataComment);
    refreshPage();
  };

  const renderAllComment = () => {
    return data?.map((comment) => {
      return (
        <Flex alignItems="center" justify="space-between">
          <Text fontSize="sm">
            <span style={{ fontWeight: 'bold' }}>{comment?.User?.username}</span>
            &nbsp;{comment?.comment}
          </Text>
          <Text fontSize="xx-small">{moment(comment?.createdAt).startOf('day').fromNow()}</Text>
        </Flex>
      );
    });
  };

  const fetchMore = () => {
    setPage(page + 1);
  };
  return (
    <>
      <Button onClick={onOpen}>see more</Button>
      <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton onClick={() => closeMoreHandler()} />

          <ModalFooter>
            <InputGroup>
              <FormLabel htmlFor="comment"></FormLabel>
              <Input
                id="comment"
                placeholder="comment"
                name="comment"
                onChange={inputHandler}
                maxLength={10}

              />

              <InputRightElement>
                <Icon
                  as={FiSend}
                  cursor="pointer"
                  onClick={() => postCommentHandler()}

                />
              </InputRightElement>
            </InputGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MoreComment;