import { useState } from 'react';
import { setupPredefinedUsers } from '../utils/setupUsers';

const SetupUsers = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSetup = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await setupPredefinedUsers();
      setMessage('Users setup complete! Existing users were skipped. You can now login with the predefined credentials.');
    } catch (err) {
      setError(err.message || 'Failed to create users. Check browser console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // FULL SCREEN ICE-BLUE BACKGROUND: Absolute edge-to-edge coverage
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#f0f7ff] overflow-hidden font-sans">
      
      {/* --- AMBIENT BLUE PULSES --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-400/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-300/10 blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6 animate-in fade-in zoom-in-95 duration-700">
        
        {/* --- ELEGANT FLOATING CARD --- */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(30,64,175,0.12)] border border-white p-12 md:p-16 relative group">
          
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 leading-tight">
              Setup Predefined Users
            </h2>
            <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">System Initialization</p>
          </div>

          {/* CREDENTIALS INFO BOX */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-[2rem] p-6 mb-8 relative group/info overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Target Credentials:</p>
            <ul className="text-xs text-slate-600 font-bold space-y-2">
              <li className="flex justify-between"><span>HOD:</span> <span className="font-mono text-blue-600">hod@department.com</span></li>
              <li className="flex justify-between"><span>Faculty 1:</span> <span className="font-mono text-blue-600">faculty1@department.com</span></li>
              <li className="flex justify-between"><span>Faculty 2:</span> <span className="font-mono text-blue-600">faculty2@department.com</span></li>
              <li className="flex justify-between"><span>Faculty 3:</span> <span className="font-mono text-blue-600">faculty3@department.com</span></li>
            </ul>
          </div>

          {/* MESSAGE DISPLAYS */}
          {message && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest text-center animate-in slide-in-from-top-2">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest text-center animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* ACTION BUTTON */}
          <div className="space-y-6">
            <button
              onClick={handleSetup}
              disabled={loading}
              className="relative overflow-hidden w-full py-5 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
              {loading ? 'Creating users...' : 'Create Predefined Users'}
            </button>

            <p className="text-center">
              <a href="/" className="text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Login
              </a>
            </p>
          </div>

          {/* Footer Branding */}
          <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-center gap-4 text-slate-300">
            <div className="w-8 h-[1px] bg-slate-100"></div>
            <span className="text-[8px] font-black uppercase tracking-[0.4em]">Auth Protocol V1.0</span>
            <div className="w-8 h-[1px] bg-slate-100"></div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}} />
    </div>
  );
};

export default SetupUsers;