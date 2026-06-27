import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTask, createSubmission } from '../../firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';

const SubmitTask = () => {
  const { taskId } = useParams();
  const { currentUser } = useAuth();
  const [task, setTask] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      const taskData = await getTask(taskId);
      if (!taskData) {
        setError('Task not found');
        return;
      }
      if (taskData.assignedTo !== currentUser.uid) {
        setError('You are not authorized to submit this task');
        return;
      }
      if (taskData.status !== 'pending') {
        setError(`This task has already been ${taskData.status}`);
        return;
      }
      setTask(taskData);
    } catch (error) {
      console.error('Error loading task:', error);
      setError('Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!content.trim()) {
      setError('Please enter submission content');
      return;
    }
    setSubmitting(true);
    try {
      await createSubmission({
        taskId: task.id,
        facultyId: currentUser.uid,
        content: content.trim()
      });
      navigate('/faculty/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to submit task');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Submit Task</h1>
            <p className="mt-2 text-emerald-600 font-bold tracking-wide">Submit your work for review</p>
          </div>

          {error && !task && (
            <div className="bg-white rounded-[2rem] shadow-xl p-10 text-center border-2 border-rose-100">
              <div className="text-rose-600 text-xs font-black uppercase tracking-[0.2em] mb-6">{error}</div>
              <button
                onClick={() => navigate('/faculty/dashboard')}
                className="px-8 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-black transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          )}

          {task && (
            <div className="space-y-8">
              {/* Task Info Card */}
              <div className="bg-white rounded-[3rem] shadow-[0_30px_70px_-20px_rgba(5,150,105,0.08)] border border-white p-10 md:p-14 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100%] opacity-50" />
                <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight relative z-10">{task?.title}</h2>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed relative z-10">{task?.description}</p>
                <div className="flex items-center gap-3 text-[10px] font-black text-emerald-600 uppercase tracking-widest relative z-10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Deadline: {formatDate(task?.deadline)}
                </div>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-white p-10 md:p-14">
                {error && (
                  <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label htmlFor="content" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 block">
                      Submission Content
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      rows="10"
                      required
                      placeholder="Describe the work you have completed in detail..."
                      className="w-full px-8 py-8 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[2.5rem] outline-none transition-all duration-300 text-slate-700 font-bold resize-none leading-relaxed shadow-inner"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                    <p className="text-[10px] text-slate-400 font-bold italic ml-4">
                      * Provide all necessary links or data requested by the HOD.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => navigate('/faculty/dashboard')}
                      className="px-10 py-5 bg-slate-100 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="relative overflow-hidden px-12 py-5 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
                      {submitting ? 'Submitting...' : 'Submit Work'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes shimmer { 100% { transform: translateX(100%); } }`}} />
    </Layout>
  );
};

export default SubmitTask;