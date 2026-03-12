import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Trash2, Calendar, Clock, Flame, Activity } from 'lucide-react';
import api, { getUserId } from '../api';

const WorkoutLog: React.FC = () => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [type, setType] = useState('cardio');
  const userId = getUserId();

  const fetchWorkouts = async () => {
    if (!userId) return;
    try {
      const response = await api.get(`/users/${userId}/workouts`);
      setWorkouts(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !title || !duration || !calories) return;
    try {
      await api.post(`/users/${userId}/workouts`, {
        title,
        duration: parseInt(duration),
        calories_burned: parseInt(calories),
        workout_type: type
      });
      setTitle('');
      setDuration('');
      setCalories('');
      fetchWorkouts();
    } catch (e) {
      alert("Failed to add workout");
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4 space-y-6">
        <form onSubmit={handleAdd} className="glass-card p-8 rounded-3xl border-emerald-500/30 sticky top-24">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Plus className="w-6 h-6 text-emerald-400" />
            Log Workout
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">Exercise Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Morning Run"
                className="w-full emerald-input"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">Duration (min)</label>
                <input 
                  type="number" 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="30"
                  className="w-full emerald-input"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">Calories</label>
                <input 
                  type="number" 
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="250"
                  className="w-full emerald-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full emerald-input appearance-none bg-emerald-900/50"
              >
                <option value="cardio">Cardio</option>
                <option value="strength">Strength</option>
                <option value="hiit">HIIT</option>
                <option value="yoga">Yoga</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button type="submit" className="w-full emerald-btn h-14 text-lg mt-4 flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20">
              <Plus className="w-6 h-6" />
              Log Activity
            </button>
          </div>
        </form>
      </div>

      <div className="lg:col-span-8">
        <div className="glass-card p-8 rounded-3xl border-emerald-500/30 min-h-[500px]">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            Activity History
          </h2>

          <div className="space-y-4">
            {workouts.length > 0 ? workouts.map(w => (
              <div key={w.id} className="p-6 bg-emerald-950/40 border border-emerald-900/50 rounded-3xl flex items-center gap-6 hover:bg-emerald-900/30 transition-all border-l-4 border-l-emerald-500">
                <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400">
                  {w.workout_type === 'cardio' ? <Flame className="w-8 h-8" /> : <Dumbbell className="w-8 h-8" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold">{w.title}</h3>
                    <span className="px-2 py-0.5 bg-emerald-900 text-[10px] text-emerald-400 font-bold uppercase tracking-widest rounded-full border border-emerald-800">
                      {w.workout_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-emerald-500 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {w.duration} mins
                    </div>
                    <div className="flex items-center gap-2 text-orange-400">
                      <Flame className="w-4 h-4" />
                      {w.calories_burned} kcal
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(w.logged_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-24 opacity-20">
                <Dumbbell className="w-24 h-24 mx-auto mb-6" />
                <p className="text-xl italic font-serif">Your journey begins with the first rep.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutLog;
