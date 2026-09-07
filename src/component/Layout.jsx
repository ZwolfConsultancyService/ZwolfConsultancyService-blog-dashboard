import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PenTool, BookOpen, Plus, Home, CalendarDays, Briefcase, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path, matchStartsWith = false) => {
    const active = matchStartsWith
      ? isActive(path) || location.pathname.startsWith(path)
      : isActive(path);
    return `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;
  };

  const navLinks = (
    <>
      <Link to="/" className={navLinkClass('/')} onClick={() => setMenuOpen(false)}>
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>

      <Link to="/create" className={navLinkClass('/create')} onClick={() => setMenuOpen(false)}>
        <Plus className="h-4 w-4" />
        <span>Create Post</span>
      </Link>

      <Link to="/appointment" className={navLinkClass('/appointment')} onClick={() => setMenuOpen(false)}>
        <CalendarDays className="h-4 w-4" />
        <span>Appointment</span>
      </Link>

      <Link to="/case-study" className={navLinkClass('/case-study', true)} onClick={() => setMenuOpen(false)}>
        <Briefcase className="h-4 w-4" />
        <span>Case Study</span>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-7 w-7 sm:h-8 sm:w-8 text-indigo-600" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Blog Dashboard</h1>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
              {navLinks}
            </nav>

            {/* Mobile hamburger button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile nav dropdown */}
          {menuOpen && (
            <nav className="md:hidden flex flex-col space-y-1 pb-4">
              {navLinks}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <PenTool className="h-4 w-4" />
            <span className="text-sm">Blog Management Dashboard</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;