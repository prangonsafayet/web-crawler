import { useEffect, useState } from 'react';
import api from '../api/api';

export function useURLs() {
  const [urls, setUrls] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await api.get('/urls');
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
}
