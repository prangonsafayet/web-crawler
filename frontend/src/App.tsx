import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import URLForm from './components/URLForm/URLForm';
import URLTable from './components/URLTable/URLTable';
import URLDetail from './components/URLDetail/URLDetail';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <>
                <URLForm onSuccess={() => {}} />
                <URLTable />
              </>
            }
          />
          <Route path="url/:id" element={<URLDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
