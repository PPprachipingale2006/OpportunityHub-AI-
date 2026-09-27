export type OpportunityCategory = 
  | 'Internship'
  | 'Hackathon'
  | 'Scholarship'
  | 'Course'
  | 'Certification'
  | 'Competition'
  | 'Workshop';

export type LocationOption = 
  | 'Remote'
  | 'Pune'
  | 'Mumbai'
  | 'Bengaluru'
  | 'Hyderabad'
  | 'India'
  | 'Anywhere';

export type ModeOption = 'Remote' | 'On-site' | 'Hybrid';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  description: string;
  longDescription?: string;
  skills: string[];
  location: string;
  mode: ModeOption;
  deadline: string; // YYYY-MM-DD
  duration: string;
  eligibility: string;
  applicationUrl: string;
  stipendOrPrize?: string;
  tags: string[];
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  featured?: boolean;
  isCustom?: boolean;
}

export interface StudentProfile {
  name: string;
  email: string;
  college: string;
  degree: string;
  yearOfStudy: string;
  skills: string[];
  interests: string[];
  preferredCategories: OpportunityCategory[];
  preferredLocations: string[];
  bio?: string;
}

export interface MatchAnalysis {
  score: number; // 0 - 100
  skillScore: number; // 0 - 40
  interestScore: number; // 0 - 30
  categoryScore: number; // 0 - 20
  locationScore: number; // 0 - 10
  matchedSkills: string[];
  missingSkills: string[];
  matchedInterests: string[];
  matchedCategory: boolean;
  matchedLocation: boolean;
  reasons: string[];
  suggestedPreparation?: string;
}

export type ApplicationStatus = 'Saved' | 'Applied' | 'In Progress' | 'Interviewing' | 'Offered' | 'Completed';

export interface SavedOpportunityItem {
  opportunityId: string;
  savedAt: string;
  status: ApplicationStatus;
  notes?: string;
}

export type CalendarEventType = 'interview' | 'hackathon' | 'deadline' | 'workshop' | 'meeting' | 'study';

export interface CustomCalendarEvent {
  id: string;
  title: string;
  organization?: string;
  dateStr: string; // YYYY-MM-DD
  startTime?: string; // e.g. "10:00 AM" or "10:00"
  endTime?: string; // e.g. "11:30 AM" or "11:30"
  eventType: CalendarEventType;
  status?: ApplicationStatus;
  meetingUrl?: string; // e.g. Google Meet, Zoom, Chime link
  location?: string; // e.g. "Online / Amazon Chime", "Campus Lab 3"
  notes?: string;
  associatedOpportunityId?: string;
  createdAt: string;
}

export interface FilterState {
  search: string;
  category: string;
  location: string;
  skill: string;
  deadlineFilter: 'all' | 'closing_soon' | 'this_week' | 'this_month';
  showExpired: boolean;
  sortBy: 'match' | 'deadline' | 'newest';
}
