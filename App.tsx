
import React, { useState, useEffect } from 'react';
import { View, TaskLog, AnalysisResult, User, TEAM_MEMBERS, ChatMessage, Assignment } from './types';
import LogForm from './components/LogForm';
import LogTable from './components/LogTable';
import Dashboard from './components/Dashboard';
import GASConfig from './components/GASConfig';
import Login from './components/Login';
import Chat from './components/Chat';
import Directives from './components/Directives';
import { analyzeTeamPerformance } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [editingLog, setEditingLog] = useState<TaskLog | null>(null);

  useEffect(() => {
    const savedLogs = localStorage.getItem('mnj_scf_logs_v5');
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    
    const savedAssignments = localStorage.getItem('mnj_scf_assignments_v1');
    if (savedAssignments) setAssignments(JSON.parse(savedAssignments));

    const savedUser = localStorage.getItem('mnj_scf_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedChat = localStorage.getItem('mnj_scf_chat');
    if (savedChat) setChatMessages(JSON.parse(savedChat));
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('mnj_scf_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mnj_scf_user');
  };

  const handleSaveLog = (log: TaskLog) => {
    let updatedLogs;
    const existingIndex = logs.findIndex(l => l.id === log.id);
    if (existingIndex > -1) {
      updatedLogs = [...logs];
      updatedLogs[existingIndex] = log;
    } else {
      updatedLogs = [log, ...logs];
    }
    setLogs(updatedLogs);
    localStorage.setItem('mnj_scf_logs_v5', JSON.stringify(updatedLogs));
    setEditingLog(null);
  };

  const handleDeleteLog = (id: string) => {
    if (user?.role !== 'admin') return;
    const updatedLogs = logs.filter(l => l.id !== id);
    setLogs(updatedLogs);
    localStorage.setItem('mnj_scf_logs_v5', JSON.stringify(updatedLogs));
  };

  const handleSaveAssignment = (assignment: Assignment) => {
    let updated;
    const idx = assignments.findIndex(a => a.id === assignment.id);
    if (idx > -1) {
      updated = [...assignments];
      updated[idx] = assignment;
    } else {
      updated = [assignment, ...assignments];
    }
    setAssignments(updated);
    localStorage.setItem('mnj_scf_assignments_v1', JSON.stringify(updated));
  };

  const handleDeleteAssignment = (id: string) => {
    const updated = assignments.filter(a => a.id !== id);
    setAssignments(updated);
    localStorage.setItem('mnj_scf_assignments_v1', JSON.stringify(updated));
  };

  const handleSendMessage = (text: string) => {
    if (!user) return;
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      text,
      timestamp: new Date().toISOString(),
    };
    const updatedChat = [...chatMessages, newMessage].slice(-50);
    setChatMessages(updatedChat);
    localStorage.setItem('mnj_scf_chat', JSON.stringify(updatedChat));
  };

  const handleAnalyze = async () => {
    const relevantLogs = user?.role === 'admin' ? logs : logs.filter(l => l.teamMemberId === user?.id);
    if (relevantLogs.length === 0) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeTeamPerformance(relevantLogs.slice(0, 15));
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!user) return <Login onLogin={handleLogin} />;

  const isAdmin = user.role === 'admin';
  const visibleLogs = isAdmin ? logs : logs.filter(l => l.teamMemberId === user.id);
  const visibleAssignments = isAdmin ? assignments : assignments.filter(a => a.targetUserId === user.id);

  const NavItem: React.FC<{ id: View; label: string; icon: string }> = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveView(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all w-full text-left ${
        activeView === id 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-black text-[10px] uppercase tracking-[0.1em]">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-6 space-y-8 sticky top-0 h-fit md:h-screen z-10 flex flex-col">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-black text-white leading-none">MNJ COMMAND</h1>
            <span className="text-[8px] text-indigo-400 font-black uppercase tracking-[0.3em]">Central Ops</span>
          </div>
        </div>

        <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
          <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Current User</p>
          <p className="text-sm font-black text-white">{user.name}</p>
          <p className="text-[10px] text-indigo-500 font-bold uppercase">{isAdmin ? "Super Admin" : user.category}</p>
        </div>

        <nav className="flex flex-col space-y-2 flex-grow">
          <NavItem id="dashboard" label="Intelligence" icon="📉" />
          <NavItem id="directives" label={isAdmin ? "Assign Work" : "My Orders"} icon="🎯" />
          <NavItem id="logs" label="Work History" icon="📂" />
          <NavItem id="chat" label="Messenger" icon="💬" />
          {isAdmin && <NavItem id="gas-config" label="Systems" icon="⚙️" />}
        </nav>

        <div className="space-y-3 pt-6 border-t border-slate-800">
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? <div className="animate-spin rounded-full h-3 w-3 border-2 border-indigo-500 border-t-transparent" /> : "Run AI Audit"}
          </button>
          <button onClick={handleLogout} className="w-full text-[9px] uppercase font-black text-slate-600 hover:text-rose-500 transition-colors">Terminate Session</button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <header className="mb-10">
          <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">{activeView}</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <p className="text-slate-500 text-sm font-medium">
              {isAdmin ? "Super Admin control panel active. All department channels open." : `Personal workstation: ${user.category} Stream.`}
            </p>
          </div>
        </header>

        <div className="space-y-12 pb-20">
          {activeView === 'dashboard' && <Dashboard logs={visibleLogs} analysis={analysis} isAdmin={isAdmin} />}
          {activeView === 'chat' && <Chat messages={chatMessages} onSendMessage={handleSendMessage} currentUser={user} />}
          {activeView === 'directives' && (
            <Directives 
              isAdmin={isAdmin} 
              currentUser={user} 
              assignments={visibleAssignments} 
              onSave={handleSaveAssignment} 
              onDelete={handleDeleteAssignment} 
            />
          )}
          {activeView === 'logs' && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
              <div className="xl:col-span-2">
                <LogForm currentUser={user} onSubmit={handleSaveLog} editData={editingLog} onCancelEdit={() => setEditingLog(null)} />
              </div>
              <div className="xl:col-span-3 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 h-fit">
                <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">Work Progress Stream</h3>
                <LogTable logs={visibleLogs} onEdit={setEditingLog} onDelete={handleDeleteLog} isAdmin={isAdmin} onQuickComplete={(log) => handleSaveLog({...log, status: 'Completed'})} />
              </div>
            </div>
          )}
          {activeView === 'gas-config' && isAdmin && <GASConfig />}
        </div>
      </main>
    </div>
  );
};

export default App;
