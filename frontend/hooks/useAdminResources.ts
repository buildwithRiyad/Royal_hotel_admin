import { useCallback } from 'react';
import axiosInstance from '@/lib/axios';

export type BookingInput = {
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  roomType?: string;
  guestCount?: number;
  price?: number;
  paymentStatus?: string;
  specialRequests?: string;
};

export type ProfileInput = {
  phone: string;
  address: string;
  city?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
};

export const useAdminResources = () => {
  const getBookings = useCallback(async () => {
    const res = await axiosInstance.get('/admin/bookings');
    return res.data;
  }, []);

  const getBooking = useCallback(async (id: number | string) => {
    const res = await axiosInstance.get(`/admin/bookings/${id}`);
    return res.data;
  }, []);

  const createBooking = useCallback(async (userId: number | string, data: BookingInput) => {
    const res = await axiosInstance.post(`/admin/users/${userId}/bookings`, data);
    return res.data;
  }, []);

  const updateBooking = useCallback(async (id: number | string, data: Partial<BookingInput>) => {
    const res = await axiosInstance.patch(`/admin/bookings/${id}`, data);
    return res.data;
  }, []);

  const deleteBooking = useCallback(async (id: number | string) => {
    await axiosInstance.delete(`/admin/bookings/${id}`);
  }, []);

  const getProfiles = useCallback(async () => {
    const res = await axiosInstance.get('/admin/profiles');
    return res.data;
  }, []);

  const getProfile = useCallback(async (userId: number | string) => {
    const res = await axiosInstance.get(`/admin/users/${userId}/profile`);
    return res.data;
  }, []);

  const createProfile = useCallback(async (userId: number | string, data: ProfileInput) => {
    const res = await axiosInstance.post(`/admin/users/${userId}/profile`, data);
    return res.data;
  }, []);

  const updateProfile = useCallback(async (userId: number | string, data: Partial<ProfileInput>) => {
    const res = await axiosInstance.put(`/admin/users/${userId}/profile`, data);
    return res.data;
  }, []);

  const deleteProfile = useCallback(async (userId: number | string) => {
    await axiosInstance.delete(`/admin/users/${userId}/profile`);
  }, []);

  const getLogs = useCallback(async () => {
    const res = await axiosInstance.get('/admin/logs/all');
    return res.data;
  }, []);

  const backup = useCallback(async () => {
    const res = await axiosInstance.post('/admin/backup');
    return res.data;
  }, []);

  const restore = useCallback(async (payload: any) => {
    const res = await axiosInstance.post('/admin/restore', payload);
    return res.data;
  }, []);

  return {
    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking,
    getProfiles,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    getLogs,
    backup,
    restore,
  };
};