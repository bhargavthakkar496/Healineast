import AuthSection from '@/components/AuthSection';

export default function AuthPage() {
  return (
    <div className="space-y-8">
      <section className="mx-auto max-w-2xl space-y-3 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Welcome back to HealinginEast</h1>
        <p className="text-slate-600">
          Sign in to track treatment quotes, manage travel support requests, and stay connected with your care coordinator. New patient? Create your account in under a minute.
        </p>
      </section>
      <AuthSection />
    </div>
  );
}
