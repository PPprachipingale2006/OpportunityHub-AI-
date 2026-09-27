import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Bookmark, 
  ArrowRight, 
  Compass, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  Trophy, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Wrench, 
  FileCheck2,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { 
  Opportunity, 
  StudentProfile, 
  MatchAnalysis, 
  SavedOpportunityItem, 
  OpportunityCategory,
  CustomCalendarEvent 
} from '../types';
import { OpportunityCard } from './OpportunityCard';
import { DashboardCalendar } from './DashboardCalendar';
import { ApplicationStatusAnalytics } from './ApplicationStatusAnalytics';
import { calculateProfileCompletion } from '../utils/storage';
import { isClosingSoon, isExpired } from '../utils/dateUtils';

interface StudentDashboardProps {
  profile: StudentProfile;
  opportunities: Opportunity[];
  matches: Map<string, MatchAnalysis>;
  savedItems: SavedOpportunityItem[];
  customEvents: CustomCalendarEvent[];
  onSaveCustomEvent: (event: CustomCalendarEvent) => void;
  onDeleteCustomEvent: (id: string) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onViewDetails: (opp: Opportunity) => void;
  onNavigateTab: (tab: 'opportunities' | 'saved' | 'profile') => void;
  onFilterByCategory: (cat: OpportunityCategory) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  profile,
  opportunities,
  matches,
  savedItems,
  customEvents,
  onSaveCustomEvent,
  onDeleteCustomEvent,
  onToggleSave,
  onViewDetails,
  onNavigateTab,
  onFilterByCategory
}) => {
  // Determine greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const studentFirstName = profile.name.split(' ')[0] || 'Student';
  const profileCompletion = calculateProfileCompletion(profile);

  // Filter valid opportunities (not expired)
  const activeOpportunities = opportunities.filter(o => !isExpired(o.deadline));

  // Count high matches (e.g. score >= 75%)
  const highMatchCount = activeOpportunities.filter(o => {
    const m = matches.get(o.id);
    return m && m.score >= 75;
  }).length;

  // Top recommendations sorted by score descending
  const recommendedOpportunities = [...activeOpportunities].sort((a, b) => {
    const scoreA = matches.get(a.id)?.score || 0;
    const scoreB = matches.get(b.id)?.score || 0;
    return scoreB - scoreA;
  }).slice(0, 4);

  // Closing soon opportunities (deadline within 7 days)
  const closingSoonOpportunities = activeOpportunities.filter(o => isClosingSoon(o.deadline));

  // Category counts
  const categoryCounts = opportunities.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryIcons: Record<string, { icon: string; color: string; bg: string }> = {
    Internship: { icon: '💼', color: 'text-blue-600', bg: 'bg-blue-50' },
    Hackathon: { icon: '🏆', color: 'text-purple-600', bg: 'bg-purple-50' },
    Scholarship: { icon: '🎓', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    Course: { icon: '📚', color: 'text-amber-600', bg: 'bg-amber-50' },
    Certification: { icon: '📜', color: 'text-cyan-600', bg: 'bg-cyan-50' },
    Competition: { icon: '🏅', color: 'text-rose-600', bg: 'bg-rose-50' },
    Workshop: { icon: '🛠', color: 'text-indigo-600', bg: 'bg-indigo-50' }
  };

  const maxCategoryCount = Math.max(...Object.values(categoryCounts), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Welcome & Summary Section */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI-Powered Opportunity Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {getGreeting()}, {studentFirstName} 👋
            </h1>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl leading-relaxed">
              Here are opportunities matching your interests in <span className="font-semibold text-white">{profile.skills.slice(0, 3).join(', ')}</span> and <span className="font-semibold text-white">{profile.preferredCategories.slice(0, 2).join(' & ')}</span>.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shrink-0 min-w-[220px]">
            <div className="text-xs uppercase tracking-wider font-bold text-blue-200">
              Recommendation Summary
            </div>
            <div className="text-3xl font-black text-white mt-1">
              {highMatchCount}
            </div>
            <div className="text-xs text-blue-100 font-medium">
              opportunities match your profile (≥75%)
            </div>
            <button
              onClick={() => onNavigateTab('opportunities')}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore All Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Completion */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
              <span>Profile Completion</span>
              <span className="text-blue-600">{profileCompletion}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 line-clamp-1">
              {profile.college.split(' ')[0]} · {profile.yearOfStudy}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('profile')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between"
          >
            <span>Update Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* High Matches */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold">Top Matched (≥75%)</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {highMatchCount}
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High compatibility
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('opportunities')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between"
          >
            <span>View Matches</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Saved Opportunities */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold">Saved Opportunities</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {savedItems.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Bookmarked in pipeline
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('saved')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between"
          >
            <span>Open Pipeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Closing Soon */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold">Closing Soon (≤ 7d)</span>
            <div className="text-2xl font-extrabold text-rose-600 mt-1 flex items-center gap-1.5">
              <Flame className="w-5 h-5 fill-rose-500" />
              <span>{closingSoonOpportunities.length}</span>
            </div>
            <p className="text-xs text-rose-600/80 font-medium mt-1">
              Expiring this week
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('opportunities')}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between"
          >
            <span>View Urgent</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Closing Soon Section */}
      {closingSoonOpportunities.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-rose-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Closing Soon — Take Action
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('opportunities')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View all ({closingSoonOpportunities.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {closingSoonOpportunities.slice(0, 3).map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                match={matches.get(opp.id) || {
                  score: 70,
                  skillScore: 20,
                  interestScore: 20,
                  categoryScore: 20,
                  locationScore: 10,
                  matchedSkills: [],
                  missingSkills: [],
                  matchedInterests: [],
                  matchedCategory: true,
                  matchedLocation: true,
                  reasons: []
                }}
                isSaved={savedItems.some(s => s.opportunityId === opp.id)}
                onToggleSave={onToggleSave}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. Application Status Analytics (Recharts Visualization: Applied, Interviewing, Offered) */}
      <section>
        <ApplicationStatusAnalytics
          opportunities={opportunities}
          savedItems={savedItems}
          onNavigateToSaved={() => onNavigateTab('saved')}
          onViewDetails={onViewDetails}
        />
      </section>

      {/* 5. Interactive Opportunity & Interview Calendar */}
      <section>
        <DashboardCalendar
          opportunities={opportunities}
          savedItems={savedItems}
          customEvents={customEvents}
          onSaveCustomEvent={onSaveCustomEvent}
          onDeleteCustomEvent={onDeleteCustomEvent}
          onViewDetails={onViewDetails}
          onNavigateToSaved={() => onNavigateTab('saved')}
        />
      </section>

      {/* 6. Top Recommended For You */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recommended For You
              </h2>
              <p className="text-xs text-slate-500">
                Sorted by your personalized 100-point match score
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('opportunities')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>See full feed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {recommendedOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              match={matches.get(opp.id) || {
                score: 75,
                skillScore: 25,
                interestScore: 20,
                categoryScore: 20,
                locationScore: 10,
                matchedSkills: [],
                missingSkills: [],
                matchedInterests: [],
                matchedCategory: true,
                matchedLocation: true,
                reasons: []
              }}
              isSaved={savedItems.some(s => s.opportunityId === opp.id)}
              onToggleSave={onToggleSave}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </section>

      {/* 5. Opportunity Categories Breakdown Chart */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Opportunity Distribution by Category
            </h2>
            <p className="text-xs text-slate-500">
              Breakdown of current verified listings available across India & Remote.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Total {opportunities.length} Listings
          </span>
        </div>

        <div className="space-y-3">
          {Object.entries(categoryCounts).map(([catName, count]) => {
            const meta = categoryIcons[catName] || { icon: '📌', color: 'text-slate-600', bg: 'bg-slate-50' };
            const percentage = Math.round((count / maxCategoryCount) * 100);
            return (
              <div 
                key={catName} 
                onClick={() => onFilterByCategory(catName as OpportunityCategory)}
                className="group flex items-center gap-4 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="w-36 flex items-center gap-2 text-xs font-bold text-slate-800 shrink-0">
                  <span className="text-base">{meta.icon}</span>
                  <span className="group-hover:text-blue-600 transition-colors">{catName}</span>
                </div>

                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 group-hover:bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="w-12 text-right text-xs font-bold text-slate-700">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
