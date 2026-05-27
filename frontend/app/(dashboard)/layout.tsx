'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) router.push('/login');
  }, [router]);

  const navItems = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/users', label: 'Users' },
    { href: '/dashboard/bookings', label: 'Bookings' },
    { href: '/dashboard/profiles', label: 'Profiles' },
    { href: '/dashboard/system', label: 'System' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-100">
      <div className="border-b border-amber-100 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700">Hotel Royal Admin</p>
            <h1 className="text-2xl font-serif font-bold text-slate-900">Dashboard</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${active ? 'bg-amber-700 text-white shadow-md' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
