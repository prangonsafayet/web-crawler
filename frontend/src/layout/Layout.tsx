import { Outlet, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';

const Layout = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white min-h-screen w-full flex flex-col items-center px-4 py-8 transition-colors duration-300">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold cursor-pointer" onClick={() => navigate('/')}>
            🕸 Web Crawler Dashboard
          </h1>
          <ThemeToggle />
        </div>
        {/* Nested route content will render here */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
