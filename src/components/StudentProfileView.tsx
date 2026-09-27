import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Building2, 
  GraduationCap, 
  Calendar, 
  Check, 
  Sparkles, 
  ArrowRight,
  Plus,
  X,
  Target,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { StudentProfile, OpportunityCategory } from '../types';
import { 
  SKILL_OPTIONS, 
  INTEREST_OPTIONS, 
  CATEGORY_OPTIONS, 
  LOCATION_OPTIONS 
} from '../data/opportunities';
import { calculateProfileCompletion } from '../utils/storage';

interface StudentProfileViewProps {
  initialProfile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
  onNavigateToDashboard: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  initialProfile,
  onSaveProfile,
  onNavigateToDashboard
}) => {
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const toggleSkill = (skill: string) => {
    if (profile.skills.includes(skill)) {
      setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
    } else {
      setProfile({ ...profile, skills: [...profile.skills, skill] });
    }
  };

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      setProfile({ ...profile, skills: [...profile.skills, trimmed] });
      setCustomSkillInput('');
    }
  };

  const toggleInterest = (interest: string) => {
    if (profile.interests.includes(interest)) {
      setProfile({ ...profile, interests: profile.interests.filter(i => i !== interest) });
    } else {
      setProfile({ ...profile, interests: [...profile.interests, interest] });
    }
  };

  const toggleCategory = (cat: OpportunityCategory) => {
    if (profile.preferredCategories.includes(cat)) {
      setProfile({ ...profile, preferredCategories: profile.preferredCategories.filter(c => c !== cat) });
    } else {
      setProfile({ ...profile, preferredCategories: [...profile.preferredCategories, cat] });
    }
  };

  const toggleLocation = (loc: string) => {
    if (profile.preferredLocations.includes(loc)) {
      setProfile({ ...profile, preferredLocations: profile.preferredLocations.filter(l => l !== loc) });
    } else {
      setProfile({ ...profile, preferredLocations: [...profile.preferredLocations, loc] });
    }
  };

  const handleSave = () => {
    onSaveProfile(profile);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onNavigateToDashboard();
    }, 1200);
  };

  const completionPercent = calculateProfileCompletion(profile);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-bold">Profile saved! Building your personalized feed...</span>
        </div>
      )}

      {/* Header & Completion Status */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
            Student Profile Setup
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
            Customize Your Discovery Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            We use your education, technical stack, and aspirations to compute high-accuracy opportunity match scores.
          </p>
        </div>

        {/* Profile Completion Bar */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 min-w-[220px]">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
            <span>Profile Completion</span>
            <span className="text-blue-600">{completionPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {completionPercent === 100 
              ? '✨ Outstanding! Full 100-point match engine ready.' 
              : 'Add skills and preferred locations to optimize feed'}
          </p>
        </div>
      </div>

      {/* 1. Personal Information */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <span>Personal Information</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Basic details to personalize application documents and portal links.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Prachi Pingale"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="student@college.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              College / University *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={profile.college}
                onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. College of Engineering Pune (COEP)"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Degree & Major *
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={profile.degree}
                onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. B.Tech in Computer Engineering"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Year of Study *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <select
                value={profile.yearOfStudy}
                onChange={(e) => setProfile({ ...profile, yearOfStudy: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Pre-final)</option>
                <option value="4th Year">4th Year (Final Year)</option>
                <option value="Postgraduate / Masters">Postgraduate / Masters</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Skills Multi-select */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Technical & Professional Skills</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select all skills you are comfortable with. Contributes up to 40 points in recommendation matching.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md self-start sm:self-auto">
            {profile.skills.length} Selected
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {SKILL_OPTIONS.map((skill) => {
            const isSelected = profile.skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>{skill}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Skill Input */}
        <form onSubmit={addCustomSkill} className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Add another skill (e.g. Next.js, Rust, Docker)..."
            value={customSkillInput}
            onChange={(e) => setCustomSkillInput(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 text-white hover:bg-slate-900 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </section>

      {/* 3. Interests Multi-select */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span>Career & Domain Interests</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              What engineering domains are you eager to explore? Contributes up to 30 points.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md self-start sm:self-auto">
            {profile.interests.length} Selected
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {INTEREST_OPTIONS.map((interest) => {
            const isSelected = profile.interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>{interest}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Preferred Opportunity Types (Checkboxes) */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>Preferred Opportunity Types</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select the categories you want prioritized on your feed. Contributes up to 20 points.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {CATEGORY_OPTIONS.map((cat) => {
            const isSelected = profile.preferredCategories.includes(cat);
            return (
              <label
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}} // handled by parent onClick
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs">{cat}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* 5. Preferred Locations */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Preferred Locations</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select locations where you can intern or attend physical events. Contributes up to 10 points.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {LOCATION_OPTIONS.map((loc) => {
            const isSelected = profile.preferredLocations.includes(loc);
            return (
              <button
                key={loc}
                type="button"
                onClick={() => toggleLocation(loc)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>{loc}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onNavigateToDashboard}
          className="px-5 py-3 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Build My Opportunity Feed</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
