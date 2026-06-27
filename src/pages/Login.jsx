import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-[#0f172a] overflow-hidden font-sans">
      
      {/* --- ENHANCED DYNAMIC GRADIENT BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[130px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[130px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[110px]" />
      </div>

      {/* Main Container with reduced vertical padding to prevent scrolling */}
      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col items-center justify-between py-4 h-full max-h-[900px]">
        
        {/* --- HEADER SECTION: Scaled down slightly --- */}
        <div className="text-center mt-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-slate-700 bg-slate-900/80 backdrop-blur-md mb-4">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 opacity-60" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">Institutional Management System</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-2">
            Department Task <span className="relative inline-block px-3 py-0.5 ml-2 rounded-xl bg-slate-800 border border-slate-700 text-blue-400 shadow-2xl">Hub</span>
          </h1>
          
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-light leading-snug">
            A unified digital ecosystem designed for seamless academic coordination.
          </p>
        </div>

        {/* --- SELECTION CARDS: Compact spacing --- */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full mx-auto my-4">
          
          {/* HOD PORTAL CARD */}
          <Link to="/login/hod" className="group relative">
            <div className="relative h-full overflow-hidden bg-slate-100/95 backdrop-blur-sm rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] flex flex-col items-center text-center border border-white/20">
              
              <div className="w-20 h-20 rounded-2xl bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-lg">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>

              <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">HOD Portal</h2>
              <p className="text-slate-600 text-xs leading-relaxed mb-8 font-medium px-4">
                Administrative control and departmental oversight for Department Heads.
              </p>
              
              <div className="mt-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border-2 border-blue-600/30 text-blue-700 font-black text-[10px] uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                SECURE ACCESS <span>→</span>
              </div>
            </div>
          </Link>

          {/* FACULTY PORTAL CARD */}
          <Link to="/login/faculty" className="group relative">
            <div className="relative h-full overflow-hidden bg-slate-100/95 backdrop-blur-sm rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] flex flex-col items-center text-center border border-white/20">
              
              <div className="w-20 h-20 rounded-2xl bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-lg">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>

              <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Faculty Portal</h2>
              <p className="text-slate-600 text-xs leading-relaxed mb-8 font-medium px-4">
                Personal workspace for faculty members to track tasks and scores.
              </p>
              
              <div className="mt-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border-2 border-emerald-600/30 text-emerald-700 font-black text-[10px] uppercase tracking-widest group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300">
                MEMBER ACCESS <span>→</span>
              </div>
            </div>
          </Link>

        </div>

        {/* --- HIGH VISIBILITY NAV ACTIONS: Positioned at bottom --- */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-8 p-2.5 px-8 rounded-full bg-blue-500/10 border border-blue-400/30 backdrop-blur-md shadow-lg">
            <Link to="/register" className="text-[11px] font-black text-blue-100 hover:text-blue-400 uppercase tracking-[0.3em] transition-all">Request Registration</Link>
            <div className="w-1 h-1 rounded-full bg-blue-400/50" />
            <Link to="/setup" className="text-[11px] font-black text-blue-100 hover:text-blue-400 uppercase tracking-[0.3em] transition-all">Admin Setup</Link>
          </div>
          <p className="mt-4 text-[9px] text-slate-400 font-bold tracking-[0.5em] uppercase">© 2026 University Departmental Services</p>
        </div>

      </div>
    </div>
  );
};

export default Login;