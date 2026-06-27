import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FacultyLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, userData, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      if (userData.role === 'hod') navigate('/hod/dashboard');
      else if (userData.role === 'faculty') navigate('/faculty/dashboard');
    } else if (currentUser && !userData) {
      const timer = setTimeout(() => {
        navigate('/faculty/dashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [userData, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    // Darkened Mint Background for better contrast
    <div className="relative h-screen w-full flex items-center justify-center bg-[#dcfce7] overflow-hidden font-sans">
      
      {/* --- VIBRANT GREEN BACKGROUND PULSES --- */}
      <div className="absolute inset-0 z-0">
        {/* Darker pulses to create depth behind the white card */}
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-emerald-500/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-green-400/20 blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col lg:flex-row items-center justify-between gap-12 py-8 h-full max-h-[850px]">
        
        {/* --- LEFT PANEL: High Contrast Branding --- */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center animate-in fade-in slide-in-from-left-10 duration-1000">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border-2 border-emerald-200 bg-white shadow-md mb-8 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-800">Member Workspace</span>
          </div>
          
          <h1 className="text-6xl xl:text-8xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
            Faculty <span className="text-emerald-600">Portal</span> <br/> Hub.
          </h1>
          
          <p className="text-slate-700 text-xl max-w-lg font-bold leading-relaxed mb-12">
            The secure personal gateway for faculty members to track academic tasks, view performance, and manage ongoing submissions.
          </p>

          <div className="flex items-center gap-4 text-slate-500 font-black tracking-widest text-xs uppercase">
            <div className="w-12 h-[3px] bg-emerald-600"></div>
            Standard Protocol V4.1
          </div>
        </div>

        {/* --- RIGHT PANEL: High Visibility Card --- */}
        <div className="w-full lg:w-[480px] animate-in fade-in zoom-in-95 duration-700">
          <div className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_-15px_rgba(5,150,105,0.2)] border-4 border-white p-10 xl:p-14">
            
            <div className="text-center mb-10">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-slate-900">Faculty Login</h2>
              <p className="text-emerald-600 text-xs font-black mt-1 uppercase tracking-[0.2em]">Secure Portal Access</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-xs font-black border-2 border-red-100 uppercase tracking-widest text-center">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div className="group">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Faculty Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 focus:bg-white rounded-3xl outline-none transition-all duration-300 text-slate-900 font-bold"
                    placeholder="name@department.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="group">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 focus:bg-white rounded-3xl outline-none transition-all duration-300 text-slate-900 font-bold"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="relative overflow-hidden w-full py-5 bg-emerald-600 text-white font-black rounded-3xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-70 text-sm tracking-widest uppercase"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
                {loading ? "Authorizing..." : "Sign in to Workspace"}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t-2 border-slate-50 flex flex-col items-center gap-6">
              <Link to="/" className="text-emerald-700 hover:text-emerald-900 font-black text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Selection
              </Link>
              
              <div className="px-6 py-3 bg-emerald-50 rounded-2xl border-2 border-emerald-100 text-center w-full">
                 <p className="text-[9px] text-emerald-800 font-black uppercase tracking-widest mb-1 opacity-60">Credentials</p>
                 <p className="text-[10px] text-emerald-900 font-mono font-bold">faculty1@department.com | faculty123</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}} />
    </div>
  );
};

export default FacultyLogin;