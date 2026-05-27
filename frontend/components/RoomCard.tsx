import Link from 'next/link';

interface RoomCardProps {
  name: string;
  type: string;
  price: number;
  image?: string;
}

export default function RoomCard({ name, type, price, image }: RoomCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
      <div className="h-48 bg-gradient-to-r from-amber-200 to-amber-400 flex items-center justify-center text-gray-700">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-lg">🏨</span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-amber-800">{name}</h3>
        <p className="text-gray-500 text-sm">{type}</p>
        <p className="text-amber-700 font-semibold mt-2">PER NIGHT<br/>₺{price.toLocaleString()}</p>
        <Link href="/dashboard" className="block text-center mt-4 bg-amber-700 text-white py-2 rounded-lg hover:bg-amber-800 transition">
          BOOK NOW
        </Link>
      </div>
    </div>
  );
}
