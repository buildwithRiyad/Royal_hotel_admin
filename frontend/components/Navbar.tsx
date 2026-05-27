
'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Intentionally set state on mount to read localStorage (client-only).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setMounted(true);
    try {
      setToken(localStorage.getItem('access_token'));
    } catch {
      setToken(null);
    }
  }, []);

  if (!mounted) {
    return (
      <nav className="bg-gradient-to-r from-amber-900 to-amber-700 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-serif font-bold tracking-wide">
            HOTEL ROYAL
          </Link>
          <div className="space-x-6">
            <Link href="/rooms" className={`hover:text-amber-200 transition ${pathname === '/rooms' ? 'text-amber-200' : ''}`}>
              Rooms
            </Link>
            <Link href="/login" className="hover:text-amber-200">
              Login
            </Link>
            <Link href="/register" className="hover:text-amber-200">
              Register
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-amber-900 to-amber-700 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-serif font-bold tracking-wide">
          HOTEL ROYAL
        </Link>
        <div className="space-x-6">
          <Link
            href="/rooms"
            className={`hover:text-amber-200 transition ${pathname === '/rooms' ? 'text-amber-200' : ''}`}
          >
            Rooms
          </Link>
          {token ? (
            <>
              <Link href="/dashboard" className="hover:text-amber-200">Dashboard</Link>
              <button onClick={logout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-amber-200">Login</Link>
              <Link href="/register" className="hover:text-amber-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
