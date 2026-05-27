'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useUsers } from '@/hooks/useUsers';
import { User } from '@/types';
import { updateUserSchema, UpdateUserInput } from '@/schemas/userSchemas';
import { use } from 'react';
import { AxiosError } from 'axios';

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { getUser, updateUser } = useUsers();
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const resolvedParams = use(params);
  const userId = Number(resolvedParams.id);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data: User = await getUser(userId);
        reset({
          name: data.name,
          email: data.email,
          role: data.role,
          nidNumber: data.nidNumber,
        });
        setNotFound(false);
      } catch (error) {
        if (error instanceof AxiosError && (error.response?.status === 400 || error.response?.status === 404)) {
          setNotFound(true);
          return;
        }
        throw error;
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [getUser, reset, userId]);

  const onSubmit = async (data: UpdateUserInput) => {
    try {
      await updateUser(userId, data);
      router.push(`/users/${userId}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        setNotFound(true);
        return;
      }
      throw error;
    }
  };

  if (loadingUser) return <div className="text-center py-10">Loading user...</div>;
  if (notFound) return <div className="text-center py-10">User not found.</div>;

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8">
      <h1 className="text-2xl font-bold mb-6 text-amber-800">Edit User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('name')} placeholder="Name" className="w-full border p-3 rounded" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        <input {...register('email')} placeholder="Email" className="w-full border p-3 rounded" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        <select {...register('role')} className="w-full border p-3 rounded">
          <option value="admin">admin</option>
          <option value="manager">manager</option>
          <option value="receptionist">receptionist</option>
          <option value="customer">customer</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        <input {...register('nidNumber')} placeholder="NID Number" className="w-full border p-3 rounded" />
        {errors.nidNumber && <p className="text-red-500 text-sm">{errors.nidNumber.message}</p>}
        <button type="submit" disabled={isSubmitting} className="bg-amber-700 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
