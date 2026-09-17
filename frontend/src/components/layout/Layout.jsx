
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 font-['Inter']">
      <Navbar />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="bg-white border-t border-neutral-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} HireAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
