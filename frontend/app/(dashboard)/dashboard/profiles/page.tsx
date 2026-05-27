'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useUsers } from '@/hooks/useUsers';
import { useAdminResources, type ProfileInput } from '@/hooks/useAdminResources';

const profileSchema = z.object({
  userId: z.coerce.number().int().positive('User ID is required'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().optional(),
  country: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilesPage() {
  const { getUsers } = useUsers();
  const { getProfiles, createProfile, updateProfile, deleteProfile } = useAdminResources();
  const [users, setUsers] = useState<Array<{ id: number; name: string; email: string }>>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const refresh = async () => {
    try {
      const [usersData, profilesData] = await Promise.all([getUsers(), getProfiles()]);
      setUsers(usersData);
      setProfiles(profilesData);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError('Admin access required to manage profiles.');
        return;
      }
      setError('Failed to load profiles.');
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [usersData, profilesData] = await Promise.all([getUsers(), getProfiles()]);
        if (!mounted) return;
        setUsers(usersData);
        setProfiles(profilesData);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          setError('Admin access required to manage profiles.');
        } else {
          setError('Failed to load profiles.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [getProfiles, getUsers]);

  const onSubmit = async (data: ProfileFormValues) => {
    const payload: ProfileInput = {
      phone: data.phone,
      address: data.address,
      city: data.city,
      country: data.country,
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob,
      gender: data.gender,
    };

    if (editingUserId) {
      try {
        await updateProfile(editingUserId, payload);
        toast.success('Profile updated');
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          toast.error('Admin access required to update profiles.');
          return;
        }
        toast.error('Failed to update profile');
        return;
      }
    } else {
      try {
        await createProfile(data.userId, payload);
        toast.success('Profile created');
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          toast.error('Admin access required to create profiles.');
          return;
        }
        toast.error('Failed to create profile');
        return;
      }
    }

    setEditingUserId(null);
    reset();
    await refresh();
  };

  const startEdit = (profile: any) => {
    setEditingUserId(profile.userId ?? profile.user?.id ?? profile.id);
    reset({
      userId: Number(profile.userId ?? profile.user?.id ?? profile.id),
      phone: profile.phone ?? '',
      address: profile.address ?? '',
      city: profile.city ?? '',
      country: profile.country ?? '',
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      dob: profile.dob?.slice?.(0, 10) ?? profile.dob ?? '',
      gender: profile.gender ?? '',
    });
  };

  const handleDelete = async (userId: number | string) => {
    if (!confirm('Delete this profile?')) return;
    try {
      await deleteProfile(userId);
      toast.success('Profile deleted');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        toast.error('Admin access required to delete profiles.');
        return;
      }
      toast.error('Failed to delete profile');
      return;
    }
    await refresh();
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading profiles...</div>;
  if (error) return <div className="rounded-2xl bg-white p-6 text-center text-red-600 shadow-xl">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-amber-800">Profiles</h1>
            <p className="text-gray-500">Manage guest profile data linked to users.</p>
          </div>
          <button type="button" onClick={() => { setEditingUserId(null); reset(); }} className="border border-amber-700 text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-50">New Profile</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <select {...register('userId')} className="w-full border border-gray-300 rounded-lg p-3 md:col-span-2">
            <option value="">Select user</option>
            {users.map((user) => <option key={user.id} value={user.id}>{user.name} - {user.email}</option>)}
          </select>
          {errors.userId && <p className="text-red-500 text-sm md:col-span-2">{errors.userId.message}</p>}
          <input {...register('firstName')} placeholder="First Name" className="w-full border border-gray-300 rounded-lg p-3" />
          <input {...register('lastName')} placeholder="Last Name" className="w-full border border-gray-300 rounded-lg p-3" />
          <input {...register('phone')} placeholder="Phone" className="w-full border border-gray-300 rounded-lg p-3" />
          <input {...register('dob')} type="date" className="w-full border border-gray-300 rounded-lg p-3" />
          <input {...register('city')} placeholder="City" className="w-full border border-gray-300 rounded-lg p-3" />
          <input {...register('country')} placeholder="Country" className="w-full border border-gray-300 rounded-lg p-3" />
          <input {...register('gender')} placeholder="Gender" className="w-full border border-gray-300 rounded-lg p-3" />
          <input {...register('address')} placeholder="Address" className="w-full border border-gray-300 rounded-lg p-3 md:col-span-2" />
          <div className="md:col-span-2 flex gap-3">
            <button disabled={isSubmitting} type="submit" className="bg-amber-700 text-white px-5 py-3 rounded-lg hover:bg-amber-800 transition">{editingUserId ? 'Update Profile' : 'Create Profile'}</button>
            {editingUserId && <button type="button" onClick={() => { setEditingUserId(null); reset(); }} className="border border-gray-300 px-5 py-3 rounded-lg">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
        <h2 className="text-xl font-bold text-amber-800 mb-4">All Profiles</h2>
        <table className="w-full text-left">
          <thead className="bg-amber-100">
            <tr><th className="p-3">User</th><th>Phone</th><th>Address</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id} className="border-b hover:bg-amber-50">
                <td className="p-3">{profile.user?.name || profile.userId || '-'}</td>
                <td>{profile.phone}</td>
                <td>{profile.address}</td>
                <td className="space-x-3">
                  <button onClick={() => startEdit(profile)} className="text-green-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(profile.userId ?? profile.user?.id ?? profile.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}