'use client';
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/schemas/userSchemas';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const { register: registerUser, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema) as unknown as Resolver<RegisterInput>,
    defaultValues: { role: 'customer', nidNumber: '1234567890123' },
  });

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    await registerUser(data);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-96 max-h-[90vh] overflow-y-auto">
      <h1 className="text-3xl font-serif font-bold text-center text-amber-800">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <input {...register('name')} placeholder="Full Name" className="w-full border border-gray-300 rounded-lg p-3" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        <input {...register('email')} placeholder="Email" className="w-full border border-gray-300 rounded-lg p-3" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        <input {...register('password')} type="password" placeholder="Password" className="w-full border border-gray-300 rounded-lg p-3" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        <select {...register('role')} className="w-full border border-gray-300 rounded-lg p-3">
          <option value="customer">Customer</option>
          <option value="receptionist">Receptionist</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <input {...register('nidNumber')} placeholder="NID Number (13 or 17 digits)" className="w-full border border-gray-300 rounded-lg p-3" />
        {errors.nidNumber && <p className="text-red-500 text-sm">{errors.nidNumber.message}</p>}
        <button type="submit" disabled={loading} className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition">
          Register
        </button>
      </form>
    </div>
  );
}
