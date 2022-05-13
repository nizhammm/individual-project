import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const NetworkMessageWrapper = ({ children }) => {
  const networkSelector = useSelector((state) => state.network);

  const toast = useToast();

  useEffect(() => {
    if (networkSelector.errorMessage) {
      toast({
        status: 'error',
        title: networkSelector.errorTitle,
        description: networkSelector.errorMessage,
        duration: 2000,
      });
    }
  }, [networkSelector.errorMessage]);

  return children;
};

export default NetworkMessageWrapper;