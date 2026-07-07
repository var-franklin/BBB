import React, { useEffect, useState, createContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ClientFooter from './components/ClientFooter';
import ScrollToTop from './components/ScrollToTop';
import AuthProvider from './utils/AuthProvider';
import LoadingAnimation from './components/LoadingAnimation';

export const LoadingContext = createContext({
  setPageLoading: () => {},
  isPageLoading: false,
  setLoadingMessage: () => {},
});

function App() {
  const [isPageLoading, setPageLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Please wait while we get things ready for you");
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AuthProvider>
      <LoadingContext.Provider value={{ setPageLoading, isPageLoading, setLoadingMessage }}>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="relative z-10">
            <Navbar />
            
            <main className="min-h-screen pt-16">
              {isPageLoading && <LoadingAnimation message={loadingMessage} />}
              
              <div className="animate-fadeIn">
                <Outlet />
              </div>
            </main>

            <ClientFooter />
          </div>

          <ScrollToTop/>
        </div>
      </LoadingContext.Provider>
    </AuthProvider>
  );
}

export default App;