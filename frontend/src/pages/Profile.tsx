import React, { useState, useEffect } from 'react';
import { User, Save, Target, Activity, Height, Weight, Calendar, ChevronRight } from 'lucide-react';
import api, { getUserId } from '../api';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    full_name: '',
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    fitness_goal: 'Weight Loss',
    daily_calorie_target: '2000'
  });
  const userId = getUserId();

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/users/${userId}/profile`);
        setProfile(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      await api.put(`/users/${userId}/profile`, profile);
      alert("Profile updated!");
    } catch (e) {
      alert("Failed to update profile");
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4 space-y-6">
        <div className="glass-card p-10 rounded-3xl border-emerald-500/30 text-center">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center text-white ring-8 ring-emerald-500/20">
              <User className="w-16 h-16" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-950 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-500">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-1">{profile.full_name || 'Fit Freak User'}</h2>
          <p className="text-sm text-emerald-400 mb-6 uppercase tracking-widest font-bold">Free Tier Member</p>
          
          <div className="flex gap-4 justify-center">
            <div className="text-center px-4 border-r border-emerald-800">
              <div className="text-xl font-bold">{profile.weight || '-'}</div>
              <div className="text-[10px] text-emerald-500 uppercase tracking-tighter">Weight (kg)</div>
            </div>
            <div className="text-center px-4">
              <div className="text-xl font-bold">{profile.height || '-'}</div>
              <div className="text-[10px] text-emerald-500 uppercase tracking-tighter">Height (cm)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8">
        <form onSubmit={handleUpdate} className="glass-card p-10 rounded-3xl border-emerald-500/30 space-y-8">
          <h3 className="text-2xl font-bold mb-10 flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" />
            Personal Metrics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Full Name</label>
              <input 
                type="text" 
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full emerald-input h-12"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Age</label>
                <input 
                  type="number" 
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  className="w-full emerald-input h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Gender</label>
                <select 
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full emerald-input h-12 appearance-none bg-emerald-900/50"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Goal</label>
              <select 
                value={profile.fitness_goal}
                onChange={(e) => setProfile({ ...profile, fitness_goal: e.target.value })}
                className="w-full emerald-input h-12 appearance-none bg-emerald-900/50"
              >
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Endurance">Endurance</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Daily Calorie Target</label>
              <input 
                type="number" 
                value={profile.daily_calorie_target}
                onChange={(e) => setProfile({ ...profile, daily_calorie_target: e.target.value })}
                className="w-full emerald-input h-12"
              />
            </div>
          </div>

          <div className="pt-8 border-t border-emerald-800/50 flex justify-end">
            <button type="submit" className="emerald-btn h-14 px-10 text-lg flex items-center gap-3">
              <Save className="w-6 h-6" />
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
