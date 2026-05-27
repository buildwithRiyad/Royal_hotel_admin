'use client';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { registerSchema, RegisterInput } from '@/schemas/userSchemas';
import { useUsers } from '@/hooks/useUsers';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

export default function CreateUserPage() {
  const { createUser } = useUsers();
  const router = useRouter();
  const [nidImage, setNidImage] = useState<File | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema) as unknown as Resolver<RegisterInput>,
    defaultValues: { role: 'customer', nidNumber: '1234567890123' },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await createUser({ ...data, nidImage: nidImage ?? undefined });
      const token = localStorage.getItem('access_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: payload.id, message: 'New user created' }),
        });
      }
      router.push('/users');
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        alert(error.response.data?.message || 'User already exists');
        return;
      }
      throw error;
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8">
      <h1 className="text-2xl font-bold mb-6">Create User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('name')} placeholder="Name" className="w-full border p-3 rounded" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        <input {...register('email')} placeholder="Email" className="w-full border p-3 rounded" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        <input {...register('password')} type="password" placeholder="Password" className="w-full border p-3 rounded" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        <select {...register('role')} className="w-full border p-3 rounded">
          <option value="admin">admin</option><option value="manager">manager</option>
          <option value="receptionist">receptionist</option><option value="customer">customer</option>
        </select>
        <input {...register('nidNumber')} placeholder="NID Number" className="w-full border p-3 rounded" />
        {errors.nidNumber && <p className="text-red-500">{errors.nidNumber.message}</p>}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">NID Image</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => setNidImage(e.target.files?.[0] ?? null)}
            className="w-full border p-3 rounded"
          />
          <p className="text-xs text-gray-500">JPEG or PNG only, max 2MB.</p>
        </div>
        <button type="submit" className="bg-amber-700 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  );
}
