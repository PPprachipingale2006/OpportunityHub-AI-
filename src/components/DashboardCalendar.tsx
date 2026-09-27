import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  ExternalLink,
  Plus,
  Bookmark,
  CalendarCheck,
  AlertCircle,
  Share2,
  CheckCircle2,
  Video,
  MapPin,
  Edit2,
  Trash2,
  Check
} from 'lucide-react';
import { 
  Opportunity, 
  SavedOpportunityItem, 
  ApplicationStatus, 
  OpportunityCategory, 
  CustomCalendarEvent,
  CalendarEventType
} from '../types';
import { CURRENT_DATE_STRING, CURRENT_DATE, getDaysRemaining, formatDeadline } from '../utils/dateUtils';
import { AddCalendarEventModal } from './AddCalendarEventModal';

export interface MergedCalendarItem {
  id: string;
  source: 'saved_opportunity' | 'custom_event';
  title: string;
  organization: string;
  dateStr: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  category?: OpportunityCategory;
  eventType: CalendarEventType;
  status: ApplicationStatus;
  notes?: string;
  location?: string;
  meetingUrl?: string;
  opportunity?: Opportunity;
  customEvent?: CustomCalendarEvent;
  daysRemaining: number;
}

interface DashboardCalendarProps {
  opportunities: Opportunity[];
  savedItems: SavedOpportunityItem[];
  customEvents: CustomCalendarEvent[];
  onSaveCustomEvent: (event: CustomCalendarEvent) => void;
  onDeleteCustomEvent: (id: string) => void;
  onViewDetails: (opp: Opportunity) => void;
  onNavigateToSaved: () => void;
}

export const DashboardCalendar: React.FC<DashboardCalendarProps> = ({
  opportunities,
  savedItems,
  customEvents,
  onSaveCustomEvent,
  onDeleteCustomEvent,
  onViewDetails,
  onNavigateToSaved
}) => {
  // Calendar month state (defaults to September 2026 / current date)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 0-indexed: 8 = September, 9 = October
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(CURRENT_DATE_STRING);
  const [filterType, setFilterType] = useState<'all' | 'interview' | 'hackathon' | 'deadline' | 'study'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'agenda'>('grid');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CustomCalendarEvent | null>(null);
  const [modalInitialDate, setModalInitialDate] = useState<string>('2026-09-29');

  // Build merged calendar events
  const allEvents = useMemo<MergedCalendarItem[]>(() => {
    const list: MergedCalendarItem[] = [];

    // 1. Saved Opportunities / Pipelines
    for (const saved of savedItems) {
      const opp = opportunities.find(o => o.id === saved.opportunityId);
      if (!opp) continue;

      let eventType: CalendarEventType = 'deadline';
      if (saved.status === 'Interviewing' || opp.tags.includes('Interviewing')) {
        eventType = 'interview';
      } else if (opp.category === 'Hackathon') {
        eventType = 'hackathon';
      } else if (opp.category === 'Workshop') {
        eventType = 'workshop';
      } else {
        eventType = 'deadline';
      }

      const dateStr = opp.deadline;
      const daysRemaining = getDaysRemaining(dateStr);

      list.push({
        id: `opp-${saved.opportunityId}`,
        source: 'saved_opportunity',
        title: opp.title,
        organization: opp.organization,
        dateStr,
        startTime: '11:59 PM',
        endTime: undefined,
        category: opp.category,
        eventType,
        status: saved.status,
        notes: saved.notes,
        location: opp.location ? `${opp.location} (${opp.mode})` : opp.mode,
        meetingUrl: undefined,
        opportunity: opp,
        daysRemaining
      });
    }

    // 2. Custom User Scheduled Events
    for (const evt of customEvents) {
      const daysRemaining = getDaysRemaining(evt.dateStr);
      list.push({
        id: evt.id,
        source: 'custom_event',
        title: evt.title,
        organization: evt.organization || 'Personal Milestone',
        dateStr: evt.dateStr,
        startTime: evt.startTime || '10:00 AM',
        endTime: evt.endTime,
        eventType: evt.eventType,
        status: evt.status || 'Interviewing',
        notes: evt.notes,
        location: evt.location || 'Virtual / Online',
        meetingUrl: evt.meetingUrl,
        customEvent: evt,
        daysRemaining
      });
    }

    return list.sort((a, b) => {
      const dateCmp = a.dateStr.localeCompare(b.dateStr);
      if (dateCmp !== 0) return dateCmp;
      return (a.startTime || '').localeCompare(b.startTime || '');
    });
  }, [savedItems, opportunities, customEvents]);

  // Filter events
  const filteredEvents = useMemo(() => {
    if (filterType === 'all') return allEvents;
    return allEvents.filter(e => e.eventType === filterType);
  }, [allEvents, filterType]);

  // Group events by YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map = new Map<string, MergedCalendarItem[]>();
    for (const evt of filteredEvents) {
      const existing = map.get(evt.dateStr) || [];
      existing.push(evt);
      map.set(evt.dateStr, existing);
    }
    return map;
  }, [filteredEvents]);

  // Generate calendar grid dates for currentYear & currentMonth
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon...

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean; dayOfWeekName: string }[] = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Padding from previous month
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const prevDate = new Date(currentYear, currentMonth - 1, dayNum);
      const dateStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({ 
        dateStr, 
        dayNum, 
        isCurrentMonth: false,
        dayOfWeekName: dayNames[prevDate.getDay()]
      });
    }

    // Days in current month
    for (let i = 1; i <= daysInMonth; i++) {
      const thisDate = new Date(currentYear, currentMonth, i);
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ 
        dateStr, 
        dayNum: i, 
        isCurrentMonth: true,
        dayOfWeekName: dayNames[thisDate.getDay()]
      });
    }

    // Padding for next month to complete grid
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(currentYear, currentMonth + 1, i);
      const dateStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ 
        dateStr, 
        dayNum: i, 
        isCurrentMonth: false,
        dayOfWeekName: dayNames[nextDate.getDay()]
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Navigate months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleGoToToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(8); // September
    setSelectedDateStr(CURRENT_DATE_STRING);
  };

  const openCreateModalForDate = (dateStr: string) => {
    setEventToEdit(null);
    setModalInitialDate(dateStr);
    setIsModalOpen(true);
  };

  const openEditModalForEvent = (event: CustomCalendarEvent) => {
    setEventToEdit(event);
    setModalInitialDate(event.dateStr);
    setIsModalOpen(true);
  };

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper colors for event types
  const getEventBadge = (eventType: CalendarEventType) => {
    switch (eventType) {
      case 'interview':
        return {
          label: 'Interview',
          bg: 'bg-purple-100 text-purple-800 border-purple-200',
          dot: 'bg-purple-600'
        };
      case 'hackathon':
        return {
          label: 'Hackathon',
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          dot: 'bg-amber-600'
        };
      case 'workshop':
        return {
          label: 'Workshop',
          bg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
          dot: 'bg-cyan-600'
        };
      case 'study':
        return {
          label: 'Study / Prep',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-600'
        };
      case 'meeting':
        return {
          label: 'Meeting',
          bg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          dot: 'bg-indigo-600'
        };
      default:
        return {
          label: 'Deadline',
          bg: 'bg-rose-100 text-rose-800 border-rose-200',
          dot: 'bg-rose-600'
        };
    }
  };

  // Selected date events
  const selectedDateEvents = selectedDateStr ? (eventsByDate.get(selectedDateStr) || []) : [];

  // Selected day info (Day of week, formatted date)
  const selectedDayInfo = useMemo(() => {
    if (!selectedDateStr) return null;
    const parts = selectedDateStr.split('-').map(Number);
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return {
      dayOfWeek: dayNames[dateObj.getDay()],
      formatted: formatDeadline(selectedDateStr)
    };
  }, [selectedDateStr]);

  // Counts
  const interviewCount = allEvents.filter(e => e.eventType === 'interview').length;
  const deadlineCount = allEvents.filter(e => e.eventType === 'deadline').length;
  const hackathonCount = allEvents.filter(e => e.eventType === 'hackathon').length;
  const studyCount = allEvents.filter(e => e.eventType === 'study').length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CalendarCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Opportunity, Interview & Event Calendar
              </h2>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {allEvents.length} Scheduled
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Customize your interview timings, hackathon schedules, and deadlines with custom dates, days & times.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Add Custom Event Button */}
          <button
            onClick={() => openCreateModalForDate(selectedDateStr || '2026-09-29')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Customize New Event</span>
          </button>

          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month Grid
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'agenda'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Agenda Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Month Navigator Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs sm:text-sm font-bold text-slate-900 px-3 min-w-[130px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleGoToToday}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Today (Sep 2026)
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Dates ({allEvents.length})
          </button>
          <button
            onClick={() => setFilterType('interview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterType === 'interview'
                ? 'bg-purple-600 text-white font-bold'
                : 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>Interviews ({interviewCount})</span>
          </button>
          <button
            onClick={() => setFilterType('hackathon')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterType === 'hackathon'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Hackathons ({hackathonCount})</span>
          </button>
          <button
            onClick={() => setFilterType('deadline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterType === 'deadline'
                ? 'bg-rose-600 text-white font-bold'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Deadlines ({deadlineCount})</span>
          </button>
          <button
            onClick={() => setFilterType('study')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterType === 'study'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Prep ({studyCount})</span>
          </button>
        </div>
      </div>

      {/* Main Calendar View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid (2 columns on large screens) */}
          <div className="lg:col-span-2 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/40">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100/70 text-center py-2.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Day Cells */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-200/80 bg-white">
              {calendarDays.map((day, idx) => {
                const dayEvents = eventsByDate.get(day.dateStr) || [];
                const isSelected = selectedDateStr === day.dateStr;
                const isToday = day.dateStr === CURRENT_DATE_STRING;

                return (
                  <div
                    key={`${day.dateStr}-${idx}`}
                    onClick={() => setSelectedDateStr(day.dateStr)}
                    className={`min-h-[82px] sm:min-h-[92px] p-1.5 sm:p-2 transition-all cursor-pointer flex flex-col justify-between group relative ${
                      !day.isCurrentMonth
                        ? 'bg-slate-50/60 text-slate-400'
                        : isSelected
                        ? 'bg-blue-50/80 ring-2 ring-blue-500 ring-inset'
                        : 'hover:bg-slate-50/80 bg-white'
                    }`}
                  >
                    {/* Top Row: Date Number & Add Event Trigger */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                          isToday
                            ? 'bg-blue-600 text-white font-extrabold shadow-2xs'
                            : isSelected
                            ? 'text-blue-700 font-extrabold'
                            : day.isCurrentMonth
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {day.dayNum}
                      </span>

                      {/* Hover action to quickly add event for this specific date */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openCreateModalForDate(day.dateStr);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-opacity cursor-pointer"
                        title={`Add event on ${day.dayOfWeekName}, ${day.dateStr}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Event indicators with timing badge */}
                    <div className="space-y-1 mt-1">
                      {dayEvents.slice(0, 2).map((evt) => {
                        const badge = getEventBadge(evt.eventType);
                        return (
                          <div
                            key={evt.id}
                            title={`${evt.title} (${evt.startTime || 'All day'})`}
                            className={`text-[9.5px] truncate px-1.5 py-0.5 rounded font-semibold border flex items-center gap-1 ${badge.bg}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${badge.dot}`}></span>
                            <span className="truncate">{evt.title}</span>
                          </div>
                        );
                      })}

                      {dayEvents.length > 2 && (
                        <div className="text-[9px] font-bold text-slate-500 px-1">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Day Events & Timing Schedule Inspector */}
          <div className="space-y-4">
            <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-full">
              <div>
                {/* Header for Selected Date */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-3">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                      <span>{selectedDayInfo?.dayOfWeek || 'Date'}</span>
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                      {selectedDayInfo?.formatted || 'Select a date'}
                    </h3>
                  </div>

                  <button
                    onClick={() => openCreateModalForDate(selectedDateStr || '2026-09-29')}
                    className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="Add event for this date"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span className="text-[11px]">Add Event</span>
                  </button>
                </div>

                {/* Event list for selected date */}
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {selectedDateEvents.map((evt) => {
                      const badge = getEventBadge(evt.eventType);
                      const isClosing = evt.daysRemaining >= 0 && evt.daysRemaining <= 7;

                      return (
                        <div
                          key={evt.id}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all space-y-2 group"
                        >
                          {/* Event Type & Timing Pill */}
                          <div className="flex items-center justify-between text-xs">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badge.bg}`}>
                              {badge.label}
                            </span>

                            {/* Timing badge */}
                            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1 border border-slate-200">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{evt.startTime}{evt.endTime ? ` - ${evt.endTime}` : ''}</span>
                            </span>
                          </div>

                          {/* Title & Host */}
                          <div>
                            <h4 
                              onClick={() => {
                                if (evt.opportunity) onViewDetails(evt.opportunity);
                                else if (evt.customEvent) openEditModalForEvent(evt.customEvent);
                              }}
                              className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
                            >
                              {evt.title}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <span>{evt.organization}</span>
                            </p>
                          </div>

                          {/* Location / Meeting URL */}
                          {(evt.location || evt.meetingUrl) && (
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 pt-0.5">
                              {evt.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  <span>{evt.location}</span>
                                </span>
                              )}
                              {evt.meetingUrl && (
                                <a
                                  href={evt.meetingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                                >
                                  <Video className="w-3 h-3 text-blue-600" />
                                  <span>Join Virtual Meet</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          )}

                          {/* Notes */}
                          {evt.notes && (
                            <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/60 italic">
                              "{evt.notes}"
                            </div>
                          )}

                          {/* Action controls */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-slate-500 font-semibold">
                              Status: <span className="font-bold text-slate-800">{evt.status}</span>
                            </span>

                            <div className="flex items-center gap-2">
                              {evt.customEvent ? (
                                <>
                                  <button
                                    onClick={() => openEditModalForEvent(evt.customEvent!)}
                                    className="text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer text-xs"
                                    title="Edit timings and details"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm('Delete this scheduled event?')) {
                                        onDeleteCustomEvent(evt.customEvent!.id);
                                      }
                                    }}
                                    className="text-slate-400 hover:text-rose-600 cursor-pointer p-0.5"
                                    title="Delete event"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              ) : evt.opportunity ? (
                                <button
                                  onClick={() => onViewDetails(evt.opportunity!)}
                                  className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5 cursor-pointer text-xs"
                                >
                                  <span>Details</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-500 space-y-2">
                    <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-600">
                      No events scheduled for {selectedDayInfo?.dayOfWeek || 'this date'}.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Click "Add Event" to schedule an interview, mock session, or deadline.
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Quick Action button */}
              <div className="pt-3 border-t border-slate-200/80 mt-4 flex items-center gap-2">
                <button
                  onClick={() => openCreateModalForDate(selectedDateStr || '2026-09-29')}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Schedule on {selectedDayInfo?.dayOfWeek || 'Date'}</span>
                </button>
                <button
                  onClick={onNavigateToSaved}
                  className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
                >
                  Tracker
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Agenda / Timeline View with Timings */
        <div className="space-y-3">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((evt) => {
                const badge = getEventBadge(evt.eventType);
                const isClosing = evt.daysRemaining >= 0 && evt.daysRemaining <= 7;

                return (
                  <div
                    key={evt.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {formatDeadline(evt.dateStr)}
                        </span>
                      </div>

                      <div>
                        <h4
                          onClick={() => {
                            if (evt.opportunity) onViewDetails(evt.opportunity);
                            else if (evt.customEvent) openEditModalForEvent(evt.customEvent);
                          }}
                          className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
                        >
                          {evt.title}
                        </h4>

                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{evt.organization}</span>
                        </p>
                      </div>

                      {/* Timing bar */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Timing: {evt.startTime}{evt.endTime ? ` - ${evt.endTime}` : ''}</span>
                      </div>

                      {evt.meetingUrl && (
                        <a
                          href={evt.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center gap-1"
                        >
                          <Video className="w-3 h-3" />
                          <span>Join Virtual Meeting</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}

                      {evt.notes && (
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 italic line-clamp-2">
                          "{evt.notes}"
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      {isClosing ? (
                        <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-rose-600" />
                          <span>{evt.daysRemaining === 0 ? 'Today' : `in ${evt.daysRemaining} days`}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-500">
                          Status: <span className="font-bold text-slate-800">{evt.status}</span>
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        {evt.customEvent ? (
                          <button
                            onClick={() => openEditModalForEvent(evt.customEvent!)}
                            className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        ) : evt.opportunity ? (
                          <button
                            onClick={() => onViewDetails(evt.opportunity!)}
                            className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <CalendarIcon className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No scheduled dates found for this filter.</p>
              <p className="text-xs text-slate-500">
                Click "Customize New Event" above to schedule your interviews, meetings, and deadlines.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Customize / Add Event Modal */}
      <AddCalendarEventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEventToEdit(null);
        }}
        onSaveEvent={onSaveCustomEvent}
        onDeleteEvent={onDeleteCustomEvent}
        initialDateStr={modalInitialDate}
        eventToEdit={eventToEdit}
      />
    </div>
  );
};
