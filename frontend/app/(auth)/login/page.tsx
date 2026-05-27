'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/schemas/userSchemas';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-96">
      <h1 className="text-3xl font-serif font-bold text-center text-amber-800">Login</h1>
      <p className="text-center text-gray-500 mb-6">Access Hotel Royal</p>
      <form onSubmit={handleSubmit(data => login(data.email, data.password))} className="space-y-4">
        <input {...register('email')} placeholder="Email Address" className="w-full border border-gray-300 rounded-lg p-3" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        <input {...register('password')} type="password" placeholder="Password" className="w-full border border-gray-300 rounded-lg p-3" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        <button type="submit" disabled={loading} className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition">
          Sign In
        </button>
      </form>
      <p className="mt-4 text-center">New user? <a href="/register" className="text-amber-700">Create account</a></p>
    </div>
  );
}
