import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // THEME LOGIC: Detect role to set Blue (HOD) or Green (Faculty)
  const isFaculty = userData?.role === 'faculty' || location.pathname.includes('faculty');
  
  // Theme Variables
  const theme = {
    bg: isFaculty ? "#f0fff4" : "#f0f7ff", // Mint Green vs Ice Blue
    primary: isFaculty ? "emerald" : "blue",
    text: isFaculty ? "text-emerald-600" : "text-blue-600",
    border: isFaculty ? "border-emerald-50" : "border-blue-50",
    button: isFaculty ? "bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700" : "bg-blue-600 shadow-blue-200 hover:bg-blue-700"
  };

  // Force background coverage side-to-side and top-to-bottom
  useEffect(() => {
    document.body.style.backgroundColor = theme.bg;
    return () => { document.body.style.backgroundColor = ""; };
  }, [theme.bg]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen w-full font-sans transition-colors duration-500" style={{ backgroundColor: theme.bg }}>
      
      {/* Dynamic Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-20">
            
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors ${isFaculty ? 'bg-emerald-600 shadow-emerald-100' : 'bg-blue-600 shadow-blue-100'}`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                  Task <span className={theme.text}>Hub</span>
                </h1>
              </div>

              {/* Navigation Links with Theme-Specific Highlighting */}
              <div className="hidden sm:ml-10 sm:flex sm:space-x-4">
                {userData?.role === 'hod' && (
                  <>
                    <NavLink to="/hod/dashboard" label="Dashboard" active={isActive('/hod/dashboard')} color="blue" />
                    <NavLink to="/hod/create-task" label="Create Task" active={isActive('/hod/create-task')} color="blue" />
                    <NavLink to="/hod/submissions" label="Submissions" active={isActive('/hod/submissions')} color="blue" />
                  </>
                )}
                {userData?.role === 'faculty' && (
                  <>
                    <NavLink to="/faculty/dashboard" label="My Tasks" active={isActive('/faculty/dashboard')} color="emerald" />
                    <NavLink to="/faculty/profile" label="Profile" active={isActive('/faculty/profile')} color="emerald" />
                  </>
                )}
              </div>
            </div>

            {/* User Info & Dynamic Logout Button */}
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-slate-700 hidden md:block">
                {userData?.name} ({userData?.role === 'hod' ? 'HOD' : 'Faculty'})
              </span>
              
              <button
                onClick={handleLogout}
                className={`relative group overflow-hidden px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 text-white ${theme.button}`}
              >
                {/* Shining Effect copying Dashboard logic */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area - Removes padding to allow page backgrounds to bleed to top */}
      <main className="animate-in fade-in duration-700">
        {children}
      </main>

      {/* Background Shimmer Animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}} />
    </div>
  );
};

// Sub-component for NavLinks that adapts to the theme color
const NavLink = ({ to, label, active, color }) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all ${
      active 
        ? `bg-${color}-50 text-${color}-600 shadow-sm shadow-${color}-100/50` 
        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
    }`}
  >
    {label}
  </Link>
);

export default Layout;