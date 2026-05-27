'use client';
import RoomCard from '@/components/RoomCard';

const rooms = [
  { name: 'Deluxe Room', type: 'STANDARD COMFORT', price: 3500 },
  { name: 'Single Standard', type: 'EXECUTIVE SUITE', price: 1500 },
  { name: 'Family Suite', type: 'PREMIUM LOUNGE', price: 6000 },
  { name: 'Presidential Suite', type: 'ROYAL LUXURY', price: 12000 },
];

export default function RoomsPage() {
  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-center mb-8 text-amber-800">Available Rooms</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rooms.map(room => <RoomCard key={room.name} {...room} />)}
      </div>
    </div>
  );
}
