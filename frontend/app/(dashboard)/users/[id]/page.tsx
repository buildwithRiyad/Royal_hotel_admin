'use client';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { User } from '@/types';
import { AxiosError } from 'axios';

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { getUser } = useUsers();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);
  const userId = Number(resolvedParams.id);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getUser(userId);
        setUser(data);
      } catch (error) {
        if (error instanceof AxiosError && (error.response?.status === 400 || error.response?.status === 404)) {
          setUser(null);
          return;
        }
        throw error;
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [getUser, userId]);

  if (loading) return <div className="text-center py-10">Loading user...</div>;
  if (!user) return <div className="text-center py-10">User not found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-amber-800">User Details</h1>
        <Link href={`/users/${user.id}/edit`} className="text-amber-700 hover:underline">
          Edit
        </Link>
      </div>
      <div className="space-y-3 text-gray-700">
        <p><span className="font-semibold">Name:</span> {user.name}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        <p><span className="font-semibold">Role:</span> {user.role}</p>
        <p><span className="font-semibold">NID:</span> {user.nidNumber}</p>
      </div>
      <div className="mt-8">
        <Link href="/users" className="text-blue-600 hover:underline">Back to Users</Link>
      </div>
    </div>
  );
}
