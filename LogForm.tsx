
import React, { useState, useEffect } from 'react';
import { TaskLog, User, TEAM_MEMBERS, Category } from '../types';

interface LogFormProps {
  currentUser: User;
  onSubmit: (log: TaskLog) => void;
  editData: TaskLog | null;
  onCancelEdit: () => void;
}

const LogForm: React.FC<LogFormProps> = ({ currentUser, onSubmit, editData, onCancelEdit }) => {
  const isAdmin = currentUser.role === 'admin';
  
  const [formData, setFormData] = useState({
    category: currentUser.category as Category,
    memberId: currentUser.id,
    memberName: currentUser.name,
    description: '',
    status: 'Completed' as TaskLog['status'],
    metric: 0,
    comments: ''
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        category: editData.category,
        memberId: editData.teamMemberId,
        memberName: editData.teamMemberName,
        description: editData.taskDescription,
        status: editData.status,
        metric: editData.metricValue,
        comments: editData.comments || ''
      });
    } else {
      setFormData(prev => ({
        ...prev,
        category: currentUser.category === 'Admin' ? 'Telecalling' : currentUser.category,
        memberId: currentUser.id,
        memberName: currentUser.name,
        description: '',
        metric: 0,
        comments: ''
      }));
    }
  }, [editData, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description) return;

    const log: TaskLog = {
      id: editData?.id || Math.random().toString(36).substr(2, 9),
      timestamp: editData?.timestamp || new Date().toISOString(),
      category: formData.category,
      teamMemberId: formData.memberId,
      teamMemberName: formData.memberName,
      taskDescription: formData.description,
      status: formData.status,
      metricValue: formData.metric,
      comments: formData.comments
    };

    onSubmit(log);
  };

  const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all";
  const labelClass = "block text-sm font-medium text-slate-500 mb-1 uppercase tracking-tighter";

  return (
    <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 h-fit">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">
          {editData ? 'Update Record' : (isAdmin ? 'Admin: Log Activity' : 'Share Work Update')}
        </h3>
        {editData && (
          <button onClick={onCancelEdit} className="text-xs text-rose-400 hover:text-rose-300 font-bold">Cancel</button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isAdmin && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Department</label>
              <select className={inputClass} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as Category })}>
                <option>Telecalling</option>
                <option>Web Development</option>
                <option>Blogs</option>
                <option>Social Media</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Member</label>
              <select className={inputClass} value={formData.memberId} onChange={e => {
                const u = TEAM_MEMBERS.find(tm => tm.id === e.target.value);
                if (u) setFormData({ ...formData, memberId: u.id, memberName: u.name });
              }}>
                {TEAM_MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>
        )}

        {!isAdmin && (
          <div className="bg-indigo-600/10 p-3 rounded-lg border border-indigo-500/20 mb-4">
            <p className="text-xs text-indigo-400 font-medium">Logged in as {currentUser.name} ({currentUser.category})</p>
          </div>
        )}

        <div>
          <label className={labelClass}>{isAdmin ? 'Description' : 'What have you done today?'}</label>
          <textarea 
            className={inputClass} 
            rows={isAdmin ? 3 : 5} 
            value={formData.description} 
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder={isAdmin ? "Task details..." : "I have done this, this, this, and this..."}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Status</label>
            <select className={inputClass} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as TaskLog['status'] })}>
              <option value="Completed">Completed Successfully</option>
              <option value="In Progress">Still Working</option>
              <option value="Blocked">Blocked / Waiting</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{isAdmin ? 'Metric Value' : 'Quantity (e.g. 5 calls)'}</label>
            <input type="number" className={inputClass} value={formData.metric} onChange={e => setFormData({ ...formData, metric: Number(e.target.value) })} />
          </div>
        </div>

        {!isAdmin && (
          <div>
            <label className={labelClass}>Additional Comments</label>
            <input 
              type="text" 
              className={inputClass} 
              value={formData.comments} 
              onChange={e => setFormData({ ...formData, comments: e.target.value })}
              placeholder="Any issues or notes?"
            />
          </div>
        )}

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95">
          {editData ? 'Update Entry' : (isAdmin ? 'Save Admin Entry' : 'Submit My Update')}
        </button>
      </form>
    </div>
  );
};

export default LogForm;
