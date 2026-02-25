'use client';

import { useState } from 'react';

type AuthMode = 'signin' | 'signup';

export default function AuthSection() {
  const [mode, setMode] = useState<AuthMode>('signin');

  return (
    <section className="mx-auto max-w-xl rounded-2xl border bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex rounded-xl bg-slate-100 p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode('signin')}
          className={`flex-1 rounded-lg px-3 py-2 font-medium transition ${
            mode === 'signin' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`flex-1 rounded-lg px-3 py-2 font-medium transition ${
            mode === 'signup' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Sign up
        </button>
      </div>

      {mode === 'signin' ? (
        <form className="grid gap-3" action="#">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Email</span>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="rounded-xl border px-4 py-3"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Password</span>
            <input
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
              className="rounded-xl border px-4 py-3"
            />
          </label>
          <button className="mt-2 rounded-xl bg-brand-600 px-4 py-3 font-medium text-white hover:bg-brand-700">
            Sign in
          </button>
          <p className="text-xs text-slate-500">Forgot your password? Contact support and our team will help you reset access.</p>
        </form>
      ) : (
        <form className="grid gap-3" action="#">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Full name</span>
            <input required placeholder="Your full name" className="rounded-xl border px-4 py-3" />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Email</span>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="rounded-xl border px-4 py-3"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Password</span>
            <input
              type="password"
              required
              minLength={8}
              placeholder="Create a password"
              className="rounded-xl border px-4 py-3"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Country</span>
            <input required placeholder="Country of residence" className="rounded-xl border px-4 py-3" />
          </label>
          <button className="mt-2 rounded-xl bg-brand-600 px-4 py-3 font-medium text-white hover:bg-brand-700">
            Create account
          </button>
          <p className="text-xs text-slate-500">By signing up, you agree to receive care coordination updates on email and WhatsApp.</p>
        </form>
      )}
    </section>
  );
}
