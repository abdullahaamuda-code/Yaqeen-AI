
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface AuthModalProps {
  onAuthComplete: (user: UserProfile, isNewSignup: boolean) => void;
  existingUser: UserProfile | null;
  onOpenTerms: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onAuthComplete, existingUser, onOpenTerms }) => {
  const [isLogin, setIsLogin] = useState(!!existingUser);
  const [formData, setFormData] = useState({
    name: existingUser?.name || '',
    age: existingUser?.age || 18,
    password: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (existingUser && formData.name.trim().toLowerCase() === existingUser.name.trim().toLowerCase() && formData.password === existingUser.password) {
        onAuthComplete(existingUser, false);
      } else {
        setError('Invalid name or password.');
      }
    } else {
      if (!agreedToTerms) {
        setError('You must agree to the Terms of Use to continue.');
        return;
      }
      if (formData.name.trim() && formData.age && formData.password) {
        onAuthComplete(formData as UserProfile, true);
      } else {
        setError('Please fill in all required fields.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white/10 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[32px] md:rounded-[40px] p-6 md:p-8 shadow-2xl border border-white/20 custom-scrollbar">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl shadow-lg">
            <span className="font-arabic text-white">ي</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
            {isLogin ? 'Login to Yaqeen AI' : 'Join Yaqeen AI'}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Your anchor in Islamic certainty.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="Enter your name"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Age</label>
              <input 
                type="number" 
                required
                min="5"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Password</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div className="flex items-start gap-3 mt-1 px-1">
              <input 
                type="checkbox" 
                id="terms" 
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="terms" className="text-[11px] text-slate-400 leading-snug">
                I agree to the <button type="button" onClick={onOpenTerms} className="text-emerald-400 hover:underline">Disclaimer & Terms of Use</button>.
              </label>
            </div>
          )}

          {isLogin && (
            <div className="text-center pt-1">
              <button type="button" onClick={onOpenTerms} className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors uppercase font-bold tracking-widest underline decoration-slate-700 underline-offset-4">
                Disclaimer & Terms of Use
              </button>
            </div>
          )}

          {error && <p className="text-red-400 text-[11px] text-center font-medium py-1">{error}</p>}

          <button 
            type="submit"
            disabled={!isLogin && !agreedToTerms}
            className={`w-full py-3.5 font-bold rounded-xl md:rounded-2xl transition-all shadow-xl active:scale-95 mt-2 ${
              (!isLogin && !agreedToTerms) 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isLogin ? 'Enter' : 'Create Account'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-slate-400 text-[11px] hover:text-emerald-400 transition-colors font-medium"
          >
            {isLogin ? "Don't have a profile? Sign up" : "Already have a profile? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
