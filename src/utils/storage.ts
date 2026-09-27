import { StudentProfile, SavedOpportunityItem, CustomCalendarEvent } from '../types';

export const DEFAULT_PRACHI_PROFILE: StudentProfile = {
  name: 'Prachi Pingale',
  email: 'pingaleprachi2006@gmail.com',
  college: 'College of Engineering Pune (COEP)',
  degree: 'B.Tech in Computer Engineering',
  yearOfStudy: '3rd Year',
  skills: [
    'Python',
    'JavaScript',
    'React',
    'SQL',
    'Machine Learning',
    'Artificial Intelligence',
    'Web Development'
  ],
  interests: [
    'Artificial Intelligence',
    'Machine Learning',
    'Software Development',
    'Web Development'
  ],
  preferredCategories: [
    'Hackathon',
    'Internship',
    'Scholarship',
    'Course'
  ],
  preferredLocations: [
    'Pune',
    'Remote',
    'Bengaluru'
  ],
  bio: 'Passionate computer engineering student eager to build scalable web applications and explore applied AI systems.'
};

const STORAGE_KEYS = {
  PROFILE: 'opphub_student_profile',
  SAVED: 'opphub_saved_opportunities',
  CUSTOM: 'opphub_custom_opportunities',
  CALENDAR_EVENTS: 'opphub_calendar_custom_events',
  AUTH: 'opphub_auth_session'
};

export function getStoredProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse stored profile', e);
  }
  return DEFAULT_PRACHI_PROFILE;
}

export function saveStoredProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    window.dispatchEvent(new Event('opphub_profile_updated'));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getStoredSavedOpportunities(): SavedOpportunityItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse saved opportunities', e);
  }
  // Initial default saved opportunities for demonstration
  const initialSaved: SavedOpportunityItem[] = [
    {
      opportunityId: 'custom-amazon-1',
      savedAt: '2026-09-27T08:00:00Z',
      status: 'Interviewing',
      notes: 'Technical Round 1 (DSA & Trees) cleared! Technical Round 2 with hiring manager scheduled for next week.'
    },
    {
      opportunityId: 'opp-1',
      savedAt: '2026-09-26T14:20:00Z',
      status: 'Saved',
      notes: 'Forming a 4-person team with college batchmates.'
    },
    {
      opportunityId: 'opp-2',
      savedAt: '2026-09-25T10:15:00Z',
      status: 'Applied',
      notes: 'Submitted resume and portfolio link.'
    },
    {
      opportunityId: 'opp-3',
      savedAt: '2026-09-24T18:00:00Z',
      status: 'In Progress',
      notes: 'Drafting statement of purpose essay.'
    },
    {
      opportunityId: 'opp-22',
      savedAt: '2026-09-22T11:00:00Z',
      status: 'Offered',
      notes: 'Offer letter & subsidized examination voucher received!'
    }
  ];
  return initialSaved;
}

export function getStoredCustomOpportunities(): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse custom opportunities', e);
  }
  // Default custom opportunity: Amazon SDE Intern
  const initialCustom = [
    {
      id: 'custom-amazon-1',
      title: 'Software Development Engineer (SDE) Intern',
      organization: 'Amazon',
      category: 'Internship',
      description: 'Interviewing for SDE Internship with Amazon AWS Cloud Services team.',
      longDescription: 'Candidate in active interview loop for Amazon Summer Software Development Engineering Internship. Focus on Data Structures, Problem Solving, Distributed Systems, and Amazon Leadership Principles.',
      skills: ['Java', 'Python', 'SQL', 'Cloud Computing'],
      location: 'Bengaluru',
      mode: 'Hybrid',
      deadline: '2026-10-30',
      duration: '6 Months',
      eligibility: 'Enrolled in 3rd/4th year B.Tech/B.E. Computer Science or related degree',
      applicationUrl: 'https://www.amazon.jobs',
      stipendOrPrize: '₹80,000 / month + Relocation assistance',
      tags: ['Amazon', 'SDE', 'AWS', 'Interviewing'],
      difficultyLevel: 'Advanced',
      isCustom: true
    }
  ];
  return initialCustom;
}

export function saveStoredCustomOpportunities(items: any[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM, JSON.stringify(items));
    window.dispatchEvent(new Event('opphub_custom_updated'));
  } catch (e) {
    console.error('Failed to save custom opportunities', e);
  }
}

export function saveStoredSavedOpportunities(items: SavedOpportunityItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(items));
    window.dispatchEvent(new Event('opphub_saved_updated'));
  } catch (e) {
    console.error('Failed to save bookmarks', e);
  }
}

export function getStoredCalendarEvents(): CustomCalendarEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CALENDAR_EVENTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse calendar events', e);
  }
  // Default customizable events for student
  const defaultEvents: CustomCalendarEvent[] = [
    {
      id: 'cal-event-amazon-1',
      title: 'Amazon SDE Technical Round 2: Data Structures & System Design',
      organization: 'Amazon AWS',
      dateStr: '2026-09-29',
      startTime: '10:00 AM',
      endTime: '11:15 AM',
      eventType: 'interview',
      status: 'Interviewing',
      location: 'Virtual / Amazon Chime',
      meetingUrl: 'https://chime.aws/interview-room-prachi',
      notes: 'Prepare Binary Trees, LRU Cache, and Amazon Leadership Principles (Customer Obsession, Ownership).',
      createdAt: '2026-09-26T10:00:00Z'
    },
    {
      id: 'cal-event-gdsc-1',
      title: 'AI Hackathon Mentorship & Architecture Review',
      organization: 'Google Developer Student Clubs',
      dateStr: '2026-09-30',
      startTime: '04:00 PM',
      endTime: '05:00 PM',
      eventType: 'hackathon',
      status: 'In Progress',
      location: 'Google Meet',
      meetingUrl: 'https://meet.google.com/gdsc-hackathon-review',
      notes: 'Demo FastAPI backend and React UI prototype to mentor. Test latency with Google Cloud Run.',
      createdAt: '2026-09-26T12:00:00Z'
    },
    {
      id: 'cal-event-mock-1',
      title: 'Peer Mock Coding Interview (Graph Traversal & BFS/DFS)',
      organization: 'COEP Coding Club',
      dateStr: '2026-10-01',
      startTime: '06:30 PM',
      endTime: '07:30 PM',
      eventType: 'study',
      status: 'In Progress',
      location: 'COEP CS Lab 2 / Discord',
      notes: 'Practicing LeetCode medium questions with batchmates before tech round.',
      createdAt: '2026-09-27T08:00:00Z'
    }
  ];
  return defaultEvents;
}

export function saveStoredCalendarEvents(items: CustomCalendarEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(items));
    window.dispatchEvent(new Event('opphub_calendar_events_updated'));
  } catch (e) {
    console.error('Failed to save calendar events', e);
  }
}

export function isUserLoggedIn(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (raw) {
      const data = JSON.parse(raw);
      return Boolean(data.isLoggedIn);
    }
  } catch {
    // default true for smooth demo experience
  }
  return true;
}

export function setUserLoggedIn(isLoggedIn: boolean, email?: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ isLoggedIn, email }));
    window.dispatchEvent(new Event('opphub_auth_updated'));
  } catch (e) {
    console.error('Failed to save auth session', e);
  }
}

export function calculateProfileCompletion(profile: StudentProfile): number {
  let score = 0;
  if (profile.name.trim()) score += 15;
  if (profile.email.trim()) score += 10;
  if (profile.college.trim()) score += 15;
  if (profile.degree.trim()) score += 10;
  if (profile.yearOfStudy.trim()) score += 10;
  if (profile.skills.length >= 3) score += 20;
  else if (profile.skills.length > 0) score += 10;
  if (profile.interests.length >= 2) score += 10;
  if (profile.preferredCategories.length >= 1) score += 5;
  if (profile.preferredLocations.length >= 1) score += 5;
  return Math.min(100, score);
}
