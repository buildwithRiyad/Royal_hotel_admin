import { useState } from 'react';
import axios from 'axios';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { RegisterInput } from '@/schemas/userSchemas';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/admin/login', { email, password });
      localStorage.setItem('access_token', res.data.access_token);
      router.push('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || 'Login failed');
      } else {
        alert('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    setLoading(true);
    try {
      await axiosInstance.post('/admin/register', data);
      await login(data.email, data.password);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || 'Registration failed');
      } else {
        alert('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  return { login, register, logout, loading };
};
