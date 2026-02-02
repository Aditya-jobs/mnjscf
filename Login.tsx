
import React, { useState } from 'react';
import { User, TEAM_MEMBERS } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = TEAM_MEMBERS.find(u => u.id === userId.toLowerCase());
    
    if (foundUser && foundUser.password === password) {
      onLogin(foundUser);
    } else {
      setError('Invalid ID or Password. Check credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-900/40">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">MNJ & SCF Team</h1>
          <p className="text-slate-400 mt-2">Workspace Secure Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">User ID</label>
            <input 
              type="text" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-600"
              placeholder="e.g. vishakha, me"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-600"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 py-2 px-3 rounded-lg flex items-center space-x-2">
              <span className="text-rose-500 text-sm font-medium">{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-900/30 active:scale-[0.98]"
          >
            Access Workspace
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 relative z-10">
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors w-full text-center font-medium"
          >
            {showHelp ? "Hide Credentials Help" : "Forgot your ID or Password?"}
          </button>
          
          {showHelp && (
            <div className="mt-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800 text-[10px] space-y-2">
              <p className="text-slate-500 font-bold uppercase mb-2">Team Directory:</p>
              <div className="grid grid-cols-2 gap-2">
                {TEAM_MEMBERS.map(member => (
                  <div key={member.id} className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-indigo-400 font-bold">{member.name}:</span>
                    <div className="text-slate-500">ID: {member.id}</div>
                    <div className="text-slate-500">PW: {member.password}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
