
export default function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="container py-8 text-sm text-slate-600 flex flex-col md:flex-row gap-2 md:gap-6 justify-between">
        <p>© {new Date().getFullYear()} HealinginEast. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="/legal">Privacy</a>
          <a href="/legal">Terms</a>
          <a href="/help-center">Help Center</a>
        </div>
      </div>
    </footer>
  );
}
