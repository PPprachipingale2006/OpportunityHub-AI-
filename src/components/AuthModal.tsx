import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  Building2, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  LogIn,
  GraduationCap
} from 'lucide-react';
import { StudentProfile } from '../types';
import { DEFAULT_PRACHI_PROFILE } from '../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: StudentProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('pingaleprachi2006@gmail.com');
  const [password, setPassword] = useState('prachi2026');
  const [showPassword, setShowPassword] = useState(false);
  const [college, setCollege] = useState('COEP Technological University');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') {
      const newProfile: StudentProfile = {
        name: name.trim() || 'Student Explorer',
        email: email.trim() || 'student@university.edu',
        college: college.trim() || 'National Institute of Technology',
        degree: 'B.Tech Computer Science',
        yearOfStudy: '3rd Year',
        skills: ['Python', 'Web Development', 'SQL'],
        interests: ['Software Development', 'Artificial Intelligence'],
        preferredCategories: ['Internship', 'Hackathon'],
        preferredLocations: ['Remote', 'Pune'],
        bio: 'Aspiring engineer looking for student opportunities.'
      };
      onLoginSuccess(newProfile);
    } else {
      const isPrachi = email.toLowerCase().includes('prachi') || !email;
      const profileToUse = isPrachi 
        ? DEFAULT_PRACHI_PROFILE 
        : {
            ...DEFAULT_PRACHI_PROFILE,
            email: email,
            name: name || email.split('@')[0]
          };
      onLoginSuccess(profileToUse);
    }
    onClose();
  };

  const handleDemoLogin = () => {
    onLoginSuccess(DEFAULT_PRACHI_PROFILE);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-tight">OpportunityHub AI</h3>
              <p className="text-[11px] text-slate-500 font-medium">Student Opportunity & Career Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Fast Pass Demo Login Banner */}
        <div className="px-6 pt-5">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Instant Demo Login</span>
              </span>
              <span className="text-blue-100 font-semibold">Pre-loaded</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white text-blue-700 font-extrabold flex items-center justify-center text-xs shadow-xs">
                  P
                </div>
                <div>
                  <div className="font-extrabold text-xs text-white leading-tight">Prachi Pingale</div>
                  <div className="text-[10px] text-blue-100">COEP Pune · Computer Eng. (3rd Yr)</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-blue-700 font-extrabold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Login as Prachi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              or enter credentials
            </span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 mx-6 rounded-xl text-xs font-bold border border-slate-200">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'signin' ? 'bg-white text-blue-600 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'register' ? 'bg-white text-blue-600 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Register Account</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Prachi Pingale"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-extrabold text-slate-800">
                Email Address *
              </label>
              <button
                type="button"
                onClick={() => setEmail('pingaleprachi2006@gmail.com')}
                className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Use Prachi's Email
              </button>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-extrabold text-slate-800">
                Password *
              </label>
              {mode === 'signin' && (
                <span className="text-[10px] text-slate-400 font-medium">
                  Default: prachi2026
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-xs font-semibold text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                College / University
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. COEP Technological University"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>{mode === 'signin' ? 'Sign In to OpportunityHub' : 'Create My Student Account'}</span>
          </button>
        </form>

        <div className="px-6 pb-4 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Free for all students and university applicants</span>
          </p>
        </div>
      </div>
    </div>
  );
};
