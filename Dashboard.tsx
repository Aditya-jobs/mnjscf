
import React from 'react';
import { TaskLog, AnalysisResult } from '../types';

interface DashboardProps {
  logs: TaskLog[];
  analysis: AnalysisResult | null;
  isAdmin: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ logs, analysis, isAdmin }) => {
  const totalTasks = logs.length;
  const completed = logs.filter(l => l.status === 'Completed').length;
  const blocked = logs.filter(l => l.status === 'Blocked').length;
  
  // Calculate activity trend (Last 7 days)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const dayLabels = getLast7Days();
  const trendData = dayLabels.map(day => ({
    day: day.split('-').slice(1).join('/'),
    count: logs.filter(l => l.timestamp.startsWith(day)).length
  }));

  const maxCount = Math.max(...trendData.map(d => d.count), 5);

  // Category distribution
  const categoryStats = logs.reduce((acc, log) => {
    acc[log.category] = (acc[log.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label={isAdmin ? "Total Team updates" : "My Total Updates"} value={totalTasks} color="indigo" />
        <StatCard label="Success Mark" value={completed} color="emerald" suffix=" Done" />
        <StatCard label="Pending" value={totalTasks - completed} color="amber" />
        <StatCard label="Blocked" value={blocked} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Graph Area */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              {isAdmin ? "Team Activity Trend (Last 7 Days)" : "My Daily Progress"}
            </h3>
          </div>
          
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {trendData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div className="w-full relative flex flex-col items-center">
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 text-white text-[10px] px-2 py-1 rounded font-bold">
                    {d.count} entries
                  </div>
                  <div 
                    className="w-full max-w-[40px] bg-indigo-600/20 border-t-2 border-indigo-500 rounded-t-lg transition-all duration-1000 ease-out"
                    style={{ height: `${(d.count / maxCount) * 150}px` }}
                  >
                    <div className="w-full h-full bg-gradient-to-t from-transparent to-indigo-500/30"></div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 mt-2 font-bold">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution / Side Stats */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-white mb-6">Work Distribution</h3>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([cat, count]) => (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">{cat}</span>
                  <span className="text-white">{count}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-1000"
                    style={{ width: `${(count / totalTasks) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {Object.keys(categoryStats).length === 0 && (
              <p className="text-xs text-slate-500 text-center py-8 italic">No data to display</p>
            )}
          </div>
        </div>
      </div>

      {isAdmin && analysis && (
        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-4xl opacity-10 group-hover:scale-110 transition-transform">🤖</div>
          <h3 className="text-xl font-black text-white mb-4 tracking-tight flex items-center gap-2">
            SUPER ADMIN INSIGHTS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="md:col-span-2">
              <p className="text-slate-300 leading-relaxed text-sm italic">"{analysis.summary}"</p>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-indigo-500/10">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Priority Advice</p>
                <ul className="text-xs text-slate-400 space-y-2">
                  {analysis.recommendations.slice(0, 2).map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-indigo-500">→</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color, suffix = "" }: { label: string, value: number, color: string, suffix?: string }) => {
  const colors: any = {
    indigo: "border-indigo-500/20 text-indigo-400 bg-indigo-500/5",
    emerald: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5",
    amber: "border-amber-500/20 text-amber-400 bg-amber-500/5",
    rose: "border-rose-500/20 text-rose-400 bg-rose-500/5",
  };
  return (
    <div className={`p-6 rounded-3xl border ${colors[color]} transition-transform hover:-translate-y-1`}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">{label}</p>
      <p className="text-4xl font-black font-mono">{value}{suffix}</p>
    </div>
  );
};

export default Dashboard;
