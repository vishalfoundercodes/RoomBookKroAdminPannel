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

  // Handle scroll event for header shadow & button visibility
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to the top smoothly
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    // ✅ UPDATED — Used flexbox for full-page layout
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-gray-900 overflow-x-hidden">
      {/* ✅ SIDEBAR (Fixed on large screens, overlay on mobile) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ✅ MAIN CONTENT AREA — now flex container for column layout */}
      <div className="flex flex-col flex-1 min-h-screen lg:ml-64 transition-all duration-300 overflow-x-hidden">
        {/* ✅ HEADER — fixed top, adjusts for sidebar width */}
        <header className="fixed top-0 right-0 left-0 lg:left-64 z-20 bg-white dark:bg-gray-800 shadow-sm">
          <Header
            isScrolled={isScrolled}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        </header>

        {/* ✅ MAIN SECTION — flex-1 ensures content grows, footer stays bottom */}
        <main className="flex-1 flex flex-col pt-16 px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
          <ScrollToTop />
          <Outlet />
        </main>

        {/* ✅ FOOTER — mt-auto pushes it to the bottom of flex column */}
        <footer className="w-full mt-auto">
          <Footer />
        </footer>
      </div>

      {/* ✅ SCROLL TO TOP BUTTON — positioned fixed */}
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
