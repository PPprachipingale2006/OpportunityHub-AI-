import React from 'react';
import { 
  Compass, 
  UserPlus, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Bookmark, 
  Search,
  ShieldCheck,
  Zap,
  Target,
  SlidersHorizontal,
  Flame,
  LogIn
} from 'lucide-react';
import { OpportunityCategory, Opportunity } from '../types';
import { SAMPLE_OPPORTUNITIES } from '../data/opportunities';

interface LandingPageProps {
  onExplore: (category?: OpportunityCategory) => void;
  onCreateProfile: () => void;
  onNavigateLogin?: () => void;
  onViewDetails?: (opp: Opportunity) => void;
  opportunities?: Opportunity[];
}

const CATEGORIES: { 
  type: OpportunityCategory; 
  icon: string; 
  title: string; 
  count: string; 
  description: string;
  gradient: string;
}[] = [
  {
    type: 'Internship',
    icon: '💼',
    title: 'Internships',
    count: '100+ Openings',
    description: 'High-growth tech, data, and design roles at startups and tier-one enterprises.',
    gradient: 'from-blue-500/10 to-indigo-500/10'
  },
  {
    type: 'Hackathon',
    icon: '🏆',
    title: 'Hackathons',
    count: '50+ Competitions',
    description: 'National and global 24–48h hackathons with cash prizes, mentorship, and PPIs.',
    gradient: 'from-purple-500/10 to-pink-500/10'
  },
  {
    type: 'Scholarship',
    icon: '🎓',
    title: 'Scholarships',
    count: '40+ Grants',
    description: 'Merit-based, diversity, and university grants supporting your STEM degree.',
    gradient: 'from-emerald-500/10 to-teal-500/10'
  },
  {
    type: 'Course',
    icon: '📚',
    title: 'Courses',
    count: '25+ Courses',
    description: 'Certified curriculum from Harvard, University of Helsinki, Google & DeepLearning.AI.',
    gradient: 'from-amber-500/10 to-orange-500/10'
  },
  {
    type: 'Competition',
    icon: '🏅',
    title: 'Competitions',
    count: '35+ Challenges',
    description: 'Kaggle challenges, case studies, and algorithmic contests to showcase your genius.',
    gradient: 'from-rose-500/10 to-red-500/10'
  },
  {
    type: 'Workshop',
    icon: '🛠',
    title: 'Workshops',
    count: '20+ Live Labs',
    description: 'Hands-on practical bootcamps on Kubernetes, Figma, OWASP, and AI agents.',
    gradient: 'from-indigo-500/10 to-violet-500/10'
  },
  {
    type: 'Certification',
    icon: '📜',
    title: 'Certifications',
    count: '15+ Vouchers',
    description: 'Industry-accredited vouchers for AWS, Oracle, Meta, and NVIDIA DLI.',
    gradient: 'from-cyan-500/10 to-blue-500/10'
  }
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Create Your Profile',
    desc: 'Enter your university, branch, year of study, and technical background.',
    icon: UserPlus
  },
  {
    step: '02',
    title: 'Select Skills & Interests',
    desc: 'Pick your technical skills (Python, React, AI, SQL) and target career interests.',
    icon: SlidersHorizontal
  },
  {
    step: '03',
    title: 'Discover Relevant Opportunities',
    desc: 'Our transparent 100-point matching algorithm surfaces high-fit openings instantly.',
    icon: Target
  },
  {
    step: '04',
    title: 'Save and Apply',
    desc: 'Track deadlines, review preparation skill gaps, and apply directly to official portals.',
    icon: Bookmark
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onExplore,
  onCreateProfile,
  onNavigateLogin,
  onViewDetails,
  opportunities = SAMPLE_OPPORTUNITIES
}) => {
  const hackathonOpp = opportunities.find(o => o.id === 'opp-1') || SAMPLE_OPPORTUNITIES[0];
  const internOpp = opportunities.find(o => o.id === 'opp-2') || SAMPLE_OPPORTUNITIES[1];

  const handleCardClick = (opp: Opportunity) => {
    if (onViewDetails) {
      onViewDetails(opp);
    } else {
      onExplore(opp.category);
    }
  };
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-16 pb-8 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-300/30 to-purple-300/30 blur-3xl pointer-events-none rounded-full -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Subtle Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Discover · Prepare · Apply</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-normal">Student Opportunity Discovery Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Never Miss Your <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Next Opportunity</span>.
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover internships, hackathons, scholarships, courses and competitions personalized to your skills and interests.
          </p>

          {/* CTA Buttons with Highly Visible Login */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onExplore()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Compass className="w-4 h-4 transition-transform group-hover:rotate-45" />
              <span>Explore Opportunities</span>
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={onCreateProfile}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span>Create My Profile</span>
            </button>
            {onNavigateLogin && (
              <button
                onClick={onNavigateLogin}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-800 font-extrabold text-sm border border-indigo-200 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-indigo-600" />
                <span>Student Login / Demo</span>
              </button>
            )}
          </div>

          {/* Visually Attractive Interactive Mockup Illustration */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-6 text-left relative overflow-hidden">
              {/* Fake Mockup Window Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  <span className="text-xs text-slate-400 font-mono ml-2">opportunityhub.ai/feed</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Personalized 96% Match Active</span>
                </div>
              </div>

              {/* Sample Opportunity Card Previews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => handleCardClick(hackathonOpp)}
                  className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      🏆 Hackathon
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      96% Match
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {hackathonOpp.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {hackathonOpp.organization} · {hackathonOpp.location}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-rose-600" /> Deadline in 3 days
                    </span>
                    <span className="font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-0.5">
                      View Details →
                    </span>
                  </div>
                </div>

                <div 
                  onClick={() => handleCardClick(internOpp)}
                  className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      💼 Internship
                    </span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      92% Match
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {internOpp.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {internOpp.organization} · {internOpp.stipendOrPrize}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {internOpp.mode} · {internOpp.location}
                    </span>
                    <span className="font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-0.5">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics Section (Clearly labelled as platform/demo metrics) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Curated Opportunities Across Top Ecosystems
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Aggregated in real-time from premier engineering, open source, and scholarship initiatives.
              </p>
            </div>
            <span className="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded bg-slate-800 text-slate-400 font-semibold border border-slate-700 self-start md:self-auto">
              Platform Demo Statistics
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-400">500+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">Total Opportunities</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-400">50+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">Active Hackathons</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">100+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">Tech Internships</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">25+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">Elite Courses & Labs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunity Categories Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Discover by Opportunity Category
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Filter high-yield student avenues with a single click. Everything you need to advance your career.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.type}
              onClick={() => onExplore(cat.type)}
              className="group p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                    {cat.count}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                <span>Browse {cat.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            How OpportunityHub AI Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            No more browsing 20 different websites, WhatsApp groups, or Discord servers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step} 
                className="p-5 rounded-2xl border border-slate-200 bg-white relative hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-200">
                    {item.step}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-12 text-center text-white shadow-xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Ready to Accelerate Your Student Journey?
          </h2>
          <p className="text-blue-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Create your profile in 60 seconds and instantly discover high-match internships, hackathons, and scholarships.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onExplore()}
              className="px-8 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Start Discovering Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {onNavigateLogin && (
              <button
                onClick={onNavigateLogin}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 backdrop-blur-xs transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In with Demo</span>
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
