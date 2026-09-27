import React from 'react';
import { 
  Bookmark, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Building2,
  AlertTriangle
} from 'lucide-react';
import { Opportunity, MatchAnalysis } from '../types';
import { formatDeadline, isClosingSoon, isExpired } from '../utils/dateUtils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  match: MatchAnalysis;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onViewDetails: (opp: Opportunity) => void;
}

const CATEGORY_COLORS: Record<string, { text: string; bg: string; icon: string }> = {
  Internship: { text: 'text-blue-700', bg: 'bg-blue-50', icon: '💼' },
  Hackathon: { text: 'text-purple-700', bg: 'bg-purple-50', icon: '🏆' },
  Scholarship: { text: 'text-emerald-700', bg: 'bg-emerald-50', icon: '🎓' },
  Course: { text: 'text-amber-700', bg: 'bg-amber-50', icon: '📚' },
  Certification: { text: 'text-cyan-700', bg: 'bg-cyan-50', icon: '📜' },
  Competition: { text: 'text-rose-700', bg: 'bg-rose-50', icon: '🏅' },
  Workshop: { text: 'text-indigo-700', bg: 'bg-indigo-50', icon: '🛠' }
};

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  match,
  isSaved,
  onToggleSave,
  onViewDetails
}) => {
  const expired = isExpired(opportunity.deadline);
  const closingSoon = !expired && isClosingSoon(opportunity.deadline);
  const categoryStyle = CATEGORY_COLORS[opportunity.category] || { text: 'text-slate-700', bg: 'bg-slate-50', icon: '✨' };

  // Match badge styling based on score
  const getMatchBadgeStyle = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-blue-700 bg-blue-50 border-blue-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  return (
    <div 
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-no-card-click]')) {
          onViewDetails(opportunity);
        }
      }}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between p-5 hover:shadow-md hover:border-blue-300 cursor-pointer ${
        expired ? 'border-slate-200 opacity-75 bg-slate-50/50' : 'border-slate-200'
      }`}
    >
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
              <span>{categoryStyle.icon}</span>
              <span>{opportunity.category}</span>
            </span>

            <span className="text-slate-400">·</span>

            <span className="text-xs text-slate-500 font-medium">
              {opportunity.mode}
            </span>

            {closingSoon && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
                Closing Soon
              </span>
            )}

            {expired && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-300">
                <AlertTriangle className="w-3 h-3 text-slate-500" />
                Expired
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            data-no-card-click="true"
            onClick={(e) => onToggleSave(opportunity.id, e)}
            aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
            className={`p-2 rounded-xl transition-colors shrink-0 z-10 cursor-pointer ${
              isSaved
                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
          </button>
        </div>

        {/* Opportunity Title */}
        <h3 
          className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-1"
        >
          {opportunity.title}
        </h3>


        {/* Organization */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mb-3">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{opportunity.organization}</span>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {opportunity.description}
        </p>

        {/* Required Skills tags */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {opportunity.skills.slice(0, 4).map((skill) => {
              const isMatched = match.matchedSkills.includes(skill);
              return (
                <span
                  key={skill}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                    isMatched
                      ? 'bg-slate-100 text-slate-800 font-semibold'
                      : 'bg-slate-50 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  {skill}
                </span>
              );
            })}
            {opportunity.skills.length > 4 && (
              <span className="text-[11px] text-slate-400 font-medium pl-1">
                +{opportunity.skills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Match Reason Snippet */}
        {match.reasons.length > 0 && (
          <div className="mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 line-clamp-1 font-medium">
              {match.reasons[0]}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[120px]">{opportunity.location}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className={`font-medium ${closingSoon ? 'text-rose-600 font-semibold' : ''}`}>
              {formatDeadline(opportunity.deadline)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* Match Score Indicator */}
          <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${getMatchBadgeStyle(match.score)}`}>
            <span>{match.score}% Match</span>
          </div>

          {/* View Details Action */}
          <button
            onClick={() => onViewDetails(opportunity)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors p-1"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
