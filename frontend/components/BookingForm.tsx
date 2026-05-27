
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';

export default function BookingForm() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', checkIn: '', checkOut: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push({ ...form, id: Date.now(), createdAt: new Date().toISOString() });
    localStorage.setItem('bookings', JSON.stringify(bookings));

    const token = localStorage.getItem('access_token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      await axiosInstance.post('/api/notify', { userId: payload.id, message: `New booking from ${form.fullName}` });
    }
    toast.success('Room booked successfully!');
    router.push('/dashboard');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <input type="text" placeholder="FULL NAME" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
        <input type="email" placeholder="EMAIL ADDRESS" className="w-full border border-gray-300 rounded-lg p-3" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <input type="tel" placeholder="PHONE NUMBER" className="w-full border border-gray-300 rounded-lg p-3" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
        <input type="date" className="w-full border border-gray-300 rounded-lg p-3" value={form.checkIn} onChange={e => setForm({...form, checkIn: e.target.value})} required />
        <input type="date" className="w-full border border-gray-300 rounded-lg p-3" value={form.checkOut} onChange={e => setForm({...form, checkOut: e.target.value})} required />
      </div>
      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="bg-amber-700 text-white px-8 py-2 rounded-lg hover:bg-amber-800 transition">
          {loading ? 'Booking...' : 'BOOK NOW'}
        </button>
        <button type="button" onClick={() => router.back()} className="border border-gray-300 px-8 py-2 rounded-lg">BACK</button>
      </div>
    </form>
  );
}
