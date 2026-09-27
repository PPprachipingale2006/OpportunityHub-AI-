import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Link as LinkIcon, 
  FileText, 
  Award, 
  Plus, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Opportunity, ApplicationStatus, OpportunityCategory, ModeOption } from '../types';
import { CATEGORY_OPTIONS, LOCATION_OPTIONS, SKILL_OPTIONS } from '../data/opportunities';

interface AddCustomApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApplication: (opp: Opportunity, status: ApplicationStatus, notes: string) => void;
}

export const AddCustomApplicationModal: React.FC<AddCustomApplicationModalProps> = ({
  isOpen,
  onClose,
  onAddApplication
}) => {
  const [organization, setOrganization] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<OpportunityCategory>('Internship');
  const [status, setStatus] = useState<ApplicationStatus>('Interviewing');
  const [location, setLocation] = useState('Bengaluru');
  const [mode, setMode] = useState<ModeOption>('Hybrid');
  const [deadline, setDeadline] = useState('2026-10-31');
  const [applicationUrl, setApplicationUrl] = useState('');
  const [stipendOrPrize, setStipendOrPrize] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Java', 'Python', 'SQL']);
  const [customSkillInput, setCustomSkillInput] = useState('');

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setCustomSkillInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization.trim() || !title.trim()) return;

    const newOpp: Opportunity = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      organization: organization.trim(),
      category,
      description: `${status} position at ${organization.trim()} (${category})`,
      longDescription: `Custom tracked opportunity for ${title.trim()} at ${organization.trim()}.\n\nPipeline Status: ${status}\nLocation: ${location} (${mode})\n${notes ? `\nStudent Notes / Interview Log:\n${notes}` : ''}`,
      skills: selectedSkills,
      location,
      mode,
      deadline: deadline || '2026-11-30',
      duration: 'Flexible / Standard',
      eligibility: 'Student Application Pipeline',
      applicationUrl: applicationUrl.trim() || `https://www.google.com/search?q=${encodeURIComponent(organization + ' careers')}`,
      stipendOrPrize: stipendOrPrize.trim() || undefined,
      tags: [organization.trim(), category, status, 'CustomTracked'],
      isCustom: true
    };

    onAddApplication(newOpp, status, notes.trim());
    onClose();
  };

  // Quick preset shortcuts for fast testing
  const handleQuickPreset = (company: string, role: string, defaultStatus: ApplicationStatus, defaultNotes: string, url: string) => {
    setOrganization(company);
    setTitle(role);
    setStatus(defaultStatus);
    setNotes(defaultNotes);
    setApplicationUrl(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Add Position / Track My Interview
              </h2>
              <p className="text-xs text-slate-500">
                Track custom applications from Amazon, startups, or campus drives
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets for Demo */}
        <div className="px-6 pt-4 pb-2 bg-blue-50/40 border-b border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-600 text-[11px] uppercase tracking-wider">Quick Fill:</span>
          <button
            type="button"
            onClick={() => handleQuickPreset('Amazon', 'Software Development Engineer (SDE) Intern', 'Interviewing', 'Technical Round 1 cleared. Scheduled for Round 2 next Tuesday!', 'https://amazon.jobs')}
            className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 hover:border-blue-400 text-blue-700 font-semibold transition-all cursor-pointer shadow-2xs"
          >
            📦 Amazon SDE (Interviewing)
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('Google', 'STEP Intern 2027', 'In Progress', 'Preparing resume and reviewing LeetCode medium questions.', 'https://careers.google.com')}
            className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 hover:border-blue-400 text-blue-700 font-semibold transition-all cursor-pointer shadow-2xs"
          >
            🌐 Google STEP (In Progress)
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('Microsoft', 'Software Engineer Intern', 'Completed', 'Final round cleared, offer letter received!', 'https://careers.microsoft.com')}
            className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 hover:border-blue-400 text-blue-700 font-semibold transition-all cursor-pointer shadow-2xs"
          >
            💻 Microsoft (Completed / Offer)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company / Organization */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Company / Organization *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon, Google, Microsoft, Startup"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Position / Role Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Role / Opportunity Title *
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. SDE Intern, Frontend Engineer, AI Trainee"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Pipeline Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Pipeline Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-blue-400 bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="In Progress">⏳ In Progress (Preparing)</option>
                <option value="Applied">📝 Applied (Submitted)</option>
                <option value="Interviewing">🎯 Interviewing (Active Rounds)</option>
                <option value="Offered">🏆 Offered / Selected</option>
                <option value="Completed">🎉 Completed</option>
                <option value="Saved">📌 Saved for Later</option>
              </select>
            </div>

            {/* Mode */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as ModeOption)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Pune, Hyderabad, Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Deadline / Next Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Interview / Deadline Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Application / Portal URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Application URL / Careers Portal
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="url"
                  placeholder="https://amazon.jobs/..."
                  value={applicationUrl}
                  onChange={(e) => setApplicationUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Compensation / Stipend */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Stipend / CTC (Optional)
              </label>
              <div className="relative">
                <Award className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. ₹80,000 / month, ₹18 LPA"
                  value={stipendOrPrize}
                  onChange={(e) => setStipendOrPrize(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Interview Notes / Status Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Interview Notes & Next Action
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <textarea
                rows={2}
                placeholder="e.g. Round 1 DSA (Binary Trees, Graphs) cleared! Round 2 with hiring manager scheduled on Oct 5. Revise System Design."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Skills Required */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Associated Skills / Stack
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {SKILL_OPTIONS.slice(0, 10).map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Add to Application Pipeline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
