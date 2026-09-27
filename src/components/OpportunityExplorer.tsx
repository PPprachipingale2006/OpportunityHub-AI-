import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Calendar, 
  MapPin, 
  Sparkles,
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Opportunity, MatchAnalysis, SavedOpportunityItem, OpportunityCategory } from '../types';
import { OpportunityCard } from './OpportunityCard';
import { 
  CATEGORY_OPTIONS, 
  LOCATION_OPTIONS, 
  SKILL_OPTIONS 
} from '../data/opportunities';
import { isClosingSoon, isExpired, isThisWeek, isThisMonth } from '../utils/dateUtils';

interface OpportunityExplorerProps {
  opportunities: Opportunity[];
  matches: Map<string, MatchAnalysis>;
  savedItems: SavedOpportunityItem[];
  initialCategory?: string;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onViewDetails: (opp: Opportunity) => void;
}

export const OpportunityExplorer: React.FC<OpportunityExplorerProps> = ({
  opportunities,
  matches,
  savedItems,
  initialCategory = 'All',
  onToggleSave,
  onViewDetails
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [deadlineFilter, setDeadlineFilter] = useState<'all' | 'closing_soon' | 'this_week' | 'this_month'>('all');
  const [showExpired, setShowExpired] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'newest'>('match');

  // Filtered and sorted dataset
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const expired = isExpired(opp.deadline);
      // Expired filter rule
      if (expired && !showExpired) {
        return false;
      }

      // Search across title, org, skills, tags, category
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(query);
        const matchesOrg = opp.organization.toLowerCase().includes(query);
        const matchesCategory = opp.category.toLowerCase().includes(query);
        const matchesSkills = opp.skills.some(s => s.toLowerCase().includes(query));
        const matchesTags = opp.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesOrg && !matchesCategory && !matchesSkills && !matchesTags) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && opp.category !== selectedCategory) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'All') {
        if (selectedLocation === 'Remote') {
          if (opp.mode !== 'Remote' && opp.location !== 'Remote') return false;
        } else if (!opp.location.includes(selectedLocation)) {
          return false;
        }
      }

      // Skill filter
      if (selectedSkill !== 'All') {
        const hasSkill = opp.skills.some(
          s => s.toLowerCase() === selectedSkill.toLowerCase() ||
               s.toLowerCase().includes(selectedSkill.toLowerCase())
        );
        if (!hasSkill) return false;
      }

      // Deadline filter
      if (deadlineFilter === 'closing_soon') {
        if (!isClosingSoon(opp.deadline) || expired) return false;
      } else if (deadlineFilter === 'this_week') {
        if (!isThisWeek(opp.deadline) || expired) return false;
      } else if (deadlineFilter === 'this_month') {
        if (!isThisMonth(opp.deadline) || expired) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'match') {
        const scoreA = matches.get(a.id)?.score || 0;
        const scoreB = matches.get(b.id)?.score || 0;
        return scoreB - scoreA;
      } else if (sortBy === 'deadline') {
        return a.deadline.localeCompare(b.deadline);
      } else if (sortBy === 'newest') {
        return b.id.localeCompare(a.id);
      }
      return 0;
    });
  }, [
    opportunities,
    searchTerm,
    selectedCategory,
    selectedLocation,
    selectedSkill,
    deadlineFilter,
    showExpired,
    sortBy,
    matches
  ]);

  const hasActiveFilters = 
    searchTerm.trim() !== '' || 
    selectedCategory !== 'All' || 
    selectedLocation !== 'All' || 
    selectedSkill !== 'All' || 
    deadlineFilter !== 'all' || 
    showExpired;

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedLocation('All');
    setSelectedSkill('All');
    setDeadlineFilter('all');
    setShowExpired(false);
    setSortBy('match');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Search */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Discover Student Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse internships, hackathons, scholarships, and courses personalized for your profile.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search internships, hackathons, courses, organizations, Python, AI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        {/* Category Segmented Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filter Dropdowns & Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Location */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Locations</option>
              {LOCATION_OPTIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Skill
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Skills</option>
              {SKILL_OPTIONS.map((sk) => (
                <option key={sk} value={sk}>{sk}</option>
              ))}
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Deadline
            </label>
            <select
              value={deadlineFilter}
              onChange={(e) => setDeadlineFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Anytime</option>
              <option value="closing_soon">🔥 Closing Soon (≤ 7 days)</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="match">✨ Best Match (Score)</option>
              <option value="deadline">⏰ Deadline (Urgent First)</option>
              <option value="newest">🆕 Newest Added</option>
            </select>
          </div>

          {/* Expired Toggle Switch */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={showExpired}
                onChange={(e) => setShowExpired(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-[11px] font-bold text-slate-700 select-none">
                Show Expired
              </span>
            </label>
          </div>
        </div>

        {/* Filter Summary & Reset */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600">
            <span className="font-medium">
              Filtered to <strong className="text-slate-900">{filteredOpportunities.length}</strong> opportunities
            </span>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid of Opportunity Cards */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              match={matches.get(opp.id) || {
                score: 70,
                skillScore: 25,
                interestScore: 20,
                categoryScore: 15,
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
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No matching opportunities found</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Try adjusting your search keywords, clearing specific skill requirements, or toggling "Show Expired" to see all entries.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
