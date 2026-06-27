import { Link } from "react-router-dom";

const Register = () => {
  return (
    // FULL SCREEN ICE-BLUE BACKGROUND: Ensures absolute edge-to-edge coverage
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#f0f7ff] overflow-hidden font-sans">
      
      {/* --- AMBIENT BLUE PULSES --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-400/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-300/10 blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6 animate-in fade-in zoom-in-95 duration-700">
        
        {/* --- ELEGANT FLOATING CARD --- */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(30,64,175,0.12)] border border-white p-12 md:p-16 relative group">
          
          {/* Logo/Icon Header */}
          <div className="text-center mb-10">
            <div className="mx-auto w-20 h-20 rounded-[2rem] bg-blue-50 flex items-center justify-center text-blue-600 mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">
              Registration <br/> <span className="text-blue-600">Disabled</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em] px-4">
              Restricted to <span className="text-slate-600 font-black">predefined members</span> only.
            </p>
          </div>

          {/* INFORMATION BOX */}
          <div className="relative overflow-hidden bg-amber-50/50 border border-amber-100 p-8 rounded-[2.5rem] mb-12 text-center group/info">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 group-hover/info:scale-y-110 transition-transform" />
            <p className="text-amber-800 text-sm font-bold leading-relaxed">
              Accounts are created by the <span className="font-black text-amber-900 uppercase tracking-tighter">Admin (HOD)</span>.
            </p>
            <p className="text-amber-700/60 text-xs font-medium mt-2">
              Please contact your department administrator for access credentials.
            </p>
          </div>

          {/* ACTION SECTION */}
          <div className="text-center">
            <Link
              to="/login"
              className="relative group inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 active:scale-95 transition-all overflow-hidden"
            >
              {/* SHINING BUTTON EFFECT */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go to Login
            </Link>
          </div>

          {/* Footer Decoration */}
          <div className="mt-12 flex items-center justify-center gap-4 text-slate-300">
            <div className="w-8 h-[1px] bg-slate-200"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Secure Protocol V7.3</span>
            <div className="w-8 h-[1px] bg-slate-200"></div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}} />
    </div>
  );
};

export default Register;