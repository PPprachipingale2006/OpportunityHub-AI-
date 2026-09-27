import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  Trophy, 
  Target, 
  Send, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Building2, 
  TrendingUp, 
  FileText 
} from 'lucide-react';
import { Opportunity, SavedOpportunityItem, ApplicationStatus } from '../types';

interface ApplicationStatusAnalyticsProps {
  opportunities: Opportunity[];
  savedItems: SavedOpportunityItem[];
  onNavigateToSaved: () => void;
  onViewDetails: (opp: Opportunity) => void;
}

interface StatusStat {
  status: ApplicationStatus;
  label: string;
  count: number;
  color: string;
  fill: string;
  icon: React.ReactNode;
  description: string;
}

export const ApplicationStatusAnalytics: React.FC<ApplicationStatusAnalyticsProps> = ({
  opportunities,
  savedItems,
  onNavigateToSaved,
  onViewDetails
}) => {
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Group saved items by status
  const countsByStatus = useMemo(() => {
    const map: Record<ApplicationStatus, number> = {
      'Applied': 0,
      'Interviewing': 0,
      'Offered': 0,
      'In Progress': 0,
      'Completed': 0,
      'Saved': 0
    };

    for (const item of savedItems) {
      if (map[item.status] !== undefined) {
        map[item.status]++;
      } else {
        map['Saved']++;
      }
    }
    return map;
  }, [savedItems]);

  const totalSaved = savedItems.length;

  // Key focused stats: Applied, Interviewing, Offered
  const appliedCount = countsByStatus['Applied'];
  const interviewingCount = countsByStatus['Interviewing'];
  const offeredCount = countsByStatus['Offered'];
  const inProgressCount = countsByStatus['In Progress'];

  // Conversion calculations
  const totalActive = appliedCount + interviewingCount + offeredCount;
  const interviewRate = appliedCount + interviewingCount + offeredCount > 0 
    ? Math.round(((interviewingCount + offeredCount) / Math.max(1, appliedCount + interviewingCount + offeredCount)) * 100) 
    : 0;
  const offerRate = interviewingCount + offeredCount > 0 
    ? Math.round((offeredCount / Math.max(1, interviewingCount + offeredCount)) * 100) 
    : 0;

  // Chart data configuration
  const statusConfig: StatusStat[] = [
    {
      status: 'Applied',
      label: 'Applied',
      count: appliedCount,
      color: 'text-blue-600',
      fill: '#2563eb', // blue-600
      icon: <Send className="w-4 h-4 text-blue-600" />,
      description: 'Submitted to official career portals'
    },
    {
      status: 'Interviewing',
      label: 'Interviewing',
      count: interviewingCount,
      color: 'text-purple-600',
      fill: '#9333ea', // purple-600
      icon: <Target className="w-4 h-4 text-purple-600" />,
      description: 'Active coding & managerial rounds'
    },
    {
      status: 'Offered',
      label: 'Offered',
      count: offeredCount,
      color: 'text-emerald-600',
      fill: '#10b981', // emerald-500
      icon: <Trophy className="w-4 h-4 text-emerald-600" />,
      description: 'Formal offers & program selections'
    },
    {
      status: 'In Progress',
      label: 'In Progress',
      count: inProgressCount,
      color: 'text-amber-600',
      fill: '#f59e0b', // amber-500
      icon: <Clock className="w-4 h-4 text-amber-600" />,
      description: 'Preparing resume & essay drafts'
    },
    {
      status: 'Completed',
      label: 'Completed',
      count: countsByStatus['Completed'],
      color: 'text-teal-600',
      fill: '#0d9488', // teal-600
      icon: <CheckCircle2 className="w-4 h-4 text-teal-600" />,
      description: 'Concluded hackathons & courses'
    },
    {
      status: 'Saved',
      label: 'Saved',
      count: countsByStatus['Saved'],
      color: 'text-slate-500',
      fill: '#64748b', // slate-500
      icon: <FileText className="w-4 h-4 text-slate-500" />,
      description: 'Bookmarked for upcoming review'
    }
  ];

  // Data for Recharts (filter out 0-count statuses for cleaner charts, but keep at least non-zero or fallback)
  const chartData = useMemo(() => {
    const nonZero = statusConfig.filter(s => s.count > 0);
    if (nonZero.length === 0) {
      // Fallback placeholder data if user hasn't saved anything yet
      return [
        { name: 'Applied', value: 1, fill: '#2563eb', percentage: '33%' },
        { name: 'Interviewing', value: 1, fill: '#9333ea', percentage: '33%' },
        { name: 'Offered', value: 1, fill: '#10b981', percentage: '34%' }
      ];
    }
    return nonZero.map(s => ({
      name: s.label,
      value: s.count,
      fill: s.fill,
      percentage: `${Math.round((s.count / totalSaved) * 100)}%`
    }));
  }, [statusConfig, totalSaved]);

  // Bar chart funnel pipeline
  const pipelineBarData = useMemo(() => {
    return [
      { stage: 'Saved', count: countsByStatus['Saved'], fill: '#64748b' },
      { stage: 'In Progress', count: countsByStatus['In Progress'], fill: '#f59e0b' },
      { stage: 'Applied', count: countsByStatus['Applied'], fill: '#2563eb' },
      { stage: 'Interviewing', count: countsByStatus['Interviewing'], fill: '#9333ea' },
      { stage: 'Offered', count: countsByStatus['Offered'], fill: '#10b981' }
    ];
  }, [countsByStatus]);

  // Find opportunities currently in Applied, Interviewing, or Offered
  const activeOpportunities = useMemo(() => {
    return savedItems
      .filter(s => s.status === 'Interviewing' || s.status === 'Applied' || s.status === 'Offered')
      .map(saved => {
        const opp = opportunities.find(o => o.id === saved.opportunityId);
        return opp ? { opp, saved } : null;
      })
      .filter((item): item is { opp: Opportunity; saved: SavedOpportunityItem } => item !== null)
      .slice(0, 4);
  }, [savedItems, opportunities]);

  // Custom Tooltip for Recharts
  const CustomRechartsTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-slate-700/80">
          <p className="font-bold flex items-center gap-1.5">
            <span 
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: data.payload.fill || data.color }}
            />
            <span>{data.name || data.payload.stage}:</span>
            <span className="text-white font-extrabold">{data.value} Opportunity{data.value === 1 ? '' : 'ies'}</span>
          </p>
          {data.payload.percentage && (
            <p className="text-[11px] text-slate-300 mt-0.5">
              Share of saved pipeline: {data.payload.percentage}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <BarChart3 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Application Pipeline & Status Analytics
              </h2>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                {totalSaved} Tracked
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Visual distribution of your job applications, active interview rounds, and offers received.
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setChartType('donut')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                chartType === 'donut'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>Donut Chart</span>
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                chartType === 'bar'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Pipeline Stages</span>
            </button>
          </div>

          <button
            onClick={onNavigateToSaved}
            className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary 3 KPI Metric Cards: Applied, Interviewing, Offered */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Applied Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 border border-blue-100/90 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Applications Sent
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-blue-950">
                {appliedCount}
              </span>
              <span className="text-xs font-semibold text-blue-700">
                submitted
              </span>
            </div>
            <p className="text-[11px] text-blue-600/90 mt-1 font-medium">
              Applied on official company & university portals
            </p>
          </div>
        </div>

        {/* 2. Interviewing Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/60 border border-purple-100/90 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Active Interview Loops
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-purple-950">
                {interviewingCount}
              </span>
              <span className="text-xs font-semibold text-purple-700">
                in progress
              </span>
            </div>
            <p className="text-[11px] text-purple-600/90 mt-1 font-medium">
              Technical, behavioral & manager assessment rounds
            </p>
          </div>
        </div>

        {/* 3. Offered Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100/90 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Offers & Selections
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-950">
                {offeredCount}
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                received
              </span>
            </div>
            <p className="text-[11px] text-emerald-600/90 mt-1 font-medium">
              Vouchers, scholarships & internship offers secured
            </p>
          </div>
        </div>
      </div>

      {/* Main Analytics Layout: Recharts Canvas + Status List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Chart Column (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {chartType === 'donut' 
                  ? 'Status Distribution Breakdown' 
                  : 'Funnel Stage Progression'}
              </h3>
              <p className="text-xs text-slate-500">
                {chartType === 'donut' 
                  ? 'Hover over each slice to inspect percentage share' 
                  : 'Conversion volume through each application milestone'}
              </p>
            </div>

            {/* Quick Conversion Rate Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Interview Rate: {interviewRate}%</span>
            </div>
          </div>

          {/* Recharts Canvas */}
          <div className="w-full h-[260px] sm:h-[280px]">
            {chartType === 'donut' ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip content={<CustomRechartsTooltip />} />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.fill}
                        className="transition-opacity hover:opacity-85 cursor-pointer outline-none"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pipelineBarData}
                  margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="stage" 
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip content={<CustomRechartsTooltip />} />
                  <Bar 
                    dataKey="count" 
                    radius={[6, 6, 0, 0]}
                  >
                    {pipelineBarData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bottom legend row */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 border-t border-slate-200/60 text-xs">
            {statusConfig.slice(0, 4).map((s) => (
              <div key={s.status} className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.fill }} />
                <span>{s.label} ({s.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Info Column: Status Pills & Recent Highlights (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Pipeline Stage Breakdown
            </h4>

            <div className="space-y-2">
              {statusConfig.slice(0, 4).map((item) => {
                const percentage = totalSaved > 0 ? Math.round((item.count / totalSaved) * 100) : 0;
                return (
                  <div
                    key={item.status}
                    className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-slate-50 border border-slate-100">
                        {item.icon}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">{item.label}</span>
                        <p className="text-[10.5px] text-slate-500 font-medium">{item.description}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-slate-900 block">
                        {item.count}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Loop Opportunities Quick List */}
          {activeOpportunities.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Active in Pipeline</span>
                </span>
                <button
                  onClick={onNavigateToSaved}
                  className="text-blue-600 hover:text-blue-800 font-bold text-[11px] cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-1.5">
                {activeOpportunities.map(({ opp, saved }) => {
                  let badgeBg = 'bg-blue-100 text-blue-800';
                  if (saved.status === 'Interviewing') badgeBg = 'bg-purple-100 text-purple-800';
                  if (saved.status === 'Offered') badgeBg = 'bg-emerald-100 text-emerald-800';

                  return (
                    <div
                      key={opp.id}
                      onClick={() => onViewDetails(opp)}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-2 cursor-pointer text-xs"
                    >
                      <div className="truncate">
                        <span className="font-bold text-slate-900 truncate block">
                          {opp.title}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {opp.organization}
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase shrink-0 ${badgeBg}`}>
                        {saved.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
