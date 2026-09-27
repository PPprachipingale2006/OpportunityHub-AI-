/**
 * OpportunityHub AI — Student Opportunity Discovery Platform
 * Discover. Prepare. Apply.
 */

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { Opportunity, StudentProfile, MatchAnalysis, SavedOpportunityItem, OpportunityCategory, ApplicationStatus, CustomCalendarEvent } from './types';
import { SAMPLE_OPPORTUNITIES } from './data/opportunities';
import { 
  getStoredProfile, 
  saveStoredProfile, 
  getStoredSavedOpportunities, 
  saveStoredSavedOpportunities, 
  getStoredCustomOpportunities,
  saveStoredCustomOpportunities,
  getStoredCalendarEvents,
  saveStoredCalendarEvents,
  isUserLoggedIn, 
  setUserLoggedIn,
  DEFAULT_PRACHI_PROFILE
} from './utils/storage';
import { calculateMatchScore } from './utils/recommendation';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { OpportunityExplorer } from './components/OpportunityExplorer';
import { SavedOpportunitiesView } from './components/SavedOpportunitiesView';
import { StudentProfileView } from './components/StudentProfileView';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { CheckCircle2, Bookmark, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'dashboard' | 'opportunities' | 'saved' | 'profile' | 'login'>('dashboard');
  const [profile, setProfile] = useState<StudentProfile>(getStoredProfile);
  const [customOpportunities, setCustomOpportunities] = useState<Opportunity[]>(getStoredCustomOpportunities);
  
  // Combine custom tracked opportunities (e.g. Amazon, Google) with platform opportunities
  const opportunities = useMemo(() => {
    return [...customOpportunities, ...SAMPLE_OPPORTUNITIES];
  }, [customOpportunities]);

  const [savedItems, setSavedItems] = useState<SavedOpportunityItem[]>(getStoredSavedOpportunities);
  const [calendarEvents, setCalendarEvents] = useState<CustomCalendarEvent[]>(getStoredCalendarEvents);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isUserLoggedIn);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Auto-clear toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Dynamic match scores computed for each opportunity against student profile
  const matchesMap = useMemo(() => {
    const map = new Map<string, MatchAnalysis>();
    for (const opp of opportunities) {
      map.set(opp.id, calculateMatchScore(opp, profile));
    }
    return map;
  }, [opportunities, profile]);

  // Save/Bookmark toggle handler
  const handleToggleSave = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const exists = savedItems.some(item => item.opportunityId === id);
    let updated: SavedOpportunityItem[];
    if (exists) {
      updated = savedItems.filter(item => item.opportunityId !== id);
      setToastMessage({ text: 'Opportunity removed from saved list.', type: 'info' });
    } else {
      updated = [
        ...savedItems,
        {
          opportunityId: id,
          savedAt: new Date().toISOString(),
          status: 'Saved'
        }
      ];
      setToastMessage({ text: 'Opportunity saved! Track it under "Saved".', type: 'success' });
    }
    setSavedItems(updated);
    saveStoredSavedOpportunities(updated);
  };

  // Application Pipeline status updater
  const handleUpdateSavedStatus = (id: string, status: ApplicationStatus) => {
    const exists = savedItems.some(item => item.opportunityId === id);
    let updated: SavedOpportunityItem[];
    if (exists) {
      updated = savedItems.map(item => 
        item.opportunityId === id ? { ...item, status } : item
      );
    } else {
      updated = [
        ...savedItems,
        {
          opportunityId: id,
          savedAt: new Date().toISOString(),
          status
        }
      ];
    }
    setSavedItems(updated);
    saveStoredSavedOpportunities(updated);
    setToastMessage({ text: `Status updated to "${status}"`, type: 'success' });
  };

  const handleRemoveSaved = (id: string) => {
    const updated = savedItems.filter(item => item.opportunityId !== id);
    setSavedItems(updated);
    saveStoredSavedOpportunities(updated);
    setToastMessage({ text: 'Removed from saved opportunities.', type: 'info' });
  };

  // Add custom position / track external interview (e.g. Amazon, Google, startup)
  const handleAddCustomApplication = (newOpp: Opportunity, status: ApplicationStatus, notes: string) => {
    const updatedCustom = [newOpp, ...customOpportunities];
    setCustomOpportunities(updatedCustom);
    saveStoredCustomOpportunities(updatedCustom);

    const updatedSaved: SavedOpportunityItem[] = [
      {
        opportunityId: newOpp.id,
        savedAt: new Date().toISOString(),
        status,
        notes
      },
      ...savedItems.filter(s => s.opportunityId !== newOpp.id)
    ];
    setSavedItems(updatedSaved);
    saveStoredSavedOpportunities(updatedSaved);
    setToastMessage({ text: `Added ${newOpp.organization} (${newOpp.title}) to your tracker!`, type: 'success' });
  };

  // Update interview notes / status log
  const handleUpdateNotes = (id: string, notes: string) => {
    const updated = savedItems.map(item => 
      item.opportunityId === id ? { ...item, notes } : item
    );
    setSavedItems(updated);
    saveStoredSavedOpportunities(updated);
    setToastMessage({ text: 'Interview log / notes updated!', type: 'success' });
  };

  // Custom calendar event handlers (date, day & timing customization)
  const handleSaveCalendarEvent = (event: CustomCalendarEvent) => {
    const existingIndex = calendarEvents.findIndex(e => e.id === event.id);
    let updated: CustomCalendarEvent[];
    if (existingIndex >= 0) {
      updated = [...calendarEvents];
      updated[existingIndex] = event;
      setToastMessage({ text: `Updated scheduled event "${event.title}"!`, type: 'success' });
    } else {
      updated = [event, ...calendarEvents];
      setToastMessage({ text: `Scheduled "${event.title}" for ${event.dateStr} (${event.startTime || ''})!`, type: 'success' });
    }
    setCalendarEvents(updated);
    saveStoredCalendarEvents(updated);
  };

  const handleDeleteCalendarEvent = (id: string) => {
    const updated = calendarEvents.filter(e => e.id !== id);
    setCalendarEvents(updated);
    saveStoredCalendarEvents(updated);
    setToastMessage({ text: 'Scheduled event removed from calendar.', type: 'info' });
  };

  // Profile save handler
  const handleSaveProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    saveStoredProfile(newProfile);
    setToastMessage({ text: 'Profile updated & match scores refreshed!', type: 'success' });
  };

  // Auth handlers
  const handleLoginSuccess = (userProfile: StudentProfile) => {
    setProfile(userProfile);
    saveStoredProfile(userProfile);
    setIsLoggedIn(true);
    setUserLoggedIn(true, userProfile.email);
    setCurrentTab('dashboard');
    setToastMessage({ text: `Welcome back, ${userProfile.name}!`, type: 'success' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserLoggedIn(false);
    setCurrentTab('landing');
    setToastMessage({ text: 'You have been signed out.', type: 'info' });
  };

  const handleExploreWithCategory = (category?: OpportunityCategory) => {
    if (category) {
      setSelectedCategoryFilter(category);
    } else {
      setSelectedCategoryFilter('All');
    }
    setCurrentTab('opportunities');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Bookmark className="w-4 h-4 text-blue-400 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Global Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => {
          if (tab === 'opportunities') {
            setSelectedCategoryFilter('All');
          }
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        profile={profile}
        savedCount={savedItems.length}
        isLoggedIn={isLoggedIn}
        onOpenAuth={() => setCurrentTab('login')}
        onLogout={handleLogout}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onExplore={handleExploreWithCategory}
            onCreateProfile={() => {
              if (!isLoggedIn) {
                setCurrentTab('login');
              } else {
                setCurrentTab('profile');
              }
            }}
            onNavigateLogin={() => setCurrentTab('login')}
            onViewDetails={(opp) => setSelectedOpportunity(opp)}
            opportunities={opportunities}
          />
        )}

        {currentTab === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() => setCurrentTab('landing')}
            onNavigateExplore={() => {
              setSelectedCategoryFilter('All');
              setCurrentTab('opportunities');
            }}
            currentProfile={profile}
            isLoggedIn={isLoggedIn}
          />
        )}

        {currentTab === 'dashboard' && (
          <StudentDashboard
            profile={profile}
            opportunities={opportunities}
            matches={matchesMap}
            savedItems={savedItems}
            customEvents={calendarEvents}
            onSaveCustomEvent={handleSaveCalendarEvent}
            onDeleteCustomEvent={handleDeleteCalendarEvent}
            onToggleSave={handleToggleSave}
            onViewDetails={(opp) => setSelectedOpportunity(opp)}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onFilterByCategory={handleExploreWithCategory}
          />
        )}

        {currentTab === 'opportunities' && (
          <OpportunityExplorer
            opportunities={opportunities}
            matches={matchesMap}
            savedItems={savedItems}
            initialCategory={selectedCategoryFilter}
            onToggleSave={handleToggleSave}
            onViewDetails={(opp) => setSelectedOpportunity(opp)}
          />
        )}

        {currentTab === 'saved' && (
          <SavedOpportunitiesView
            opportunities={opportunities}
            matches={matchesMap}
            savedItems={savedItems}
            onRemoveSaved={handleRemoveSaved}
            onUpdateStatus={handleUpdateSavedStatus}
            onUpdateNotes={handleUpdateNotes}
            onAddCustomApplication={handleAddCustomApplication}
            onViewDetails={(opp) => setSelectedOpportunity(opp)}
            onNavigateToExplore={() => {
              setSelectedCategoryFilter('All');
              setCurrentTab('opportunities');
            }}
          />
        )}

        {currentTab === 'profile' && (
          <StudentProfileView
            initialProfile={profile}
            onSaveProfile={handleSaveProfile}
            onNavigateToDashboard={() => setCurrentTab('dashboard')}
          />
        )}
      </main>

      {/* Opportunity Detail Modal View */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          match={matchesMap.get(selectedOpportunity.id) || calculateMatchScore(selectedOpportunity, profile)}
          isSaved={savedItems.some(s => s.opportunityId === selectedOpportunity.id)}
          savedStatus={savedItems.find(s => s.opportunityId === selectedOpportunity.id)?.status || 'Saved'}
          onClose={() => setSelectedOpportunity(null)}
          onToggleSave={(id) => handleToggleSave(id)}
          onUpdateStatus={handleUpdateSavedStatus}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">OpportunityHub AI</span>
            <span>·</span>
            <span>Discover. Prepare. Apply.</span>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setCurrentTab('landing')} 
              className="hover:text-blue-600 transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentTab('dashboard')} 
              className="hover:text-blue-600 transition-colors"
            >
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentTab('opportunities')} 
              className="hover:text-blue-600 transition-colors"
            >
              Browse Feed
            </button>
            <button 
              onClick={() => setCurrentTab('profile')} 
              className="hover:text-blue-600 transition-colors"
            >
              Profile Settings
            </button>
          </div>

          <p className="text-slate-400">
            Student Opportunity Discovery Platform © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
