import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import api from '../api';
import jsCookie from 'js-cookie';

const useFetch = (routes = '', pageNumber = 0, limitPage = 5) => {
  const token = jsCookie.get('auth_token');
  const router = useRouter();
  const [data, setData] = useState([]);
  const [count, setCount] = useState();

  useEffect(async () => {
    if (router.isReady || token) {
      try {
        const res = await api.get(routes, {
          params: {
            _limit: limitPage,
            _page: pageNumber,
          },
        });
        setData(data.concat(res?.data?.result?.rows));
        setCount(res?.data?.result?.count);
        console.log(res.data.result);
      } catch (err) {
        console.log(err);
      }
    }
  }, [router.isReady, pageNumber]);

  return [data, count];
};

export default useFetch;