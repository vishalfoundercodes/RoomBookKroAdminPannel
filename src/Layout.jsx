// import { Sidebar } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Sidebar } from "./components/Sidebar";
import { ArrowUp } from "lucide-react";
import ScrollToTop from "./reusable_components/ScrollToTop";

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle scroll event for changing header style when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to the top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <ScrollToTop />
      {/* SIDEBAR: Fixed on the left side */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* HEADER: Fixed at top, adjusts for sidebar */}
      <div className="lg:ml-64">
        <Header
          isScrolled={isScrolled}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* MAIN CONTENT: Responsive layout */}
      <main className="lg:ml-64 pt-16 min-h-screen flex flex-col w-full">
        <div className="w-full px-2 sm:px-6 lg:px-8 py-6">
          {/* <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6"> */}
          {/* <DashboardContent /> */}
          <Outlet />
        </div>

        {/* FOOTER: At the bottom of content */}
      </main>
      <div className="w-full flex lg:ml-64">
        <Footer />
      </div>

      {/* SCROLL TO TOP BUTTON */}
      {isScrolled && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default Layout;