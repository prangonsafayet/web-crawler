import { useEffect, useState } from 'react';
import api from '../api/api';
import type { URLRecord } from '../types/types';

const useURLs = () => {
  const [urls, setUrls] = useState<URLRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await api.get<URLRecord[]>('/urls');
      setUrls(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, []);

  return { urls, fetch, loading };
};

export default useURLs;
