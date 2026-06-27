import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getFacultyTasks } from '../../firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';

const FacultyDashboard = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      loadTasks();
    }
  }, [currentUser]);

  useEffect(() => {
    const handleFocus = () => {
      if (currentUser) {
        loadTasks();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [currentUser]);

  const loadTasks = async () => {
    try {
      console.log('=== Loading Faculty Tasks ===');
      const assignedTasks = await getFacultyTasks(currentUser.uid);
      setTasks(assignedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      alert(`Error loading tasks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-amber-50 text-amber-600 border-amber-100',
      submitted: 'bg-blue-50 text-blue-600 border-blue-100',
      approved: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    };
    return badges[status] || 'bg-slate-50 text-slate-600 border-slate-100';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleSubmitTask = (taskId) => {
    navigate(`/faculty/submit/${taskId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-[#f0fff4]">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen w-full bg-[#f0fff4] px-6 py-10 font-sans animate-in fade-in duration-700">
        
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter">My Tasks</h1>
              <p className="mt-2 text-emerald-600 font-bold tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                View and manage your assigned tasks
              </p>
              {currentUser && (
                <div className="mt-4 px-4 py-2 bg-white/50 backdrop-blur-sm border border-emerald-100 rounded-xl inline-block">
                  <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">
                    Your User UID: <span className="font-mono text-slate-500 lowercase ml-1">{currentUser.uid}</span>
                  </p>
                </div>
              )}
            </div>
            
            <button
              onClick={loadTasks}
              className="group relative overflow-hidden px-8 py-3 bg-white border border-emerald-100 text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-200/50 hover:scale-105 transition-all flex items-center gap-3 active:scale-95"
            >
              <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh System
            </button>
          </div>

          {/* Feature Grid: UPDATED Icons to be Green upon interaction */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { 
                onClick: () => document.getElementById('tasks-section')?.scrollIntoView({ behavior: 'smooth' }),
                title: "View Assigned Tasks", 
                desc: "See all tasks that have been assigned to you with their deadlines and status.", 
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", 
                color: "emerald", // Changed to emerald
                linkText: "View Below ↓" 
              },
              { 
                onClick: () => {
                  const pendingTask = tasks.find(t => t.status === 'pending');
                  pendingTask ? navigate(`/faculty/submit/${pendingTask.id}`) : alert('No pending tasks available.');
                },
                title: "Submit Completed Work", 
                desc: "Submit your completed tasks with detailed content for HOD review.", 
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", 
                color: "emerald", // Changed to emerald
                linkText: tasks.some(t => t.status === 'pending') ? 'Submit Task →' : 'No Pending Tasks'
              },
              { 
                to: "/faculty/profile",
                title: "Track Your Profile Score", 
                desc: "Monitor your score and completed tasks count in your Profile page.", 
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", 
                color: "emerald", // Changed to emerald
                linkText: "View Profile →" 
              }
            ].map((item, idx) => {
              const Content = () => (
                <>
                  <div className={`relative w-20 h-20 rounded-[2.5rem] bg-slate-50 text-slate-300 border border-slate-100 flex items-center justify-center mb-10 shadow-inner group-hover:bg-emerald-50 group-hover:text-emerald-500 group-hover:border-emerald-100 group-hover:scale-110 transition-all duration-500`}>
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={item.icon} /></svg>
                  </div>
                  <h3 className="relative text-2xl font-black text-slate-800 mb-4 tracking-tight">{item.title}</h3>
                  <p className="relative text-slate-400 text-sm font-medium leading-relaxed mb-10">{item.desc}</p>
                  <div className="relative text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4 transition-all">
                    {item.linkText}
                  </div>
                </>
              );

              return item.to ? (
                <Link key={idx} to={item.to} className="group relative bg-white p-10 rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(5,150,105,0.08)] border border-white hover:shadow-[0_40px_80px_-20px_rgba(5,150,105,0.15)] hover:-translate-y-2 transition-all duration-500 overflow-hidden active:scale-95">
                  <Content />
                </Link>
              ) : (
                <div key={idx} onClick={item.onClick} className="group relative bg-white p-10 rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(5,150,105,0.08)] border border-white hover:shadow-[0_40px_80px_-20px_rgba(5,150,105,0.15)] hover:-translate-y-2 transition-all duration-500 overflow-hidden active:scale-95 cursor-pointer">
                  <Content />
                </div>
              );
            })}
          </div>

          {/* Tasks Section */}
          <div id="tasks-section" className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-white overflow-hidden mb-12">
            <div className="px-12 py-10 border-b border-emerald-50 flex items-center justify-between bg-white flex-wrap gap-4">
              <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Your Assigned Tasks</h2>
              <div className="px-6 py-2 bg-emerald-50 rounded-2xl text-emerald-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
                Queue Status: Active
              </div>
            </div>

            <div className="p-8">
              {tasks.length === 0 ? (
                <div className="py-24 text-center text-slate-400 font-bold uppercase tracking-widest">
                  No tasks assigned to you yet.
                </div>
              ) : (
                <div className="space-y-6">
                  {tasks.map((task) => (
                    <div key={task.id} className="group bg-slate-50/50 rounded-[2.5rem] border border-slate-100 p-8 md:p-10 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">
                              {task.title}
                            </h3>
                            <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusBadge(task.status)}`}>
                              {task.status}
                            </span>
                          </div>
                          <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Deadline: <span className="text-slate-600">{formatDate(task.deadline)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-4 min-w-[160px]">
                          {task.status === 'pending' && (
                            <button
                              onClick={() => handleSubmitTask(task.id)}
                              className="relative overflow-hidden w-full text-center py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
                              Submit Task
                            </button>
                          )}
                          {task.status === 'submitted' && (
                            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                              </div>
                              Submitted
                            </div>
                          )}
                          {task.status === 'approved' && (
                            <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                              </div>
                              Verified
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}} />
    </Layout>
  );
};

export default FacultyDashboard;