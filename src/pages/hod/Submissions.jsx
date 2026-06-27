import { useEffect, useState } from 'react';
import { getAllTasks, getAllSubmissions, approveTask, getAllFaculty } from '../../firebase/firestore';
import Layout from '../../components/Layout';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [facultyMap, setFacultyMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allSubmissions, allTasks, allFaculty] = await Promise.all([
        getAllSubmissions(),
        getAllTasks(),
        getAllFaculty()
      ]);
      
      const tasksMap = {};
      allTasks.forEach(task => {
        tasksMap[task.id] = task;
      });

      const facultyNameMap = {};
      allFaculty.forEach(faculty => {
        facultyNameMap[faculty.uid] = faculty.name || faculty.uid;
      });
      setFacultyMap(facultyNameMap);

      const submissionsWithTasks = allSubmissions.map(submission => ({
        ...submission,
        task: tasksMap[submission.taskId]
      })).filter(item => item.task);

      setSubmissions(submissionsWithTasks);
      setTasks(allTasks);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submission) => {
    if (!submission.task || submission.task.status === 'approved') {
      return;
    }

    setProcessing(submission.id);
    try {
      await approveTask(submission.taskId, submission.facultyId);
      await loadData();
    } catch (error) {
      console.error('Error approving task:', error);
      alert('Failed to approve task');
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-amber-50 text-amber-600 border-amber-100',
      submitted: 'bg-blue-50 text-blue-600 border-blue-100',
      approved: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    };
    return badges[status] || 'bg-slate-50 text-slate-600 border-slate-100';
  };

  // CHANGE MADE: Removed the constant 'submittedTasks' filter to allow ALL submissions to show
  // const submittedTasks = submissions.filter(sub => sub.task?.status === 'submitted');

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen w-full bg-[#f0f7ff] px-6 py-10 font-sans animate-in fade-in duration-700">
        
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Task Submissions</h1>
            <p className="mt-2 text-blue-500 font-bold tracking-wide">
              Review and manage departmental submission history
            </p>
          </div>

          {/* CHANGE MADE: Changed submittedTasks.length to submissions.length */}
          {submissions.length === 0 ? (
            <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(30,64,175,0.05)] border border-white p-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No task records found.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* CHANGE MADE: Mapping directly through 'submissions' instead of filtered array */}
              {submissions.map((submission) => (
                <div key={submission.id} className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(30,64,175,0.08)] border border-white p-10 md:p-12 animate-in slide-in-from-bottom-5 duration-500">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                          {submission.task?.title}
                        </h3>
                        <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusBadge(submission.task?.status)}`}>
                          {submission.task?.status}
                        </span>
                      </div>

                      <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed italic">
                        {submission.task?.description}
                      </p>

                      <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-8 mb-8 relative group overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Faculty Submission Content:</p>
                        <p className="text-slate-700 font-bold text-sm whitespace-pre-wrap leading-loose">
                          {submission.content}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Submitted By</p>
                          <p className="text-xs font-bold text-slate-600">{facultyMap[submission.facultyId] || submission.facultyId}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Date Logged</p>
                          <p className="text-xs font-bold text-slate-600">{formatDate(submission.submittedAt)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Initial Deadline</p>
                          <p className="text-xs font-bold text-slate-600">{formatDate(submission.task?.deadline)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-48 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-50 pt-8 lg:pt-0 lg:pl-8">
                      {submission.task?.status === 'submitted' && (
                        <button
                          onClick={() => handleApprove(submission)}
                          disabled={processing === submission.id}
                          className="relative overflow-hidden w-full py-5 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
                          {processing === submission.id ? 'Processing...' : 'Approve Work'}
                        </button>
                      )}
                      {submission.task?.status === 'approved' && (
                        <div className="flex flex-col items-center text-emerald-500">
                          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
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

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}} />
    </Layout>
  );
};

export default Submissions;