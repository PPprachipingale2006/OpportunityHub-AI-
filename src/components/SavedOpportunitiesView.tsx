import React, { useState } from 'react';
import { 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Sparkles,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
  Plus,
  Edit3,
  Check,
  Building2,
  FileText
} from 'lucide-react';
import { Opportunity, MatchAnalysis, SavedOpportunityItem, ApplicationStatus } from '../types';
import { formatDeadline, isClosingSoon, isExpired } from '../utils/dateUtils';
import { AddCustomApplicationModal } from './AddCustomApplicationModal';

interface SavedOpportunitiesViewProps {
  opportunities: Opportunity[];
  matches: Map<string, MatchAnalysis>;
  savedItems: SavedOpportunityItem[];
  onRemoveSaved: (id: string) => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onUpdateNotes?: (id: string, notes: string) => void;
  onAddCustomApplication?: (opp: Opportunity, status: ApplicationStatus, notes: string) => void;
  onViewDetails: (opp: Opportunity) => void;
  onNavigateToExplore: () => void;
}

export const SavedOpportunitiesView: React.FC<SavedOpportunitiesViewProps> = ({
  opportunities,
  matches,
  savedItems,
  onRemoveSaved,
  onUpdateStatus,
  onUpdateNotes,
  onAddCustomApplication,
  onViewDetails,
  onNavigateToExplore
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');

  // Map saved items to their full opportunity objects
  const savedOpportunities = savedItems
    .map(saved => {
      const opp = opportunities.find(o => o.id === saved.opportunityId);
      return opp ? { opp, saved } : null;
    })
    .filter((item): item is { opp: Opportunity; saved: SavedOpportunityItem } => item !== null);

  const filteredList = savedOpportunities.filter(({ saved }) => {
    if (filterStatus === 'All') return true;
    return saved.status === filterStatus;
  });

  const handleStatusChange = (opp: Opportunity, newStatus: ApplicationStatus) => {
    onUpdateStatus(opp.id, newStatus);
    if (newStatus === 'Applied') {
      try {
        window.open(opp.applicationUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.error('Error opening application portal:', err);
      }
    }
  };

  const handleStartEditNote = (id: string, currentNote: string = '') => {
    setEditingNoteId(id);
    setTempNoteText(currentNote);
  };

  const handleSaveNote = (id: string) => {
    if (onUpdateNotes) {
      onUpdateNotes(id, tempNoteText);
    }
    setEditingNoteId(null);
  };

  const statusColors: Record<ApplicationStatus, string> = {
    'Saved': 'bg-slate-100 text-slate-700 border-slate-300',
    'In Progress': 'bg-amber-50 text-amber-800 border-amber-300',
    'Applied': 'bg-blue-50 text-blue-800 border-blue-300',
    'Interviewing': 'bg-purple-50 text-purple-800 border-purple-300',
    'Offered': 'bg-emerald-50 text-emerald-800 border-emerald-300',
    'Completed': 'bg-teal-50 text-teal-800 border-teal-300'
  };

  // Status counts
  const getStatusCount = (st: string) => {
    if (st === 'All') return savedItems.length;
    return savedItems.filter(s => s.status === st).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Application Tracker & Saved Pipeline
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {savedItems.length} Tracked
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track live interviews, applications in progress, and custom positions from Amazon, Google, or campus drives.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Add Custom Application / Track Interview button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Custom Position / Interview</span>
          </button>

          <button
            onClick={onNavigateToExplore}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-300 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore Feed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs by Application Pipeline Status */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', 'Interviewing', 'Applied', 'Offered', 'In Progress', 'Completed', 'Saved'].map((status) => {
          const count = getStatusCount(status);
          const isSelected = filterStatus === status;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{status}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isSelected ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Saved & Tracked Opportunities List */}
      {filteredList.length > 0 ? (
        <div className="space-y-4">
          {filteredList.map(({ opp, saved }) => {
            const match = matches.get(opp.id) || {
              score: 85,
              reasons: [],
              matchedSkills: [],
              missingSkills: []
            };
            const expired = isExpired(opp.deadline);
            const closingSoon = !expired && isClosingSoon(opp.deadline);
            const isEditingNote = editingNoteId === opp.id;

            return (
              <div
                key={opp.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Info Column */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {opp.isCustom ? (
                        <span className="font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-amber-700" />
                          <span>Custom Tracked Application</span>
                        </span>
                      ) : (
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {opp.category}
                        </span>
                      )}

                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600 font-medium">{opp.mode}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                        {match.score}% Match
                      </span>

                      {closingSoon && (
                        <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold border border-rose-200">
                          🔥 Closing Soon
                        </span>
                      )}
                      {expired && (
                        <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-bold">
                          Expired
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => onViewDetails(opp)}
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {opp.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {opp.organization}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {opp.location}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Date: {formatDeadline(opp.deadline)}
                      </span>
                      {opp.stipendOrPrize && (
                        <>
                          <span>·</span>
                          <span className="text-slate-700 font-semibold">{opp.stipendOrPrize}</span>
                        </>
                      )}
                    </div>

                    {opp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {opp.skills.map((s) => (
                          <span key={s} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Pipeline Controls */}
                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-500 lg:hidden">Status:</span>
                      <select
                        value={saved.status}
                        onChange={(e) => handleStatusChange(opp, e.target.value as ApplicationStatus)}
                        className={`text-xs font-bold px-3 py-2 rounded-xl border focus:outline-none cursor-pointer ${
                          statusColors[saved.status] || 'bg-slate-100'
                        }`}
                      >
                        <option value="Interviewing">🎯 Interviewing</option>
                        <option value="Applied">📝 Applied (Open Portal)</option>
                        <option value="Offered">🏆 Offered / Selected</option>
                        <option value="In Progress">⏳ In Progress</option>
                        <option value="Completed">🎉 Completed</option>
                        <option value="Saved">📌 Saved for Later</option>
                      </select>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails(opp)}
                        className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                      <a
                        href={opp.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          onUpdateStatus(opp.id, 'Applied');
                        }}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => onRemoveSaved(opp.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Interview Notes & Status Log Bar */}
                <div className="pt-3 border-t border-slate-100 bg-slate-50/70 -mx-5 -mb-5 px-5 py-3 rounded-b-2xl">
                  {isEditingNote ? (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={tempNoteText}
                        onChange={(e) => setTempNoteText(e.target.value)}
                        placeholder="e.g. Cleared round 1 DSA. Next interview on Tuesday with Amazon Engineering Manager..."
                        className="w-full text-xs p-2.5 bg-white rounded-xl border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNote(opp.id)}
                          className="px-3 py-1 text-xs bg-blue-600 text-white font-bold rounded-lg flex items-center gap-1 hover:bg-blue-700 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Note</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2 flex-1">
                        <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="font-semibold text-slate-700">Interview Log / Notes:</span>
                        <span className="text-slate-600 italic">
                          {saved.notes || 'No interview notes added yet.'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleStartEditNote(opp.id, saved.notes || '')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{saved.notes ? 'Edit Note' : 'Add Note'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No applications in this category</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            You can add any company position you are interviewing for (e.g. Amazon, Google) or explore opportunities from our platform.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Custom Position</span>
            </button>
            <button
              onClick={onNavigateToExplore}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Explore Feed
            </button>
          </div>
        </div>
      )}

      {/* Add Custom Application Modal */}
      <AddCustomApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddApplication={(newOpp, newStatus, newNotes) => {
          if (onAddCustomApplication) {
            onAddCustomApplication(newOpp, newStatus, newNotes);
          }
        }}
      />
    </div>
  );
};
