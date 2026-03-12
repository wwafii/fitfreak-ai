import React, { useState } from 'react';
import { LogIn, UserPlus, Activity, Lock, Mail, User } from 'lucide-react';
import api, { setToken, setUserId } from '../api';

const Auth: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    try {
      const response = await api.post(endpoint, formData);
      setToken(response.data.token);
      setUserId(response.data.user.id);
      onLogin();
    } catch (err: any) {
      setError(err.response?.data || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-6 bg-emerald-gradient">
      <div className="w-full max-w-md glass-card p-10 rounded-[3rem] border-emerald-500/30">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 ring-8 ring-emerald-500/10">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">FitFreak</h1>
          <p className="text-emerald-400 font-medium">Your AI-Powered Fitness Journey</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-2xl mb-8 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Username"
                className="w-full emerald-input pl-12 h-14"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full emerald-input pl-12 h-14"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full emerald-input pl-12 h-14"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="w-full emerald-btn h-14 text-xl flex items-center justify-center gap-3 mt-4">
            {isLogin ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-400 hover:text-emerald-200 transition-colors text-sm font-semibold tracking-wider uppercase"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
