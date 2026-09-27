import React from 'react';
import { 
  X, 
  ExternalLink, 
  Bookmark, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  Building2, 
  GraduationCap, 
  Award,
  Sparkles,
  Flame,
  BookOpen,
  Tag,
  Check
} from 'lucide-react';
import { Opportunity, MatchAnalysis, ApplicationStatus } from '../types';
import { formatDeadline, isClosingSoon, isExpired } from '../utils/dateUtils';
import { calculateMatchScore } from '../utils/recommendation';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  match?: MatchAnalysis | null;
  isSaved: boolean;
  savedStatus?: ApplicationStatus;
  onClose: () => void;
  onToggleSave: (id: string) => void;
  onUpdateStatus?: (id: string, status: ApplicationStatus) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  match: providedMatch,
  isSaved,
  savedStatus = 'Saved',
  onClose,
  onToggleSave,
  onUpdateStatus
}) => {
  if (!opportunity) return null;

  // Use provided match or generate default match calculation safely
  const match = providedMatch || calculateMatchScore(opportunity, null);

  const expired = isExpired(opportunity.deadline);
  const closingSoon = !expired && isClosingSoon(opportunity.deadline);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
              {opportunity.category}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              {opportunity.mode}
            </span>
            {closingSoon && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                <Flame className="w-3 h-3 text-rose-600 fill-rose-600" />
                Closing Soon
              </span>
            )}
            {expired && (
              <span className="text-[11px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                Expired
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Title & Organization */}
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {opportunity.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-600 font-semibold mt-1.5">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{opportunity.organization}</span>
            </div>
          </div>

          {/* Key Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                Location
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mt-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{opportunity.location}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                Deadline
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mt-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className={closingSoon ? 'text-rose-600 font-extrabold' : ''}>
                  {formatDeadline(opportunity.deadline)}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                Duration
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mt-1">
                <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{opportunity.duration}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                Stipend / Prize
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mt-1">
                <Award className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{opportunity.stipendOrPrize || 'Certificate & Perks'}</span>
              </div>
            </div>
          </div>

          {/* Match Score & Breakdown Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">Personalized Match Breakdown</h4>
              </div>
              <div className="px-3 py-1 rounded-lg bg-blue-600 text-white font-extrabold text-sm shadow-xs">
                {match.score}% Match
              </div>
            </div>

            {/* Score points progress bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="flex justify-between text-slate-600 font-semibold mb-1">
                  <span>Skills</span>
                  <span className="font-extrabold text-slate-900">{match.skillScore}/40</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${(match.skillScore / 40) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="flex justify-between text-slate-600 font-semibold mb-1">
                  <span>Interests</span>
                  <span className="font-extrabold text-slate-900">{match.interestScore}/30</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full" 
                    style={{ width: `${(match.interestScore / 30) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="flex justify-between text-slate-600 font-semibold mb-1">
                  <span>Category</span>
                  <span className="font-extrabold text-slate-900">{match.categoryScore}/20</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 rounded-full" 
                    style={{ width: `${(match.categoryScore / 20) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="flex justify-between text-slate-600 font-semibold mb-1">
                  <span>Location</span>
                  <span className="font-extrabold text-slate-900">{match.locationScore}/10</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full" 
                    style={{ width: `${(match.locationScore / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Why This Matches You checklist */}
            <div className="space-y-1.5 mt-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Why this matches you:
              </span>
              {match.reasons.length > 0 ? (
                match.reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Matches your active student preferences</span>
                </div>
              )}
            </div>
          </div>

          {/* Skill Gap Analysis / Perfect Fit Indicator */}
          {match.missingSkills.length > 0 ? (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-amber-800" />
                <h4 className="text-sm font-bold text-amber-950">Skill Gap Analysis</h4>
              </div>
              <div className="text-xs text-slate-800 space-y-1 mb-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900">Skill Gap:</span>
                  <div className="flex flex-wrap gap-1">
                    {match.missingSkills.map((ms) => (
                      <span key={ms} className="px-2 py-0.5 rounded text-[11px] font-bold bg-white border border-amber-300 text-amber-900">
                        {ms}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {match.suggestedPreparation && (
                <div className="text-xs text-amber-950 bg-white/90 p-2.5 rounded-lg border border-amber-200">
                  <span className="font-bold">Suggested preparation: </span>
                  <span>{match.suggestedPreparation}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-300 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950">
                  100% Core Skill Fit!
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  You already possess all required skills declared for this opportunity. You are in the top tier of eligible candidates!
                </p>
              </div>
            </div>
          )}

          {/* Full Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              About This Opportunity
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
              {opportunity.longDescription || opportunity.description}
            </p>
          </div>

          {/* Eligibility Requirements */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Eligibility & Prerequisites
            </h4>
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800">
              <GraduationCap className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <span className="font-medium">{opportunity.eligibility}</span>
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Skills Required
            </h4>
            <div className="flex flex-wrap gap-2">
              {opportunity.skills.map((skill) => {
                const isMatched = match.matchedSkills.includes(skill);
                return (
                  <span
                    key={skill}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                      isMatched
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isMatched ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{skill}</span>
                    {isMatched && <span className="text-[10px] text-emerald-700 font-bold">(In your profile)</span>}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          {opportunity.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Tags & Keywords
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.tags.map((tag) => (
                  <span key={tag} className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Saved Status Selector if Saved */}
          {isSaved && onUpdateStatus && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-800">Application Pipeline Status:</span>
              <select
                value={savedStatus}
                onChange={(e) => {
                  const newStatus = e.target.value as ApplicationStatus;
                  onUpdateStatus(opportunity.id, newStatus);
                  if (newStatus === 'Applied') {
                    try {
                      window.open(opportunity.applicationUrl, '_blank', 'noopener,noreferrer');
                    } catch (err) {
                      console.error('Failed to open external portal', err);
                    }
                  }
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Saved">Saved for Later</option>
                <option value="In Progress">Application In Progress</option>
                <option value="Applied">Applied (Open Portal)</option>
                <option value="Interviewing">Interviewing / Screening</option>
                <option value="Completed">Completed / Accepted</option>
              </select>
            </div>
          )}

          {/* Direct Portal Link Preview */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/70 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-blue-900 truncate">
              <span className="font-bold shrink-0">Official Portal:</span>
              <a 
                href={opportunity.applicationUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="truncate underline text-blue-700 hover:text-blue-900"
              >
                {opportunity.applicationUrl}
              </a>
            </div>
            <a
              href={opportunity.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (onUpdateStatus) {
                  onUpdateStatus(opportunity.id, 'Applied');
                }
              }}
              className="shrink-0 px-2 py-1 rounded bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <span>Visit Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => onToggleSave(opportunity.id)}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isSaved
                ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
            <span>{isSaved ? 'Saved in Opportunities' : 'Save Opportunity'}</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              Close
            </button>
            <a
              href={opportunity.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (onUpdateStatus) {
                  onUpdateStatus(opportunity.id, 'Applied');
                }
              }}
              className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apply / Visit Official Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
