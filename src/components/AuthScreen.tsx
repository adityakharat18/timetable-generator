import React, { useState } from 'react';
import { CalendarDays, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true); setError(''); setMessage('');
    try {
      if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({ email: email.trim(), password });
        if (authError) throw authError;
        if (!data.session) setMessage('Account created. Check your email to confirm your address, then sign in.');
        else setMessage('Account created successfully.');
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Authentication failed. Please try again.');
    } finally { setBusy(false); }
  };

  return <div className="min-h-screen bg-[#f5f7ff] flex items-center justify-center p-5 text-slate-900">
    <div className="w-full max-w-md rounded-3xl border border-indigo-100 bg-white p-8 shadow-xl shadow-indigo-100/50">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200"><CalendarDays size={28}/></div>
      <div className="text-center"><h1 className="text-2xl font-bold tracking-tight">EvoSchedule</h1><p className="mt-1 text-sm text-slate-500">GA Academic Optimizer</p></div>
      <div className="mt-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm font-semibold">
        <button onClick={() => {setMode('signin');setError('');setMessage('');}} className={`rounded-lg px-3 py-2 ${mode === 'signin' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}>Sign in</button>
        <button onClick={() => {setMode('signup');setError('');setMessage('');}} className={`rounded-lg px-3 py-2 ${mode === 'signup' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}>Create account</button>
      </div>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-slate-700">Email address<div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-indigo-500"><Mail size={17} className="text-slate-400"/><input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-transparent py-3 outline-none" placeholder="you@college.edu"/></div></label>
        <label className="block text-sm font-medium text-slate-700">Password<div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-indigo-500"><LockKeyhole size={17} className="text-slate-400"/><input required minLength={8} type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-transparent py-3 outline-none" placeholder="At least 8 characters"/></div></label>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60">{busy && <LoaderCircle size={18} className="animate-spin"/>}{mode === 'signin' ? 'Sign in to EvoSchedule' : 'Create your account'}</button>
      </form>
      <p className="mt-5 text-center text-xs leading-5 text-slate-400">Your timetables are stored in your Supabase account and protected by row-level security.</p>
    </div>
  </div>;
};
