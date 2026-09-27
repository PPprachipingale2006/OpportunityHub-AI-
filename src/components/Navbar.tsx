import React, { useState } from 'react';
import { 
  Compass, 
  Bookmark, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  LayoutDashboard, 
  LogOut,
  ChevronDown,
  LogIn,
  KeyRound
} from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  currentTab: 'landing' | 'dashboard' | 'opportunities' | 'saved' | 'profile' | 'login';
  onNavigate: (tab: 'landing' | 'dashboard' | 'opportunities' | 'saved' | 'profile' | 'login') => void;
  profile: StudentProfile;
  savedCount: number;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  profile,
  savedCount,
  isLoggedIn,
  onOpenAuth,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleNavClick = (tab: 'landing' | 'dashboard' | 'opportunities' | 'saved' | 'profile' | 'login') => {
    onNavigate(tab);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  OpportunityHub
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none hidden sm:block">
                Discover · Prepare · Apply
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNavClick('landing')}
              className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
                currentTab === 'landing'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                currentTab === 'dashboard'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => handleNavClick('opportunities')}
              className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                currentTab === 'opportunities'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Opportunities</span>
            </button>
            <button
              onClick={() => handleNavClick('saved')}
              className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                currentTab === 'saved'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800">
                  {savedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNavClick('login')}
              className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                currentTab === 'login'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-2.5">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    currentTab === 'login'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="Open clear Login Page & switch accounts"
                >
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  <span>Switch / Login</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                      {profile.name.charAt(0) || 'P'}
                    </div>
                    <div className="text-left hidden lg:block">
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        {profile.name.split(' ')[0]}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                        {profile.college.split(' ')[0]} · Yr {profile.yearOfStudy.charAt(0) || '3'}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Profile dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{profile.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{profile.email}</p>
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                          Active Session
                        </span>
                      </div>
                      <button
                        onClick={() => handleNavClick('profile')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Edit Student Profile
                      </button>
                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        View Dashboard
                      </button>
                      <button
                        onClick={() => handleNavClick('saved')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Bookmark className="w-4 h-4 text-slate-400" />
                        Saved Opportunities ({savedCount})
                      </button>
                      <button
                        onClick={() => handleNavClick('login')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LogIn className="w-4 h-4 text-blue-600" />
                        Open Full Login Page
                      </button>
                      <div className="border-t border-slate-100 my-1" />
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all hover:shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Student Portal</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('login')}
              className="px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg border border-blue-200"
            >
              Login
            </button>
            <button
              onClick={() => handleNavClick('saved')}
              className="p-2 text-slate-600 hover:text-slate-900 relative"
              aria-label="Saved"
            >
              <Bookmark className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-900">{profile.name}</p>
              <p className="text-xs text-slate-500">{profile.college}</p>
            </div>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="text-xs text-rose-600 font-semibold cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick('login');
                }}
                className="text-xs text-blue-600 font-bold cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          <button
            onClick={() => handleNavClick('landing')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentTab === 'landing' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
              currentTab === 'dashboard' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => handleNavClick('opportunities')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
              currentTab === 'opportunities' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-4 h-4" />
            Opportunities
          </button>
          <button
            onClick={() => handleNavClick('saved')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
              currentTab === 'saved' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              <span>Saved Opportunities</span>
            </div>
            {savedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                {savedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => handleNavClick('login')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 ${
              currentTab === 'login' ? 'bg-blue-600 text-white' : 'text-blue-700 bg-blue-50 border border-blue-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Login Page & Demo Login</span>
          </button>
          <button
            onClick={() => handleNavClick('profile')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
              currentTab === 'profile' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4" />
            Student Profile
          </button>
        </div>
      )}
    </header>
  );
};
