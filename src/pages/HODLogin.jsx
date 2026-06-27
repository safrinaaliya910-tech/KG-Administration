import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HODLogin = () => {
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
    }
  }, [userData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] overflow-hidden font-sans relative">
      
      {/* Dynamic Background Elements for Visual Depth */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12 px-6">
        
        {/* LEFT SIDE: Institutional Branding */}
        <div className="hidden lg:flex flex-col lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md w-fit">
            <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-200/70">Departmental Authority</span>
          </div>
          
          <h1 className="text-6xl font-black text-white leading-[1.1] tracking-tighter">
            Academic <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">Excellence</span> <br /> 
            Defined.
          </h1>
          
          <p className="text-slate-400 text-lg font-light leading-relaxed max-w-md">
            The secure gateway for Department Heads to orchestrate faculty operations and departmental workflows with precision.
          </p>

          <div className="flex items-center gap-6 pt-4">
             <div className="h-[1px] w-24 bg-gradient-to-r from-blue-500 to-transparent" />
             <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Secure Protocol v7.3</span>
          </div>
        </div>

        {/* RIGHT SIDE: Elegant Glass Card */}
        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 lg:p-14 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] flex flex-col items-center">
            
            <div className="mb-10 text-center">
              <div className="inline-block p-4 rounded-3xl bg-blue-500/10 border border-blue-400/20 text-blue-400 mb-6 shadow-2xl shadow-blue-500/20">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-white">HOD Login</h2>
              <p className="text-slate-400 text-sm mt-2">Authentication required for access.</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
              {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3 animate-in slide-in-from-top-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="group">
                  <input
                    type="email"
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 text-white placeholder-slate-500"
                    placeholder="Institutional Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="group">
                  <input
                    type="password"
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 text-white placeholder-slate-500"
                    placeholder="Access Key"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 group overflow-hidden relative"
              >
                <span className="relative z-10">{loading ? "Verifying..." : "Authorize Login"}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 w-full flex flex-col items-center gap-6">
              <Link to="/" className="text-slate-500 hover:text-blue-400 font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Switch Access Role
              </Link>
              
              <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center mb-1">Root Credentials</p>
                 <p className="text-[11px] text-slate-400 font-mono">hod@department.com <span className="mx-1 opacity-30">|</span> hod123456</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HODLogin;