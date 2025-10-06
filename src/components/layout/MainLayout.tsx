import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Newsletter from './Newsletter';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default MainLayout;