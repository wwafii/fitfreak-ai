import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { 
  Dumbbell, 
  Utensils, 
  MessageSquare, 
  User, 
  LayoutDashboard, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Activity,
  Flame,
  Weight
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AICoach from './pages/AICoach';
import MealPlanner from './pages/MealPlanner';
import WorkoutLog from './pages/WorkoutLog';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import { getUserId, removeToken } from './api';

const SidebarLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
  <Link 
    to={to} 
    className="flex items-center gap-3 px-4 py-3 text-emerald-100 hover:bg-emerald-700/50 rounded-xl transition-all"
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
    <ChevronRight className="w-4 h-4 ml-auto opacity-0 hover:opacity-100" />
  </Link>
);

const Navbar = ({ onLogout }: { onLogout: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 h-16 bg-emerald-950/80 backdrop-blur-md border-b border-emerald-800/50 flex items-center justify-between px-6 z-50">
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
        <Activity className="text-white w-6 h-6" />
      </div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
        FitFreak
      </h1>
    </div>
    <button 
      onClick={onLogout}
      className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors"
    >
      <LogOut className="w-5 h-5" />
      <span>Logout</span>
    </button>
  </nav>
);

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  if (!isLoggedIn) {
    return <Auth onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-emerald-950 text-emerald-50">
        <Navbar onLogout={handleLogout} />
        <div className="flex pt-16 h-screen">
          <aside className="w-64 bg-emerald-950/50 border-r border-emerald-800/50 p-4 hidden lg:block overflow-y-auto">
            <div className="space-y-2">
              <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" />
              <SidebarLink to="/ai-coach" icon={MessageSquare} label="AI Coach" />
              <SidebarLink to="/meals" icon={Utensils} label="Meal Planner" />
              <SidebarLink to="/workouts" icon={Dumbbell} label="Workout Log" />
              <SidebarLink to="/profile" icon={User} label="Profile" />
            </div>
            
            <div className="mt-10 p-4 rounded-2xl glass-card border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="font-semibold">Today's Streak</span>
              </div>
              <p className="text-sm text-emerald-300">You're on a 5-day streak! Keep pushing.</p>
            </div>
          </aside>
          
          <main className="flex-1 overflow-y-auto bg-emerald-gradient p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ai-coach" element={<AICoach />} />
              <Route path="/meals" element={<MealPlanner />} />
              <Route path="/workouts" element={<WorkoutLog />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
