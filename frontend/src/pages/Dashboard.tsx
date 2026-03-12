import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Activity, Flame, Weight, Calendar, TrendingUp } from 'lucide-react';
import api from '../api';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    caloriesToday: 1850,
    targetCalories: 2200,
    workoutsThisWeek: 4,
    weight: 72.5
  });

  useEffect(() => {
    // Mock data for demo
    setData([
      { name: 'Mon', calories: 2100, weight: 73.2 },
      { name: 'Tue', calories: 1900, weight: 73.0 },
      { name: 'Wed', calories: 2200, weight: 72.8 },
      { name: 'Thu', calories: 1850, weight: 72.5 },
      { name: 'Fri', calories: 2400, weight: 72.4 },
      { name: 'Sat', calories: 2100, weight: 72.3 },
      { name: 'Sun', calories: 2000, weight: 72.2 },
    ]);
  }, []);

  const progress = (summary.caloriesToday / summary.targetCalories) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl border-emerald-500/30 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-emerald-400">Daily Calories</p>
            <h3 className="text-2xl font-bold">{summary.caloriesToday} <span className="text-sm font-normal text-emerald-500">kcal</span></h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border-emerald-500/30 flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
            <Weight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-blue-400">Current Weight</p>
            <h3 className="text-2xl font-bold">{summary.weight} <span className="text-sm font-normal text-blue-500">kg</span></h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border-emerald-500/30 flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-purple-400">Workouts/Week</p>
            <h3 className="text-2xl font-bold">{summary.workoutsThisWeek} <span className="text-sm font-normal text-purple-500">sessions</span></h3>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border-emerald-500/30 flex items-center gap-4">
          <div className="p-3 bg-orange-500/20 rounded-2xl text-orange-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-orange-400">Goal Progress</p>
            <h3 className="text-2xl font-bold">82%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl border-emerald-500/30">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Weight & Calorie Progress
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-xs text-emerald-400">Calories</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-blue-400">Weight</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#065f46" vertical={false} />
                <XAxis dataKey="name" stroke="#6ee7b7" />
                <YAxis stroke="#6ee7b7" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#022c22', border: '1px solid #065f46', borderRadius: '12px' }}
                  itemStyle={{ color: '#ecfdf5' }}
                />
                <Area type="monotone" dataKey="calories" stroke="#10b981" fillOpacity={1} fill="url(#colorCal)" />
                <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl border-emerald-500/30 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-6">Daily Target</h3>
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-emerald-900"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={552}
                  strokeDashoffset={552 - (552 * progress) / 100}
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{Math.round(progress)}%</span>
                <span className="text-sm text-emerald-400">of goal</span>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-emerald-300">Remaining</span>
              <span className="font-bold">{summary.targetCalories - summary.caloriesToday} kcal</span>
            </div>
            <div className="w-full bg-emerald-900 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
