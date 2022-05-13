import { ChakraProvider } from '@chakra-ui/react';
import { Provider, useSelector } from 'react-redux';
import store from '../redux/store';
import AuthProvider from '../component/authProvider';
import NetworkMessageWrapper from '../component/NetworkMessageWrapper';
import Navbar from '../component/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <NetworkMessageWrapper>
          <AuthProvider>
            <Navbar />
            <Component {...pageProps} />
          </AuthProvider>
        </NetworkMessageWrapper>
      </ChakraProvider>
    </Provider>
  );
}
export default MyApp;