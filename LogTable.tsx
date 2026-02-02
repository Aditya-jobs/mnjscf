
import React, { useState } from 'react';
import { TaskLog } from '../types';

interface LogTableProps {
  logs: TaskLog[];
  onEdit: (log: TaskLog) => void;
  onDelete: (id: string) => void;
  onQuickComplete: (log: TaskLog) => void;
  isAdmin: boolean;
}

const LogTable: React.FC<LogTableProps> = ({ logs, onEdit, onDelete, onQuickComplete, isAdmin }) => {
  const [filter, setFilter] = useState('');

  const filteredLogs = isAdmin 
    ? (filter ? logs.filter(l => l.teamMemberName.toLowerCase().includes(filter.toLowerCase())) : logs)
    : logs; // App.tsx already filters these to just the member's logs

  return (
    <div className="space-y-4">
      {isAdmin && (
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search teammate's work..." 
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="absolute right-3 top-2.5 text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase font-black tracking-widest">
              <th className="py-4 px-3">{isAdmin ? "Teammate" : "Date"}</th>
              <th className="py-4 px-3">Accomplishments</th>
              <th className="py-4 px-3 text-right">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {filteredLogs.map(log => (
              <tr key={log.id} className="text-sm hover:bg-slate-800/10 group transition-all duration-300">
                <td className="py-5 px-3 whitespace-nowrap align-top">
                  <div className="font-bold text-slate-200">{isAdmin ? log.teamMemberName : new Date(log.timestamp).toLocaleDateString()}</div>
                  <div className="text-[10px] text-indigo-500 font-bold uppercase tracking-tighter mt-1">{log.category}</div>
                  {isAdmin && <div className="text-[9px] text-slate-600 mt-1">{new Date(log.timestamp).toLocaleDateString()}</div>}
                </td>
                <td className="py-5 px-3 align-top">
                  <div className="text-slate-400 text-sm leading-relaxed max-w-md whitespace-pre-wrap italic">
                    {log.taskDescription}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                      log.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                      log.status === 'Blocked' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {log.status}
                    </span>
                    {log.metricValue > 0 && (
                      <span className="text-[10px] text-slate-600 font-bold">Volume: {log.metricValue}</span>
                    )}
                  </div>
                </td>
                <td className="py-5 px-3 text-right align-top space-x-2">
                  {isAdmin ? (
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => onEdit(log)}
                        className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        title="Edit Update"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.242 3.242a1.5 1.5 0 112.121 2.121L12 11.212l-4.438.75.75-4.438 6.93-6.93z" /></svg>
                      </button>
                      <button 
                        onClick={() => onDelete(log.id)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Update"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ) : (
                    log.status !== 'Completed' && (
                      <button 
                        onClick={() => onQuickComplete(log)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-tighter"
                      >
                        Success Mark
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <div className="py-20 text-center text-slate-600 text-sm font-medium">
            <div className="text-4xl mb-4">💤</div>
            No work recorded in this segment.
          </div>
        )}
      </div>
    </div>
  );
};

export default LogTable;
