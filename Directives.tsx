
import React, { useState } from 'react';
import { Assignment, User, TEAM_MEMBERS } from '../types';

interface DirectivesProps {
  isAdmin: boolean;
  currentUser: User;
  assignments: Assignment[];
  onSave: (a: Assignment) => void;
  onDelete: (id: string) => void;
}

const Directives: React.FC<DirectivesProps> = ({ isAdmin, currentUser, assignments, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    targetUserId: TEAM_MEMBERS[0].id,
    title: '',
    description: '',
    priority: 'Medium' as Assignment['priority']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const target = TEAM_MEMBERS.find(m => m.id === formData.targetUserId);
    
    const newAssignment: Assignment = {
      id: Math.random().toString(36).substr(2, 9),
      adminId: currentUser.id,
      targetUserId: formData.targetUserId,
      targetUserName: target?.name || 'Unknown',
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };

    onSave(newAssignment);
    setFormData({ ...formData, title: '', description: '' });
  };

  const updateStatus = (a: Assignment, status: Assignment['status']) => {
    onSave({ ...a, status });
  };

  return (
    <div className="space-y-10">
      {isAdmin && (
        <div className="bg-slate-900/60 border border-indigo-500/20 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <span className="text-indigo-500">◈</span> DISPATCH NEW DIRECTIVE
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Assign To Teammate</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-600 outline-none"
                  value={formData.targetUserId}
                  onChange={e => setFormData({...formData, targetUserId: e.target.value})}
                >
                  {TEAM_MEMBERS.filter(m => m.role !== 'admin').map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.category})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Task Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Weekly Blog Draft"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-600 outline-none"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Priority Level</label>
                <div className="flex gap-2">
                  {(['Low', 'Medium', 'High', 'CRITICAL'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({...formData, priority: p})}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all border ${
                        formData.priority === p 
                        ? 'bg-indigo-600 border-indigo-400 text-white' 
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Instructions / Details</label>
                <textarea 
                  rows={6}
                  placeholder="Be specific. What do you need them to do and by when?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl shadow-lg shadow-indigo-900/40 transition-all active:scale-95 uppercase tracking-widest"
              >
                Send Order
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          {isAdmin ? "ALL ACTIVE DIRECTIVES" : "MY ACTIVE ORDERS"}
          <span className="text-xs bg-indigo-600/20 text-indigo-400 px-2 py-0.5 rounded-full">{assignments.length}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {assignments.map(a => (
            <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-16 h-16 opacity-5 flex items-center justify-center text-4xl`}>
                {a.priority === 'CRITICAL' ? '🔥' : '📋'}
              </div>
              
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${
                  a.priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                  a.priority === 'High' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {a.priority} Priority
                </span>
                <span className="text-[9px] text-slate-600 font-bold">{new Date(a.timestamp).toLocaleDateString()}</span>
              </div>

              <h4 className="text-lg font-bold text-white mb-2">{a.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 italic">"{a.description}"</p>

              <div className="flex flex-col gap-4 pt-4 border-t border-slate-800/50">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {isAdmin ? `Assigned to: ${a.targetUserName}` : "Status"}
                  </span>
                  <span className={`text-[10px] font-black uppercase ${
                    a.status === 'Done' ? 'text-emerald-500' : 'text-indigo-400'
                  }`}>{a.status}</span>
                </div>

                {!isAdmin ? (
                  <div className="flex gap-2">
                    {a.status === 'Pending' && (
                      <button onClick={() => updateStatus(a, 'Acknowledged')} className="flex-1 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white text-[10px] font-black py-2 rounded-lg border border-indigo-500/20 transition-all">ACKNOWLEDGE</button>
                    )}
                    {a.status === 'Acknowledged' && (
                      <button onClick={() => updateStatus(a, 'In Progress')} className="flex-1 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white text-[10px] font-black py-2 rounded-lg border border-amber-500/20 transition-all">START WORK</button>
                    )}
                    {(a.status === 'In Progress' || a.status === 'Acknowledged') && (
                      <button onClick={() => updateStatus(a, 'Done')} className="flex-1 bg-emerald-500/10 hover:bg-emerald-600 text-emerald-500 hover:text-white text-[10px] font-black py-2 rounded-lg border border-emerald-500/20 transition-all">MARK COMPLETE</button>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onDelete(a.id)} className="text-rose-500 hover:text-rose-400 text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">RECALL ORDER</button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {assignments.length === 0 && (
            <div className="col-span-full py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600 italic">
              <span className="text-4xl mb-4">🛸</span>
              No active directives found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Directives;
