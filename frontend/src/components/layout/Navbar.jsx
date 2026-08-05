import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const renderNavLinks = () => {
    if (!user) {
      return (
        <>
          <Link to="/jobs" className={`font-medium transition-colors ${location.pathname === '/jobs' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>Find Jobs</Link>
          <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Log in</Link>
          <Link to="/register" className="btn-primary">Sign up</Link>
        </>
      );
    }

    if (user.role === 'candidate') {
      return (
        <>
          <Link to="/jobs" className={`font-medium transition-colors ${location.pathname === '/jobs' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>Find Jobs</Link>
          <Link to="/candidate/applications" className={`font-medium transition-colors ${location.pathname === '/candidate/applications' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>My Applications</Link>
        </>
      );
    }

    if (user.role === 'recruiter') {
      return (
        <>
          <Link to="/recruiter/dashboard" className={`font-medium transition-colors ${location.pathname.includes('/dashboard') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>Dashboard</Link>
          <Link to="/recruiter/jobs/new" className="btn-primary">Post a Job</Link>
        </>
      );
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 text-2xl font-bold text-slate-900 tracking-tight">
              <span className="text-blue-600">Hire</span>AI
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {renderNavLinks()}
            
            {user && (
              <div className="relative ml-4">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-600 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-slate-100">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm text-slate-500 capitalize">{user.role}</p>
                    </div>
                    
                    {user.role === 'candidate' && (
                      <Link to="/candidate/profile" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Profile Settings
                      </Link>
                    )}
                    
                    {user.role === 'recruiter' && (
                      <Link to="/recruiter/company" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Company Profile
                      </Link>
                    )}

                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-500 hover:text-blue-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 pt-2 pb-4 space-y-1 sm:px-3 flex flex-col gap-4">
            {renderNavLinks()}
            {user && (
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center px-2 mb-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-slate-800">{user.name}</div>
                    <div className="text-sm font-medium text-slate-500 capitalize">{user.role}</div>
                  </div>
                </div>
                
                {user.role === 'candidate' && (
                  <Link to="/candidate/profile" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">Profile Settings</Link>
                )}
                {user.role === 'recruiter' && (
                  <Link to="/recruiter/company" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">Company Profile</Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
