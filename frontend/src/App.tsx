import { BrowserRouter, Routes, Route } from 'react-router-dom';
import URLForm from './components/URLForm/URLForm';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import URLTable from './components/URLTable/URLTable.tsx';
import URLDetail from './components/URLDetail/URLDetail.tsx';

const App = () => {
  return (
    <BrowserRouter>
      <div className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white min-h-screen w-full flex flex-col items-center px-4 py-8 transition-colors duration-300">
        <div className="w-full max-w-3xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">🕸 Web Crawler Dashboard</h1>
            <ThemeToggle />
          </div>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <URLForm onSuccess={() => {}} />
                  <URLTable />
                </>
              }
            />
            <Route path="/url/:id" element={<URLDetail />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
