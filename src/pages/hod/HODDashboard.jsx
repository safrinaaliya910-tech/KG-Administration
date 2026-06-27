import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTasks, getAllFaculty, getUser, reassignTask } from '../../firebase/firestore';
import Layout from '../../components/Layout';

const HODDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [facultyMap, setFacultyMap] = useState({});
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reassigning, setReassigning] = useState(null);
  const [showReassign, setShowReassign] = useState({});

  // --- LOGIC PRESERVED EXACTLY ---
  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const handleFocus = () => { loadData(); };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadData = async () => {
    try {
      const [allTasks, allFaculty] = await Promise.all([
        getAllTasks(),
        getAllFaculty()
      ]);
      const map = {};
      for (const faculty of allFaculty) {
        map[faculty.uid] = faculty.name || faculty.uid;
      }
      setFacultyMap(map);
      setFacultyList(allFaculty);
      setTasks(allTasks);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading tasks. Please check your Firestore permissions and refresh the page.');
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

  const handleReassign = async (taskId, newFacultyUid) => {
    if (!newFacultyUid) {
      alert('Please select a faculty member');
      return;
    }
    setReassigning(taskId);
    try {
      await reassignTask(taskId, newFacultyUid);
      alert('Task reassigned successfully!');
      setShowReassign({});
      await loadData();
    } catch (error) {
      console.error('Error reassigning task:', error);
      alert('Failed to reassign task: ' + error.message);
    } finally {
      setReassigning(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-[#f0f7ff]">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* INJECTED GLOBAL STYLE: Forces full screen background coverage */}
      <style dangerouslySetInnerHTML={{ __html: `
        body, #root, main { background-color: #f0f7ff !important; margin: 0; padding: 0; }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}} />

      <div className="w-full min-h-screen bg-[#f0f7ff] px-6 py-10 font-sans animate-in fade-in duration-700">
        
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter">HOD Dashboard</h1>
              <p className="mt-2 text-blue-500 font-bold tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                View and manage all department tasks
              </p>
            </div>
            <button
              onClick={loadData}
              className="group relative overflow-hidden px-8 py-3 bg-white border border-blue-100 text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200/50 hover:scale-105 transition-all flex items-center gap-3 active:scale-95"
            >
              <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh System
            </button>
          </div>

          {/* Feature Grid: Icons now switch from neutral to vibrant BLUE on interaction */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { to: "/hod/create-task", title: "Create and Assign Tasks", desc: "Create new tasks and assign them to faculty members with deadlines.", icon: "M12 4v16m8-8H4", color: "blue", linkText: "Get Started" },
              { to: "/hod/submissions", title: "Review Submissions", desc: "View all submitted tasks from faculty members in the Submissions page.", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", color: "blue", linkText: "View Submissions" },
              { to: "/hod/submissions", title: "Approve/Reject Work", desc: "Approve or reject submitted work and update faculty scores accordingly.", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "blue", linkText: "Manage Submissions" }
            ].map((item, idx) => (
              <Link key={idx} to={item.to} className="group relative bg-white p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(30,64,175,0.08)] border border-white hover:shadow-[0_40px_80px_-20px_rgba(30,64,175,0.15)] hover:-translate-y-2 transition-all duration-500 overflow-hidden active:scale-95">
                {/* ICON DYNAMICS: Switch to Blue on interaction */}
                <div className={`relative w-20 h-20 rounded-[2rem] bg-slate-50 text-slate-300 border border-slate-100 flex items-center justify-center mb-10 shadow-inner group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-100 group-hover:scale-110 transition-all duration-500 group-active:scale-90`}>
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={item.icon} /></svg>
                </div>
                <h3 className="relative text-2xl font-black text-slate-800 mb-4 tracking-tight">{item.title}</h3>
                <p className="relative text-slate-400 text-sm font-medium leading-relaxed mb-10">{item.desc}</p>
                <div className="relative text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4 transition-all">
                  {item.linkText} <span className="text-xl">→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Faculty Banner */}
          {facultyList.length > 0 && (
            <div className="mb-16 relative overflow-hidden bg-[#0f172a] rounded-[3.5rem] p-12 shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_4s_infinite] pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white mb-8 tracking-tight flex items-center gap-3">
                  <span className="p-2 bg-blue-600 rounded-xl font-normal">📋</span> Available Faculty Members:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {facultyList.map((faculty) => (
                    <div key={faculty.uid} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors">
                      <div className="font-bold text-white text-lg">{faculty.name || 'Unnamed'}</div>
                      <div className="text-blue-300/50 font-mono text-[10px] mt-2 tracking-tighter">UID: {faculty.uid.substring(0, 15)}...</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Task Table Section */}
          <div className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-white overflow-hidden mb-12">
            <div className="px-12 py-10 border-b border-blue-50 flex items-center justify-between bg-white flex-wrap gap-4 text-center sm:text-left">
              <h2 className="text-3xl font-black text-slate-800 tracking-tighter">All Tasks</h2>
              <div className="px-6 py-2 bg-blue-50 rounded-2xl text-blue-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
                Live Management System
              </div>
            </div>

            <div className="overflow-x-auto">
              {tasks.length === 0 ? (
                <div className="py-24 text-center text-slate-400 font-bold uppercase tracking-widest">
                  No tasks created yet.
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-slate-100">
                      <th className="px-12 py-6">Directive Info</th>
                      <th className="px-12 py-6">Assigned Personnel</th>
                      <th className="px-12 py-6 text-center">Status</th>
                      <th className="px-12 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tasks.map((task) => (
                      <tr key={task.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                        <td className="px-12 py-8">
                          <div className="font-black text-slate-800 text-xl tracking-tight mb-1 group-hover:text-blue-600 transition-colors">{task.title}</div>
                          <div className="text-slate-400 text-sm font-medium line-clamp-1 mb-3">{task.description}</div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Deadline: {formatDate(task.deadline)}
                          </div>
                        </td>
                        <td className="px-12 py-8">
                          <div className="font-bold text-slate-700 text-sm">{facultyMap[task.assignedTo] || '⚠️ Unknown'}</div>
                          <div className="text-[10px] text-slate-300 font-mono mt-1 opacity-70">UID: {task.assignedTo?.substring(0, 10)}...</div>
                        </td>
                        <td className="px-12 py-8 text-center">
                          <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusBadge(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-12 py-8 text-right">
                          <button
                            onClick={() => setShowReassign({ ...showReassign, [task.id]: !showReassign[task.id] })}
                            className={`relative overflow-hidden px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all ${
                              showReassign[task.id] ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
                            }`}
                          >
                            {!showReassign[task.id] && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />}
                            {showReassign[task.id] ? '✕ Cancel' : '🔄 Reassign Task'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Reassignment */}
      {Object.entries(showReassign).map(([taskId, isVisible]) => (
        isVisible && (
          <div key={taskId} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[3.5rem] shadow-2xl p-10 max-w-lg w-full border border-white">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 text-center">Modify Assignment</h3>
              <p className="text-slate-500 font-medium mb-8 text-center text-sm">Select a new faculty member for this directive.</p>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-6 py-4 text-slate-700 font-bold outline-none focus:border-blue-500 transition-all cursor-pointer mb-8"
                defaultValue=""
                onChange={(e) => { if (e.target.value) handleReassign(taskId, e.target.value); }}
                disabled={reassigning === taskId}
              >
                <option value="" disabled>-- Select Faculty Member --</option>
                {facultyList.map((f) => (
                  <option key={f.uid} value={f.uid}>{f.name}</option>
                ))}
              </select>
              <button onClick={() => setShowReassign({})} className="w-full py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors">
                Close Window
              </button>
            </div>
          </div>
        )
      ))}
    </Layout>
  );
};

export default HODDashboard;