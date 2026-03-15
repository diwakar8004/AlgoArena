import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { useAuthStore } from '../store';

export default function Profile() {
  const { username } = useParams();
  const { user: currentUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [bioEdit, setBioEdit] = useState('');

  useEffect(() => {
    // In a real app we'd fetch profile from API by username:
    // fetchProfile();
    // For now, let's mock the profile based on leaderboard/currentUser
    const mockFetch = async () => {
      setLoading(true);
      await new Promise(r => setTimeout(r, 500));
      if (currentUser?.username === username) {
        setProfile(currentUser);
        setBioEdit(currentUser.bio || '');
      } else {
        // Mock data for other users
        setProfile({
          username,
          bio: 'Competitive Programming Enthusiast',
          joinedAt: new Date(Date.now() - 30*24*3600*1000).toISOString(),
          problemsSolved: 280,
          streak: 14,
          rank: Math.floor(Math.random() * 100) + 1,
          topicProgress: { 'Arrays': { solved: 30, total: 40 }, 'Strings': { solved: 20, total: 30 } }
        });
      }
      setLoading(false);
    };
    mockFetch();
  }, [username, currentUser]);

  const handleSaveBio = async () => {
    // API call to save bio...
    setProfile({ ...profile, bio: bioEdit });
    setIsEditing(false);
  };

  if (loading) return (
    <div className="min-h-screen pt-20 flex justify-center items-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen pt-20 flex justify-center items-center text-text-secondary">
      User not found
    </div>
  );

  const isOwnProfile = currentUser?.username === username;

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/10" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 pt-12 text-center sm:text-left">
            <div className="w-32 h-32 rounded-full border-4 border-surface bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-primary/20 flex-shrink-0">
              {profile.username[0].toUpperCase()}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{profile.username}</h1>
              <p className="text-sm text-text-secondary flex items-center justify-center sm:justify-start gap-2 mb-4">
                <span>Joined {new Date(profile.joinedAt).toLocaleDateString()}</span>
                <span>•</span>
                <span className="text-primary font-medium">Rank #{profile.rank}</span>
              </p>
              
              {isOwnProfile && isEditing ? (
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <input
                    type="text"
                    value={bioEdit}
                    onChange={e => setBioEdit(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-surface-lighter/50 border border-border focus:border-primary outline-none text-sm"
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveBio} className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">Save</button>
                    <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 bg-surface-lighter/50 text-text rounded-lg text-sm hover:bg-surface-lighter transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <p className="text-sm text-text-secondary italic">"{profile.bio || 'No bio provided'}"</p>
                  {isOwnProfile && (
                    <button onClick={() => setIsEditing(true)} className="p-1 rounded-md text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors">
                      ✏️
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Problems Solved', value: profile.problemsSolved, icon: '✅', color: 'from-green-500 to-emerald-500' },
            { label: 'Current Streak', value: profile.streak, icon: '🔥', color: 'from-orange-500 to-red-500' },
            { label: 'Contest Rating', value: 1650 + profile.rank, icon: '🏆', color: 'from-purple-500 to-pink-500' },
            { label: 'Global Rank', value: `#${profile.rank}`, icon: '🌍', color: 'from-blue-500 to-cyan-500' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i*0.05 }}
              className="glass rounded-xl p-5 hover:border-primary/30 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl group-hover:scale-125 transition-transform duration-300 transform-origin-bottom">{stat.icon}</span>
              </div>
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r hover:bg-gradient-to-l transition-all duration-500 {stat.color} text-white">
                {stat.value}
              </div>
              <div className="text-xs text-text-secondary mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity (Mock) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-primary">Recent Activity</h2>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {[
              { type: 'solved', text: 'Solved Two Sum (Easy)', time: '2 hours ago', icon: '✅' },
              { type: 'contest', text: 'Participated in Weekly Contest #42 (Rank 120)', time: '3 days ago', icon: '🏆' },
              { type: 'streak', text: 'Achieved 14 days streak!', time: '1 week ago', icon: '🔥' },
            ].map((activity, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface-light group-hover:bg-primary/20 group-hover:border-primary/50 text-surface-light group-hover:text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors duration-300">
                  <span className="text-sm drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">{activity.icon}</span>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-4 rounded-xl shadow group-hover:border-primary/30 transition-colors duration-300">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-sm text-text">{activity.text}</div>
                  </div>
                  <div className="text-xs text-text-secondary">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
