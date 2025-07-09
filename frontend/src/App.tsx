import { useEffect } from 'react';
import api from './api/api.ts';

const App = () => {
  const getData = async () => {
    try {
      const res = await api.get('/urls');
      console.log('Data:', res.data);
    } catch (error) {
      console.error('API error:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </>
  );
};

export default App;
