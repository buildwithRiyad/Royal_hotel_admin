'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useUsers } from '@/hooks/useUsers';
import { useAdminResources, type BookingInput } from '@/hooks/useAdminResources';

const bookingSchema = z.object({
  userId: z.coerce.number().int().positive('User ID is required'),
  roomNumber: z.string().min(1, 'Room number is required'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  roomType: z.string().optional(),
  guestCount: z.coerce.number().int().min(1).optional(),
  price: z.coerce.number().min(0).optional(),
  paymentStatus: z.string().optional(),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingsPage() {
  const { getUsers } = useUsers();
  const { getBookings, createBooking, updateBooking, deleteBooking } = useAdminResources();
  const [users, setUsers] = useState<Array<{ id: number; name: string; email: string }>>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { paymentStatus: 'unpaid' },
  });

  const refresh = async () => {
    try {
      const [usersData, bookingsData] = await Promise.all([getUsers(), getBookings()]);
      setUsers(usersData);
      setBookings(bookingsData);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError('Admin access required to manage bookings.');
        return;
      }
      setError('Failed to load bookings.');
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [usersData, bookingsData] = await Promise.all([getUsers(), getBookings()]);
        if (!mounted) return;
        setUsers(usersData);
        setBookings(bookingsData);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          setError('Admin access required to manage bookings.');
        } else {
          setError('Failed to load bookings.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [getBookings, getUsers]);

  const onSubmit = async (data: BookingFormValues) => {
    const payload: BookingInput = {
      roomNumber: data.roomNumber,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      roomType: data.roomType,
      guestCount: data.guestCount,
      price: data.price,
      paymentStatus: data.paymentStatus,
      specialRequests: data.specialRequests,
    };

    if (editingId) {
      try {
        await updateBooking(editingId, payload);
        toast.success('Booking updated');
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          toast.error('Admin access required to update bookings.');
          return;
        }
        toast.error('Failed to update booking');
        return;
      }
    } else {
      try {
        await createBooking(data.userId, payload);
        toast.success('Booking created');
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          toast.error('Admin access required to create bookings.');
          return;
        }
        toast.error('Failed to create booking');
        return;
      }
    }

    setEditingId(null);
    reset({ paymentStatus: 'unpaid' });
    await refresh();
  };

  const startEdit = (booking: any) => {
    setEditingId(booking.id);
    reset({
      userId: Number(booking.userId ?? booking.user?.id ?? 0),
      roomNumber: booking.roomNumber ?? '',
      checkIn: booking.checkIn?.slice?.(0, 10) ?? booking.checkIn ?? '',
      checkOut: booking.checkOut?.slice?.(0, 10) ?? booking.checkOut ?? '',
      roomType: booking.roomType ?? '',
      guestCount: booking.guestCount ?? undefined,
      price: booking.price ?? undefined,
      paymentStatus: booking.paymentStatus ?? 'unpaid',
      specialRequests: booking.specialRequests ?? '',
    });
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('Delete this booking?')) return;
    try {
      await deleteBooking(id);
      toast.success('Booking deleted');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        toast.error('Admin access required to delete bookings.');
        return;
      }
      toast.error('Failed to delete booking');
      return;
    }
    await refresh();
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading bookings...</div>;
  if (error) return <div className="rounded-2xl bg-white p-6 text-center text-red-600 shadow-xl">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-amber-800">Bookings</h1>
            <p className="text-gray-500">Create and manage room bookings from the admin panel.</p>
          </div>
          <button type="button" onClick={() => { setEditingId(null); reset({ paymentStatus: 'unpaid' }); }} className="border border-amber-700 text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-50">
            New Booking
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <select {...register('userId')} className="w-full border border-gray-300 rounded-lg p-3 md:col-span-2">
            <option value="">Select user</option>
            {users.map((user) => <option key={user.id} value={user.id}>{user.name} - {user.email}</option>)}
          </select>
          {errors.userId && <p className="text-red-500 text-sm md:col-span-2">{errors.userId.message}</p>}
          <input {...register('roomNumber')} placeholder="Room Number" className="w-full border border-gray-300 rounded-lg p-3" />
          <input {...register('roomType')} placeholder="Room Type" className="w-full border border-gray-300 rounded-lg p-3" />
          <input {...register('checkIn')} type="date" className="w-full border border-gray-300 rounded-lg p-3" />
          <input {...register('checkOut')} type="date" className="w-full border border-gray-300 rounded-lg p-3" />
          <input {...register('guestCount')} type="number" placeholder="Guest Count" className="w-full border border-gray-300 rounded-lg p-3" />
          <input {...register('price')} type="number" placeholder="Price" className="w-full border border-gray-300 rounded-lg p-3" />
          <select {...register('paymentStatus')} className="w-full border border-gray-300 rounded-lg p-3">
            <option value="unpaid">unpaid</option>
            <option value="paid">paid</option>
          </select>
          <input {...register('specialRequests')} placeholder="Special Requests" className="w-full border border-gray-300 rounded-lg p-3 md:col-span-2" />
          <div className="md:col-span-2 flex gap-3">
            <button disabled={isSubmitting} type="submit" className="bg-amber-700 text-white px-5 py-3 rounded-lg hover:bg-amber-800 transition">{editingId ? 'Update Booking' : 'Create Booking'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); reset({ paymentStatus: 'unpaid' }); }} className="border border-gray-300 px-5 py-3 rounded-lg">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
        <h2 className="text-xl font-bold text-amber-800 mb-4">All Bookings</h2>
        <table className="w-full text-left">
          <thead className="bg-amber-100">
            <tr><th className="p-3">Room</th><th>User</th><th>Dates</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b hover:bg-amber-50">
                <td className="p-3">{booking.roomNumber}</td>
                <td>{booking.user?.name || booking.userId || '-'}</td>
                <td>{booking.checkIn} to {booking.checkOut}</td>
                <td>{booking.paymentStatus || 'unpaid'}</td>
                <td className="space-x-3">
                  <button onClick={() => startEdit(booking)} className="text-green-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(booking.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}