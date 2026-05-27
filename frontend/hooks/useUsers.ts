import { useCallback } from 'react';
import axiosInstance from '@/lib/axios';
import { User } from '@/types';
import { RegisterInput } from '@/schemas/userSchemas';
import { UpdateUserInput } from '@/schemas/userSchemas';

export const useUsers = () => {
  const getUsers = useCallback(async (): Promise<User[]> => {
    const res = await axiosInstance.get('/admin/all');
    return res.data;
  }, []);

  const getUser = useCallback(async (id: number): Promise<User> => {
    const res = await axiosInstance.get(`/admin/by-id/${id}`);
    return res.data;
  }, []);

  const createUser = useCallback(async (data: RegisterInput & { nidImage?: File }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val === undefined || val === null) return;
      if (val instanceof File) {
        formData.append(key, val);
        return;
      }
      formData.append(key, String(val));
    });
    const res = await axiosInstance.post('/admin', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }, []);

  const updateUser = useCallback(async (id: number, data: UpdateUserInput) => {
    const res = await axiosInstance.put(`/admin/by-id/${id}`, data);
    return res.data;
  }, []);

  const assignRole = useCallback(async (id: number, role: string) => {
    try {
      const res = await axiosInstance.patch(`/admin/by-id/${id}/role`, { role });
      return res.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Failed to assign role';
      throw new Error(msg);
    }
  }, []);

  const deleteUser = useCallback(async (id: number) => {
    try {
      await axiosInstance.delete(`/admin/by-id/${id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Failed to delete user';
      throw new Error(msg);
    }
  }, []);

  return { getUsers, getUser, createUser, updateUser, assignRole, deleteUser };
};
