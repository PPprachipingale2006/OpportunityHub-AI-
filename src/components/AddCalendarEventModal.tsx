import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Building2, 
  Video, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  Trash2,
  Tag
} from 'lucide-react';
import { CustomCalendarEvent, CalendarEventType, ApplicationStatus } from '../types';

interface AddCalendarEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEvent: (event: CustomCalendarEvent) => void;
  onDeleteEvent?: (id: string) => void;
  initialDateStr?: string;
  eventToEdit?: CustomCalendarEvent | null;
}

export const AddCalendarEventModal: React.FC<AddCalendarEventModalProps> = ({
  isOpen,
  onClose,
  onSaveEvent,
  onDeleteEvent,
  initialDateStr,
  eventToEdit
}) => {
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [dateStr, setDateStr] = useState(initialDateStr || '2026-09-29');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:00 AM');
  const [eventType, setEventType] = useState<CalendarEventType>('interview');
  const [status, setStatus] = useState<ApplicationStatus>('Interviewing');
  const [location, setLocation] = useState('Virtual / Online');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [notes, setNotes] = useState('');

  // Load event to edit or default values
  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setOrganization(eventToEdit.organization || '');
      setDateStr(eventToEdit.dateStr);
      setStartTime(eventToEdit.startTime || '10:00 AM');
      setEndTime(eventToEdit.endTime || '11:00 AM');
      setEventType(eventToEdit.eventType);
      setStatus(eventToEdit.status || 'Interviewing');
      setLocation(eventToEdit.location || 'Virtual / Online');
      setMeetingUrl(eventToEdit.meetingUrl || '');
      setNotes(eventToEdit.notes || '');
    } else {
      setTitle('');
      setOrganization('');
      setDateStr(initialDateStr || '2026-09-29');
      setStartTime('10:00 AM');
      setEndTime('11:00 AM');
      setEventType('interview');
      setStatus('Interviewing');
      setLocation('Virtual / Online');
      setMeetingUrl('');
      setNotes('');
    }
  }, [eventToEdit, initialDateStr, isOpen]);

  if (!isOpen) return null;

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dateStr) return;

    const eventData: CustomCalendarEvent = {
      id: eventToEdit ? eventToEdit.id : `cal-custom-${Date.now()}`,
      title: title.trim(),
      organization: organization.trim() || undefined,
      dateStr,
      startTime: startTime.trim() || undefined,
      endTime: endTime.trim() || undefined,
      eventType,
      status,
      location: location.trim() || undefined,
      meetingUrl: meetingUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: eventToEdit ? eventToEdit.createdAt : new Date().toISOString()
    };

    onSaveEvent(eventData);
    onClose();
  };

  const handleQuickFill = (
    presetTitle: string,
    presetOrg: string,
    presetType: CalendarEventType,
    presetStart: string,
    presetEnd: string,
    presetNotes: string,
    presetMeetUrl: string
  ) => {
    setTitle(presetTitle);
    setOrganization(presetOrg);
    setEventType(presetType);
    setStartTime(presetStart);
    setEndTime(presetEnd);
    setNotes(presetNotes);
    setMeetingUrl(presetMeetUrl);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {eventToEdit ? 'Customize Calendar Event' : 'Add Custom Event & Timings'}
              </h2>
              <p className="text-xs text-slate-500">
                Schedule your interview rounds, hackathon sessions, and study milestones
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

        {/* Quick Fill Presets */}
        {!eventToEdit && (
          <div className="px-6 pt-3.5 pb-2 bg-blue-50/50 border-b border-blue-100 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-600 text-[11px] uppercase tracking-wider">Quick Fill:</span>
            <button
              type="button"
              onClick={() => handleQuickFill(
                'Amazon Technical Round 2: DSA & System Design',
                'Amazon',
                'interview',
                '10:00 AM',
                '11:15 AM',
                'Focus on Trees, Graph algorithms, and Customer Obsession examples.',
                'https://chime.aws/interview-room-amazon'
              )}
              className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-700 font-semibold hover:border-blue-400 transition-colors cursor-pointer text-[11px]"
            >
              📦 Amazon Interview (10:00 AM)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill(
                'Hackathon Project Mentorship Sync',
                'Google DSC',
                'hackathon',
                '04:00 PM',
                '05:00 PM',
                'Demo working React and AI prototype to mentors.',
                'https://meet.google.com/dsc-mentor-sync'
              )}
              className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-700 font-semibold hover:border-blue-400 transition-colors cursor-pointer text-[11px]"
            >
              🏆 Hackathon Sync (04:00 PM)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill(
                'Peer Mock Interview & Coding Practice',
                'COEP Coding Club',
                'study',
                '06:30 PM',
                '07:30 PM',
                'Review Dynamic Programming medium questions.',
                ''
              )}
              className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-700 font-semibold hover:border-blue-400 transition-colors cursor-pointer text-[11px]"
            >
              📖 Mock Prep (06:30 PM)
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Amazon SDE Interview Round 2, Mock Practice, Hackathon Sync"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Organization / Host */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Company / Organization / Host
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Amazon, Google, College, Self"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Event Category Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as CalendarEventType)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="interview">🎯 Interview Round</option>
                <option value="hackathon">🏆 Hackathon Sprint / Mentorship</option>
                <option value="deadline">⏰ Application / Submission Deadline</option>
                <option value="workshop">🛠 Workshop / Live Bootcamp</option>
                <option value="meeting">🤝 Meeting / Mentor Session</option>
                <option value="study">📖 Study / Mock Interview Prep</option>
              </select>
            </div>
          </div>

          {/* Date and Timing Row */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block">
              📅 Date, Day & Timing Schedule
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Start Timing
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* End Time */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  End Timing
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="e.g. 11:15 AM"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Quick Timing Preset chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
              <span className="text-slate-500 font-medium">Common Slots:</span>
              {[
                { s: '09:00 AM', e: '10:00 AM' },
                { s: '10:00 AM', e: '11:15 AM' },
                { s: '02:00 PM', e: '03:00 PM' },
                { s: '04:00 PM', e: '05:00 PM' },
                { s: '06:30 PM', e: '07:30 PM' },
                { s: '11:59 PM', e: 'End of Day' }
              ].map((slot, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setStartTime(slot.s);
                    setEndTime(slot.e);
                  }}
                  className="px-2 py-0.5 rounded bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 font-medium transition-colors cursor-pointer"
                >
                  {slot.s} - {slot.e}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pipeline Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Interviewing">🎯 Interviewing</option>
                <option value="Applied">📝 Applied</option>
                <option value="Offered">🏆 Offered / Selected</option>
                <option value="In Progress">⏳ In Progress</option>
                <option value="Completed">🎉 Completed / Cleared</option>
                <option value="Saved">📌 Saved</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Location / Platform
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Amazon Chime, Google Meet, COEP Campus"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Meeting Video Link */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Virtual Meeting Link (Optional)
            </label>
            <div className="relative">
              <Video className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="url"
                placeholder="https://meet.google.com/... or https://chime.aws/..."
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Notes & Prep Checklist */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Preparation Notes & Checklist
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <textarea
                rows={2}
                placeholder="e.g. Revise Binary Search Trees, System Design basics, and Amazon Leadership Principles."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {eventToEdit && onDeleteEvent ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this scheduled event?')) {
                    onDeleteEvent(eventToEdit.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{eventToEdit ? 'Save Changes' : 'Add Scheduled Event'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
