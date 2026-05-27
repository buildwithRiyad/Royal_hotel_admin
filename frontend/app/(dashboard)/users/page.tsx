'use client';
import { useEffect, useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { User } from '@/types';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const { getUsers, deleteUser, assignRole } = useUsers();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await getUsers();
      if (!mounted) return;
      setUsers(data);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [getUsers]);

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Delete ${name}?`)) {
      try {
        await deleteUser(id);
        await refreshUsers();
        toast.success(`${name} deleted`);
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete user');
        return;
      }
      const token = localStorage.getItem('access_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: payload.id, message: `${name} was deleted` }),
        });
      }
    }
  };

  const handleRoleChange = async (id: number, newRole: string, name: string) => {
    try {
      await assignRole(id, newRole);
      await refreshUsers();
      toast.success(`${name}'s role updated`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to assign role');
      return;
    }
    const token = localStorage.getItem('access_token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: payload.id, message: `${name}'s role changed to ${newRole}` }),
      });
    }
  };

  if (loading) return <div className="text-center py-10">Loading users...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-amber-800">All Users</h1>
        <Link href="/users/create" className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800">+ Create User</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-amber-100">
            <tr><th className="p-3">Name</th><th>Email</th><th>Role</th><th>NID</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-amber-50">
                <td className="p-3">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value, user.name)} className="border rounded p-1">
                    <option value="admin">admin</option><option value="manager">manager</option>
                    <option value="receptionist">receptionist</option><option value="customer">customer</option>
                  </select>
                </td>
                <td>{user.nidNumber}</td>
                <td className="space-x-2">
                  <Link href={`/users/${user.id}`} className="text-blue-600 hover:underline">View</Link>
                  <Link href={`/users/${user.id}/edit`} className="text-green-600 hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(user.id, user.name)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
