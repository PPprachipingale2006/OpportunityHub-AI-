import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Calendar, 
  Trophy, 
  GraduationCap, 
  Compass, 
  LogIn, 
  UserCheck, 
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { StudentProfile } from '../types';
import { DEFAULT_PRACHI_PROFILE } from '../utils/storage';

interface LoginPageProps {
  onLoginSuccess: (profile: StudentProfile) => void;
  onNavigateHome: () => void;
  onNavigateExplore: () => void;
  currentProfile?: StudentProfile;
  isLoggedIn?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateHome,
  onNavigateExplore,
  currentProfile = DEFAULT_PRACHI_PROFILE,
  isLoggedIn = false
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('pingaleprachi2006@gmail.com');
  const [password, setPassword] = useState('prachi2026');
  const [showPassword, setShowPassword] = useState(false);
  const [college, setCollege] = useState('College of Engineering Pune (COEP)');
  const [degree, setDegree] = useState('B.Tech in Computer Engineering');
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Handle standard form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full student name.');
        return;
      }
      const newProfile: StudentProfile = {
        name: name.trim(),
        email: email.trim(),
        college: college.trim() || 'COEP Technological University',
        degree: degree.trim() || 'B.Tech Computer Engineering',
        yearOfStudy: yearOfStudy || '3rd Year',
        skills: ['Python', 'JavaScript', 'React', 'SQL', 'Web Development'],
        interests: ['Software Development', 'Artificial Intelligence', 'Web Development'],
        preferredCategories: ['Internship', 'Hackathon'],
        preferredLocations: ['Pune', 'Remote', 'Bengaluru'],
        bio: 'Aspiring engineer passionate about software development and emerging AI tools.'
      };
      onLoginSuccess(newProfile);
    } else {
      // Sign-in mode
      const isPrachi = email.toLowerCase().includes('prachi') || email.toLowerCase().includes('pingale');
      if (isPrachi) {
        onLoginSuccess(DEFAULT_PRACHI_PROFILE);
      } else {
        const userProfile: StudentProfile = {
          ...DEFAULT_PRACHI_PROFILE,
          name: name.trim() || email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: email.trim(),
          college: college.trim() || 'Engineering University'
        };
        onLoginSuccess(userProfile);
      }
    }
  };

  // 1-Click Instant Demo Login as Prachi Pingale
  const handleQuickLoginPrachi = () => {
    setEmail('pingaleprachi2006@gmail.com');
    setPassword('prachi2026');
    onLoginSuccess(DEFAULT_PRACHI_PROFILE);
  };

  // 1-Click Login as Guest Student
  const handleQuickLoginGuest = () => {
    const guestProfile: StudentProfile = {
      name: 'Rohan Sharma',
      email: 'rohan.sharma@dtu.ac.in',
      college: 'Delhi Technological University (DTU)',
      degree: 'B.Tech Information Technology',
      yearOfStudy: '2nd Year',
      skills: ['C++', 'Python', 'Data Structures', 'SQL'],
      interests: ['Competitive Programming', 'Software Development', 'Cloud Computing'],
      preferredCategories: ['Internship', 'Competition', 'Scholarship'],
      preferredLocations: ['Delhi', 'Remote', 'Bengaluru'],
      bio: '2nd year undergraduate preparing for competitive coding and tech internships.'
    };
    onLoginSuccess(guestProfile);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-100">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-in fade-in duration-200">
        
        {/* Left Side: Brand Showcase & Value Highlights (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Background Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-xs">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span>Student Opportunity Discovery Platform</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                OpportunityHub <span className="text-blue-400">AI</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Log in to uncover personalized student opportunities, match scores, and interview schedules tailored to your college & degree.
              </p>
            </div>
          </div>

          {/* Middle Value Props */}
          <div className="relative z-10 my-8 space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 border border-blue-400/30">
                <Zap className="w-4 h-4 text-blue-300" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">100-Point AI Skill Matching</span>
                <span className="text-slate-300 text-[11px]">Real-time compatibility scoring against your exact skills and degree.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-400/30">
                <Trophy className="w-4 h-4 text-purple-300" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">80+ Verified Opportunities</span>
                <span className="text-slate-300 text-[11px]">Top internships, hackathons, scholarships, courses & competitions.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
                <Calendar className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Custom Interview Calendar</span>
                <span className="text-slate-300 text-[11px]">Track interview rounds, dates, days & specific start/end timings.</span>
              </div>
            </div>
          </div>

          {/* Bottom Student Testimonial Spotlight */}
          <div className="relative z-10 pt-4 border-t border-white/10 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                P
              </div>
              <div>
                <span className="font-bold text-white block leading-tight">Prachi Pingale</span>
                <span className="text-[10px] text-slate-400">COEP Technological University · 3rd Year B.Tech</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-300/90 italic leading-snug">
              "Tracked the Amazon SDE interview loop and identified key machine learning workshops in seconds!"
            </p>
          </div>
        </div>

        {/* Right Side: High-Contrast, Visible Login Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div className="space-y-6">
            {/* Top Navigation & Status Indicator */}
            <div className="flex items-center justify-between">
              <button
                onClick={onNavigateHome}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>← Back to Home</span>
              </button>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Secure Student Portal</span>
              </div>
            </div>

            {/* Main Header */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {mode === 'signin' ? 'Sign In to Your Account' : 'Create Student Account'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {mode === 'signin' 
                  ? 'Access your personalized matches, application tracker, and calendar schedule.'
                  : 'Join OpportunityHub to discover curated student opportunities personalized for you.'}
              </p>
            </div>

            {/* HIGH VISIBILITY 1-CLICK INSTANT DEMO LOGIN CARD */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Instant Demo Evaluation</span>
                </span>
                <span className="text-[11px] text-blue-100 font-semibold">1-Click Fast Pass</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-blue-700 font-extrabold flex items-center justify-center text-base shadow-sm shrink-0">
                    P
                  </div>
                  <div>
                    <span className="font-extrabold text-sm sm:text-base text-white block leading-tight">
                      Prachi Pingale
                    </span>
                    <span className="text-xs text-blue-100 font-medium block">
                      COEP Pune · B.Tech Computer Engineering (3rd Year)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleQuickLoginPrachi}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-extrabold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <LogIn className="w-4 h-4" />
                  <span>1-Click Demo Login</span>
                </button>
              </div>

              {/* Profile snapshot tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-blue-100">
                <span className="font-semibold text-white">Pre-loaded:</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-medium">Python</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-medium">React</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-medium">Machine Learning</span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-medium">Amazon SDE Track</span>
              </div>
            </div>

            {/* Mode Switch Tabs (Sign In vs Register) */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl text-xs font-bold border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                }}
                className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  mode === 'signin'
                    ? 'bg-white text-blue-600 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Account</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                }}
                className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  mode === 'register'
                    ? 'bg-white text-blue-600 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Create New Account</span>
              </button>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field (for Register) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                    Full Student Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Prachi Pingale or Rohan Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-extrabold text-slate-800">
                    Email Address *
                  </label>
                  <button
                    type="button"
                    onClick={() => setEmail('pingaleprachi2006@gmail.com')}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-bold transition-colors cursor-pointer"
                  >
                    Use Prachi's Email
                  </button>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-extrabold text-slate-800">
                    Password *
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to ' + (email || 'your email address') + '. For demo purposes, any password works!')}
                      className="text-[11px] text-slate-500 hover:text-blue-600 font-semibold cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password (e.g. prachi2026)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-xs font-semibold text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Registration Extra Fields */}
              {mode === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      College / University
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="e.g. COEP Pune"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Degree & Branch
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech Computer Eng."
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* Remember me & Guest link */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span>Remember my login session</span>
                </label>

                <button
                  type="button"
                  onClick={handleQuickLoginGuest}
                  className="text-blue-600 hover:text-blue-800 font-bold transition-colors cursor-pointer"
                >
                  Log In as Guest Student
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>{mode === 'signin' ? 'Sign In to OpportunityHub' : 'Create My Student Account'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </form>
          </div>

          {/* Bottom Security / Trust Footer */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Free student accounts · No credit card required</span>
            </span>

            <button
              onClick={onNavigateExplore}
              className="text-slate-600 hover:text-blue-600 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Browse Public Catalog</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
