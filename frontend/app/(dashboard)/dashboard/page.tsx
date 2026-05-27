 'use client';
import { useSyncExternalStore, useMemo } from 'react';
import Link from 'next/link';
import { useNotifications } from '@/hooks/useNotifications';
import { jwtDecode } from 'jwt-decode';

type AuthTokenPayload = {
  id: number;
  name?: string;
};

const subscribeToAuthToken = (onStoreChange: () => void) => {
  window.addEventListener('storage', onStoreChange);
  return () => window.removeEventListener('storage', onStoreChange);
};

const getAuthTokenSnapshot = () => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('access_token');
  } catch {
    return null;
  }
};

export default function DashboardPage() {
  const token = useSyncExternalStore(subscribeToAuthToken, getAuthTokenSnapshot, () => null);
  const user = useMemo(() => {
    try {
      return token ? jwtDecode<AuthTokenPayload>(token) : null;
    } catch {
      return null;
    }
  }, [token]);

  useNotifications(user?.id);

  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <p className="text-gray-500">SIGNED IN AS</p>
        <h2 className="text-2xl font-bold text-amber-800">{user?.name || 'Guest'}</h2>
        <h1 className="text-4xl font-serif font-bold mt-4">HOTEL ROYAL</h1>
        <p className="text-gray-600 mt-2">Welcome, {user?.name}. Experience the pinnacle of luxury at Hotel Royal</p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link href="/rooms" className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800">Book a Room</Link>
          <Link href="/users" className="border border-amber-700 text-amber-700 px-6 py-2 rounded-lg hover:bg-amber-50">Manage Users</Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Link href="/dashboard/bookings" className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100 hover:border-amber-300 transition">
          <p className="text-sm uppercase tracking-[0.2em] text-amber-700">Bookings</p>
          <h3 className="text-xl font-bold text-slate-900 mt-2">Manage room reservations</h3>
          <p className="text-gray-600 mt-2">Create, edit, and delete bookings from the admin panel.</p>
        </Link>
        <Link href="/dashboard/profiles" className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100 hover:border-amber-300 transition">
          <p className="text-sm uppercase tracking-[0.2em] text-amber-700">Profiles</p>
          <h3 className="text-xl font-bold text-slate-900 mt-2">Manage guest profiles</h3>
          <p className="text-gray-600 mt-2">Create, update, and delete user profiles linked to guests.</p>
        </Link>
        <Link href="/dashboard/system" className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100 hover:border-amber-300 transition">
          <p className="text-sm uppercase tracking-[0.2em] text-amber-700">System</p>
          <h3 className="text-xl font-bold text-slate-900 mt-2">Logs, backup, restore</h3>
          <p className="text-gray-600 mt-2">Access operational endpoints from one place.</p>
        </Link>
      </div>
    </div>
  );
}
