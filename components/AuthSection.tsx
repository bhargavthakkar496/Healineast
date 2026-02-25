'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthMode = 'signin' | 'signup';

export default function AuthSection() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submitAuth(formData: FormData) {
    setLoading(true);
    setMessage(null);
    setError(null);

    const payload =
      mode === 'signin'
        ? {
            email: formData.get('email'),
            password: formData.get('password'),
          }
        : {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            password: formData.get('password'),
            country: formData.get('country'),
          };

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) as { error?: string } : {};
      if (!res.ok) {
        setError(data.error || 'Authentication failed. Please check your details and try again.');
        return;
      }

      setMessage(mode === 'signin' ? 'Signed in successfully. Redirecting…' : 'Account created successfully. Redirecting…');
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl rounded-2xl border bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex rounded-xl bg-slate-100 p-1 text-sm">
        <button
          type="button"
          onClick={() => {
            setMode('signin');
            setMessage(null);
            setError(null);
          }}
          className={`flex-1 rounded-lg px-3 py-2 font-medium transition ${
            mode === 'signin' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signup');
            setMessage(null);
            setError(null);
          }}
          className={`flex-1 rounded-lg px-3 py-2 font-medium transition ${
            mode === 'signup' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Sign up
        </button>
      </div>

      {mode === 'signin' ? (
        <form className="grid gap-3" onSubmit={(event) => {
          event.preventDefault();
          void submitAuth(new FormData(event.currentTarget));
        }}>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Email</span>
            <input name="email" type="email" required placeholder="you@example.com" className="rounded-xl border px-4 py-3" />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Password</span>
            <input name="password" type="password" required minLength={8} placeholder="••••••••" className="rounded-xl border px-4 py-3" />
          </label>
          <button disabled={loading} className="mt-2 rounded-xl bg-brand-600 px-4 py-3 font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      ) : (
        <form className="grid gap-3" onSubmit={(event) => {
          event.preventDefault();
          void submitAuth(new FormData(event.currentTarget));
        }}>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Full name</span>
            <input name="fullName" required placeholder="Your full name" className="rounded-xl border px-4 py-3" />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Email</span>
            <input name="email" type="email" required placeholder="you@example.com" className="rounded-xl border px-4 py-3" />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Password</span>
            <input name="password" type="password" required minLength={8} placeholder="Create a password" className="rounded-xl border px-4 py-3" />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-slate-700">Country</span>
            <input name="country" required placeholder="Country of residence" className="rounded-xl border px-4 py-3" />
          </label>
          <button disabled={loading} className="mt-2 rounded-xl bg-brand-600 px-4 py-3 font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
    </section>
  );
}
