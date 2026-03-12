import React, { useState, useEffect } from 'react';
import { Search, Plus, Utensils, Flame, ChevronRight, Activity, Trash2, Edit2, PlusCircle, CheckCircle2 } from 'lucide-react';
import api, { getUserId } from '../api';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  category: string;
}

const MealPlanner: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Meal[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = getUserId();

  const handleSearch = async (val: string) => {
    setSearchTerm(val);
    if (val.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await api.get(`/meals/search?q=${val}`);
      setSearchResults(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLogs = async () => {
    if (!userId) return;
    try {
      const response = await api.get(`/users/${userId}/food-logs`);
      setLogs(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const addMeal = async (meal: Meal) => {
    if (!userId) return;
    setLoading(true);
    try {
      await api.post(`/users/${userId}/food-logs`, {
        food_name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fats: meal.fats,
        serving_size: 1.0
      });
      fetchLogs();
      setSearchTerm('');
      setSearchResults([]);
    } catch (e) {
      alert("Failed to log food");
    } finally {
      setLoading(false);
    }
  };

  const totalToday = logs.reduce((acc, log) => acc + log.calories, 0);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 space-y-6">
        <div className="glass-card p-8 rounded-3xl border-emerald-500/30">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-emerald-400" />
            Global Meal Database
          </h2>
          
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search sushi, burger, nasi goreng..."
              className="w-full emerald-input pl-12 h-14 text-lg"
            />
          </div>

          <div className="grid gap-4">
            {searchResults.length > 0 ? (
              searchResults.map(meal => (
                <div key={meal.id} className="p-4 bg-emerald-900/30 border border-emerald-800/50 rounded-2xl flex items-center justify-between hover:border-emerald-500/50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-800/50 rounded-xl flex items-center justify-center text-emerald-400 font-bold group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      {meal.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{meal.name}</h4>
                      <p className="text-sm text-emerald-400">
                        {meal.calories} kcal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => addMeal(meal)}
                    disabled={loading}
                    className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              ))
            ) : searchTerm.length > 1 ? (
              <div className="text-center py-10 text-emerald-500">
                No food found for "{searchTerm}"
              </div>
            ) : (
              <div className="text-center py-10 opacity-30">
                <Utensils className="w-16 h-16 mx-auto mb-4" />
                <p>Start typing to search international dishes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <div className="glass-card p-8 rounded-3xl border-emerald-500/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Today's Intake</h2>
            <div className="px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-sm font-bold">
              {totalToday} kcal
            </div>
          </div>

          <div className="space-y-4">
            {logs.length > 0 ? logs.map(log => (
              <div key={log.id} className="flex items-center gap-4 p-4 bg-emerald-950/50 rounded-2xl border border-emerald-900">
                <div className="w-10 h-10 bg-emerald-800/30 rounded-lg flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{log.food_name}</h4>
                  <div className="flex items-center gap-2 text-xs text-emerald-500">
                    <span>{log.calories} kcal</span>
                    <span>•</span>
                    <span>{new Date(log.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center text-emerald-600 py-10 italic">No food logged yet today.</p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-800/50">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 bg-emerald-900/30 rounded-xl">
                <div className="font-bold text-white mb-1">
                  {logs.reduce((a, b) => a + b.protein, 0).toFixed(1)}g
                </div>
                <div className="text-emerald-500 uppercase font-bold tracking-tighter">Protein</div>
              </div>
              <div className="p-3 bg-emerald-900/30 rounded-xl">
                <div className="font-bold text-white mb-1">
                  {logs.reduce((a, b) => a + b.carbs, 0).toFixed(1)}g
                </div>
                <div className="text-emerald-500 uppercase font-bold tracking-tighter">Carbs</div>
              </div>
              <div className="p-3 bg-emerald-900/30 rounded-xl">
                <div className="font-bold text-white mb-1">
                  {logs.reduce((a, b) => a + b.fats, 0).toFixed(1)}g
                </div>
                <div className="text-emerald-500 uppercase font-bold tracking-tighter">Fats</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
