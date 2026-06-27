import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUser } from '../../firebase/firestore';
import Layout from '../../components/Layout';

const Profile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  const loadUserData = async () => {
    if (!currentUser) return;
    try {
      const data = await getUser(currentUser.uid);
      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">My Profile</h1>
            <p className="mt-2 text-emerald-600 font-bold tracking-wide">View your profile statistics</p>
          </div>

          <div className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(5,150,105,0.1)] border border-white overflow-hidden">
            <div className="px-10 py-12 md:px-16">
              <div className="mb-12 border-b border-emerald-50 pb-8">
                <h2 className="text-3xl font-black text-slate-900 mb-2">
                  {userData?.name || 'Faculty Member'}
                </h2>
                <p className="text-slate-500 font-medium">{userData?.email || currentUser?.email}</p>
                <div className="mt-4 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest inline-block border border-emerald-100">
                  Role: Faculty
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Score Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[2.5rem] p-10 text-white shadow-xl shadow-emerald-200 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_4s_infinite] pointer-events-none" />
                  <div className="relative z-10">
                    <p className="text-emerald-100 text-[10px] font-black uppercase tracking-[0.2em]">Profile Score</p>
                    <p className="text-6xl font-black mt-3 tracking-tighter">
                      {userData?.score || 0}
                    </p>
                    <p className="text-emerald-100 text-[10px] font-bold mt-4 uppercase tracking-widest opacity-80">
                      +10 points per approved task
                    </p>
                  </div>
                  <div className="absolute right-[-10%] bottom-[-10%] text-9xl opacity-10 rotate-12 transition-transform group-hover:scale-110 duration-700">⭐</div>
                </div>

                {/* Completed Tasks Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 rounded-[2.5rem] p-10 text-white shadow-xl shadow-blue-200 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_4s_infinite] pointer-events-none" />
                  <div className="relative z-10">
                    <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em]">Completed Tasks</p>
                    <p className="text-6xl font-black mt-3 tracking-tighter">
                      {userData?.completedTasks || 0}
                    </p>
                    <p className="text-blue-100 text-[10px] font-bold mt-4 uppercase tracking-widest opacity-80">
                      Approved by HOD
                    </p>
                  </div>
                  <div className="absolute right-[-10%] bottom-[-10%] text-9xl opacity-10 rotate-12 transition-transform group-hover:scale-110 duration-700">✓</div>
                </div>
              </div>

              <div className="pt-8 border-t border-emerald-50">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Profile Information</h3>
                <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <dt className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">User ID</dt>
                    <dd className="text-xs font-mono font-bold text-slate-600 break-all">
                      {userData?.uid || currentUser?.uid}
                    </dd>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <dt className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</dt>
                    <dd className="text-sm font-bold text-slate-600">
                      {currentUser?.email}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes shimmer { 100% { transform: translateX(100%); } }`}} />
    </Layout>
  );
};

export default Profile;