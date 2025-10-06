import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Footer from './Footer';
import Newsletter from './Newsletter';

const BlogLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen flex flex-col">
          <div className="flex-grow">
            <Outlet />
          </div>
          <Newsletter />
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default BlogLayout;