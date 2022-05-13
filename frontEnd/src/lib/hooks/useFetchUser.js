import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import api from '../api';

const useFetchUser = (routes = '') => {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(async () => {
    if (router.isReady) {
      try {
        const res = await api.get(routes);
        setData(res.data.result);
      } catch (err) {
        console.log(err);
      }
    }
  }, [router.isReady]);

  return [data];
};

export default useFetchUser;