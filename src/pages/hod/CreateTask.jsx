import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask, getAllFaculty } from '../../firebase/firestore';
import Layout from '../../components/Layout';

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    deadline: ''
  });
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      console.log('Loading faculty list...');
      const facultyList = await getAllFaculty();
      console.log('Faculty list loaded:', facultyList);
      
      facultyList.forEach((member, index) => {
        if (!member.uid) {
          console.error(`Faculty member ${index} missing UID:`, member);
        }
      });
      
      setFaculty(facultyList);
    } catch (error) {
      console.error('Error loading faculty:', error);
      alert('Error loading faculty list. Please refresh the page.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.assignedTo) {
      setError('Please select a faculty member');
      setLoading(false);
      return;
    }

    if (!formData.deadline) {
      setError('Please select a deadline');
      setLoading(false);
      return;
    }

    try {
      console.log('Creating task with data:', {
        title: formData.title,
        description: formData.description,
        assignedTo: formData.assignedTo,
        deadline: formData.deadline
      });

      const taskId = await createTask({
        title: formData.title,
        description: formData.description,
        assignedTo: formData.assignedTo,
        deadline: new Date(formData.deadline),
      });

      console.log('Task created successfully with ID:', taskId);
      alert(`Task created successfully!\nAssigned to UID: ${formData.assignedTo}`);
      navigate('/hod/dashboard');
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.message || 'Failed to create task. Please check your Firestore permissions and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* UI Wrapper: Consistent with the Dashboard light-blue background */}
      <div className="min-h-screen w-full bg-[#f0f7ff] px-6 py-10 font-sans animate-in fade-in duration-700">
        
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Create New Task</h1>
            <p className="mt-2 text-blue-500 font-bold tracking-wide">
              Assign a task to a faculty member
            </p>
          </div>

          {/* Form Container: Pure White Elevated Card */}
          <div className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(30,64,175,0.1)] border border-white p-10 md:p-14 overflow-hidden relative group">
            {/* Elegant Background Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {error && (
              <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-black uppercase tracking-widest flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              {/* Task Title Input */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">
                  Task Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  placeholder="Enter directive title..."
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2rem] outline-none transition-all duration-300 text-slate-700 font-bold"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              {/* Description Textarea */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows="4"
                  required
                  placeholder="Provide detailed instructions..."
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2.5rem] outline-none transition-all duration-300 text-slate-700 font-bold resize-none"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Faculty Selection */}
                <div className="space-y-2">
                  <label htmlFor="assignedTo" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">
                    Assign To
                  </label>
                  <select
                    name="assignedTo"
                    id="assignedTo"
                    required
                    className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2rem] outline-none transition-all duration-300 text-slate-700 font-bold appearance-none cursor-pointer"
                    value={formData.assignedTo}
                    onChange={handleChange}
                  >
                    <option value="">Select Faculty Member</option>
                    {faculty.map((member) => {
                      const facultyUid = member.uid || member.id;
                      return (
                        <option key={facultyUid} value={facultyUid}>
                          {member.name || 'Faculty Member'} ({facultyUid.substring(0, 6)}...)
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Deadline Input */}
                <div className="space-y-2">
                  <label htmlFor="deadline" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    name="deadline"
                    id="deadline"
                    required
                    className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2rem] outline-none transition-all duration-300 text-slate-700 font-bold"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex flex-col sm:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/hod/dashboard')}
                  className="px-10 py-5 bg-slate-100 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="relative overflow-hidden px-12 py-5 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  {/* Shining Button Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Global CSS for the Shimmer Animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}} />
    </Layout>
  );
};

export default CreateTask;